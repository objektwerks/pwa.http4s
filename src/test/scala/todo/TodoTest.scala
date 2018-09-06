package todo

import java.time.LocalDate

import cats.effect.IO
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
    .unsafeRunSync()
  val client = Http1Client[IO]().unsafeRunSync()

  override protected def afterAll(): Unit = {
    server.shutdownNow()
    client.shutdownNow()
  }

  test("todo") {
    val todo = Todo(task = "wash car", assigned = LocalDate.now.toString)
    assert(post(todo) == 1)
    assert(get == 1)
    val completedTodo = todo.copy(completed = Some(LocalDate.now.toString))
    assert(put(todo) == 1)
    assert(delete(completedTodo.id) == 1)
    assert(get == 0)
  }

  def post(todo: Todo): Int = {
    val post = Request[IO](Method.POST, uri("http://localhost:7979/api/v1/todo")).withBody(todo)
    client.expect[Int](post).unsafeRunSync()
  }

  def get: Int = {
    val get = Request[IO](Method.GET, uri("http://localhost:7979/api/v1/todos"))
    val todos = client.expect[List[Todo]](get).unsafeRunSync()
    todos.foreach(println)
    todos.length
  }

  def put(todo: Todo): Int = {
    val put = Request[IO](Method.PUT, uri("http://localhost:7979/api/v1/todo")).withBody(todo)
    client.expect[Int](put).unsafeRunSync()
  }

  def delete(id: Int): Int = {
    val url = s"http://localhost:7979/api/v1/todos/$id"
    val delete = Request[IO](Method.DELETE, Uri.fromString(url).toOption.get)
    client.expect[Int](delete).unsafeRunSync()
  }
}