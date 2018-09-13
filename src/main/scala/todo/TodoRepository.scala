package todo

import java.sql.Timestamp

import cats.effect._
import doobie._
import doobie.implicits._
import todo.Todo.{Inserted, Updated}

import scala.io.Source
import scala.util.Try

class TodoRepository(xa: Transactor[IO], schema: String) {

  import TodoRepository._

  Try(select.length) recover { case _ => init(schema) }

  def init(schemaPath: String): Int = {
    val schema = Source.fromInputStream(getClass.getResourceAsStream(schemaPath)).mkString
    Fragment.const(schema).update.run.transact(xa).unsafeRunSync
  }

  def select: List[Todo] = selectTodos.to[List].transact(xa).unsafeRunSync

  def insert(todo: Todo): Inserted =
    Inserted(insertTodo.toUpdate0((todo.task, todo.opened, todo.closed))
      .withUniqueGeneratedKeys[Int]("id").transact(xa).unsafeRunSync)

  def update(todo: Todo): Updated =
    Updated(updateTodo.toUpdate0((todo.task, todo.closed, todo.id))
      .run.transact(xa).unsafeRunSync)
}

object TodoRepository {
  val selectTodos = sql"select * from todo order by opened desc".query[Todo]
  val insertTodo = Update[(String, Timestamp, Option[Timestamp])]("insert into todo(task, opened, closed) values (?, ?, ?)")
  val updateTodo = Update[(String, Option[Timestamp], Int)]("update todo set task = ?, closed = ? where id = ?")

  def apply(xa: Transactor[IO], schema: String): TodoRepository = new TodoRepository(xa, schema)
}