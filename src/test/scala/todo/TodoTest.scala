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
  val todosUri = uri("http://localhost:7979/api/v1/todos")

  override protected def afterAll(): Unit = {
    server.shutdownNow
    client.shutdownNow
  }

  test("post") {
    val todo = Todo(task = "buy beer")
    val id = post(todo)
    assert(id == 1)
  }

  test("get") {
    val todos = get
    assert(todos.length == 1)
  }

  test("put") {
    val todo = get.head
    val completedTodo = todo.copy(completed = Some(Timestamp.from(Instant.now)))
    assert(put(completedTodo) == 1)
  }

  test("delete") {
    val todo = get.head
    assert(delete(todo.id) == 1)
    assert(get.isEmpty)
    assert(post(Todo(task = "drink beer")) == 2)
  }

  def post(todo: Todo): Int = {
    val post = Request[IO](Method.POST, todosUri).withBody(todo.asJson)
    client.expect[Int](post).unsafeRunSync
  }

  def get: List[Todo] = {
    val get = Request[IO](Method.GET, todosUri)
    client.expect[List[Todo]](get).unsafeRunSync
  }

  def put(todo: Todo): Int = {
    val put = Request[IO](Method.PUT, todosUri).withBody(todo.asJson)
    client.expect[Int](put).unsafeRunSync
  }

  def delete(id: Int): Int = {
    val url = s"${todosUri.toString}/$id"
    val delete = Request[IO](Method.DELETE, Uri.unsafeFromString(url))
    client.expect[Int](delete).unsafeRunSync
  }
}