package todo

import java.sql.Timestamp

import cats.effect._
import doobie._
import doobie.implicits._

import scala.io.Source

case class TodoRepository(xa: Transactor[IO], schema: String, init: Boolean = false) {
  val selectTodos = sql"select * from todo".query[Todo]
  val insertTodo = Update[(String, Timestamp, Option[Timestamp])]("insert into todo(task, assigned, completed) values (?, ?, ?)")
  val updateTodo = Update[(String, Option[Timestamp], Int)]("update todo set task = ?, completed = ? where id = ?")
  val deleteTodo = Update[Int]("delete from todo where id = ?")

  if (init) init(schema)

  def init(schemaPath: String): Int = {
    val schema = Source.fromInputStream(getClass.getResourceAsStream(schemaPath)).mkString
    Fragment.const(schema).update.run.transact(xa).unsafeRunSync
  }

  def select: List[Todo] = selectTodos.to[List].transact(xa).unsafeRunSync

  def insert(todo: Todo): Int = {
    val insert = for {
      id <- insertTodo.toUpdate0((todo.task, todo.assigned, todo.completed)).withUniqueGeneratedKeys[Int]("id")
    } yield id
    insert.transact(xa).unsafeRunSync
  }

  def update(todo: Todo): Int = updateTodo.toUpdate0((todo.task, todo.completed, todo.id)).run.transact(xa).unsafeRunSync

  def delete(id: Int): Int = deleteTodo.toUpdate0(id).run.transact(xa).unsafeRunSync
}