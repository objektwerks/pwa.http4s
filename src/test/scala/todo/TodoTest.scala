package todo

import java.sql.Timestamp
import java.time.Instant

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s.circe._
import org.http4s.client.blaze.Http1Client
import org.http4s.dsl.io.uri
import org.http4s.server.blaze.BlazeBuilder
import org.http4s.{Method, Request, Uri}
import org.scalatest.{BeforeAndAfterAll, FunSuite, Matchers}

class TodoTest extends FunSuite with Matchers with BeforeAndAfterAll {
  import Todo._

  val todoRepositoryConfig = TodoRepositoryConfig("/schema.sql", "org.h2.Driver", "jdbc:h2:./target/testdb", "", "")
  val todoRepository = TodoRepository(todoRepositoryConfig, init = true)
  val todoService = TodoService(todoRepository)

  val server = BlazeBuilder[IO]
    .bindHttp(7979)
    .mountService(todoService.instance, "/api/v1")
    .start
    .unsafeRunSync
  val client = Http1Client[IO]().unsafeRunSync

  override protected def afterAll(): Unit = {
    server.shutdownNow
    client.shutdownNow
  }

  test("todo") {
    // Post
    val todo = Todo(task = "wash car")
    val id = post(todo)
    assert(id > 0)
    val todoWithId = todo.copy(id = id)
    println(todoWithId)

    // Get
    assert(get.length == 1)

    // Put
    val completedTodo = todoWithId.copy(completed = Some(Timestamp.from(Instant.now)))
    assert(put(completedTodo) == 1)
    println(completedTodo)

    // Delete
    assert(delete(completedTodo.id) == 1)

    // Get
    assert(get.isEmpty)

    // Post
    assert(post(Todo(task = "drink beer")) == 2)
  }

  def post(todo: Todo): Int = {
    val post = Request[IO](Method.POST, uri("http://localhost:7979/api/v1/todos")).withBody(todo.asJson)
    client.expect[Int](post).unsafeRunSync
  }

  def get: List[Todo] = {
    val get = Request[IO](Method.GET, uri("http://localhost:7979/api/v1/todos"))
    client.expect[List[Todo]](get).unsafeRunSync
  }

  def put(todo: Todo): Int = {
    val put = Request[IO](Method.PUT, uri("http://localhost:7979/api/v1/todos")).withBody(todo.asJson)
    client.expect[Int](put).unsafeRunSync
  }

  def delete(id: Int): Int = {
    val url = s"http://localhost:7979/api/v1/todos/$id"
    val delete = Request[IO](Method.DELETE, Uri.fromString(url).toOption.get)
    client.expect[Int](delete).unsafeRunSync
  }
}