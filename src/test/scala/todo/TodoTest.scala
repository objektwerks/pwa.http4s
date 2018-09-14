package todo

import java.sql.Timestamp
import java.time.Instant

import cats.effect.IO
import com.typesafe.config.ConfigFactory
import doobie.scalatest._
import doobie.util.transactor.Transactor
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s.circe._
import org.http4s.client.blaze.Http1Client
import org.http4s.server.blaze.BlazeBuilder
import org.http4s.{Method, Request, Uri}
import org.scalatest.{BeforeAndAfterAll, FunSuite}
import pureconfig.loadConfig
import todo.TodoConfig.Config

class TodoTest extends FunSuite with BeforeAndAfterAll with IOChecker {
  import Todo._

  val conf = loadConfig[Config](ConfigFactory.load("test.conf")).toOption.get
  val db = conf.database
  val xa = Transactor.fromDriverManager[IO](db.driver, db.url, db.user, db.password)
  val server = BlazeBuilder[IO]
    .bindHttp(conf.server.port, conf.server.host)
    .mountService(TodoService(TodoRepository(xa, db.schema)).instance, "/api/v1")
    .start
    .unsafeRunSync
  val client = Http1Client[IO]().unsafeRunSync
  val todosUri = Uri.unsafeFromString("http://localhost:7979/api/v1/todos")

  override def transactor: Transactor[IO] = xa

  override protected def afterAll(): Unit = {
    server.shutdownNow
    client.shutdownNow
  }

  test("check") {
    import TodoRepository._

    check(selectTodos)
    check(insertTodo)
    check(updateTodo)
  }

  test("post") {
    val todo = Todo(task = "buy beer")
    val inserted = post(todo)
    assert(inserted.id == 1)
  }

  test("get") {
    val todos = get
    assert(todos.size == 1)
  }

  test("put") {
    val (id, todo) = get.head
    assert(id == 1)
    val completedTodo = todo.copy(closed = Some(Timestamp.from(Instant.now)))
    assert(put(completedTodo).count == 1)
  }

  test("delete") {
    val todos = get
    val (id, todo) = todos.head
    println(todo)
    println(todo.asJson)
    println(todos)
    println(todos.asJson)
    assert(delete(id).count == 1)
    assert(get.isEmpty)
    assert(post(Todo(task = "drink beer")).id == 2)
  }

  def post(todo: Todo): Inserted = {
    val post = Request[IO](Method.POST, todosUri).withBody(todo.asJson)
    client.expect[Inserted](post).unsafeRunSync
  }

  def get: Map[Int, Todo] = {
    val get = Request[IO](Method.GET, todosUri)
    client.expect[Map[Int, Todo]](get).unsafeRunSync
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