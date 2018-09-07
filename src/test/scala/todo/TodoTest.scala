package todo

import java.sql.Timestamp
import java.time.Instant

import cats.effect.IO
import com.typesafe.config.ConfigFactory
import doobie.util.transactor.Transactor
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s.circe._
import org.http4s.client.blaze.Http1Client
import org.http4s.dsl.io.uri
import org.http4s.server.blaze.BlazeBuilder
import org.http4s.{Method, Request, Uri}
import org.scalatest.{BeforeAndAfterAll, FunSuite}
import pureconfig.loadConfig
import todo.TodoConfig.Config

class TodoTest extends FunSuite with BeforeAndAfterAll {
  import Todo._

  val server = for {
    config <- loadConfig[Config](ConfigFactory.load("test.conf"))
    database = config.database
    xa = Transactor.fromDriverManager[IO](
      database.driver,
      database.url,
      database.user,
      database.password)
    repository = TodoRepository(xa, database.schema)
    service = TodoService(repository)
    io = BlazeBuilder[IO]
      .bindHttp(config.server.port)
      .mountService(service.instance, "/api/v1")
      .start
      .unsafeRunSync
  } yield io
  val client = Http1Client[IO]().unsafeRunSync
  val todosUri = uri("http://localhost:7979/api/v1/todos")

  override protected def afterAll(): Unit = {
    server.map(s => s.shutdownNow)
    client.shutdownNow
  }

  test("post") {
    val todo = Todo(task = "buy beer")
    val inserted = post(todo)
    assert(inserted.id == 1)
  }

  test("get") {
    val todos = get
    assert(todos.length == 1)
  }

  test("put") {
    val todo = get.head
    val completedTodo = todo.copy(completed = Some(Timestamp.from(Instant.now)))
    assert(put(completedTodo).id == 1)
  }

  test("delete") {
    val todo = get.head
    assert(delete(todo.id).id == 1)
    assert(get.isEmpty)
    assert(post(Todo(task = "drink beer")).id == 2)
  }

  def post(todo: Todo): Inserted = {
    val post = Request[IO](Method.POST, todosUri).withBody(todo.asJson)
    client.expect[Inserted](post).unsafeRunSync
  }

  def get: List[Todo] = {
    val get = Request[IO](Method.GET, todosUri)
    client.expect[List[Todo]](get).unsafeRunSync
  }

  def put(todo: Todo): Updated = {
    val put = Request[IO](Method.PUT, todosUri).withBody(todo.asJson)
    client.expect[Updated](put).unsafeRunSync
  }

  def delete(id: Int): Deleted = {
    val url = s"${todosUri.toString}/$id"
    val delete = Request[IO](Method.DELETE, Uri.unsafeFromString(url))
    client.expect[Deleted](delete).unsafeRunSync
  }
}