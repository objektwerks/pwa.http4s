package todo

import java.time.LocalDate

import cats.effect.IO
import org.http4s.client.blaze.Http1Client
import org.http4s.dsl.io.uri
import org.http4s.server.blaze.BlazeBuilder
import org.http4s.{Method, Request}
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
    assert(post == 1)
    assert(get == 1)
  }

  def post: Int = {
    val todo = Todo(task = "wash car", assigned = LocalDate.now.toString)
    val post = Request[IO](Method.POST, uri("http://localhost:7979/api/v1/todo")).withBody(todo)
    val result = client.expect[Int](post).unsafeRunSync()
    assert(result == 1)
    result
  }

  def get: Int = {
    val get = Request[IO](Method.GET, uri("http://localhost:7979/api/v1/todos"))
    val todos = client.expect[List[Todo]](get).unsafeRunSync()
    val result = todos.length
    assert(result == 1)
    todos.foreach(println)
    result
  }
}