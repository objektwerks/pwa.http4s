package todo

import java.sql.Timestamp

import cats.effect._
import doobie._
import doobie.implicits._

import scala.io.Source

case class TodoRepositoryConfig(schema: String, driver: String, url: String, user: String, password: String)

case class TodoRepository(config: TodoRepositoryConfig, init: Boolean = false) {
  val xa = Transactor.fromDriverManager[IO](config.driver, config.url, config.user, config.password)
  val qSelect = sql"select * from todo".query[Todo]
  val uInsert = Update[(String, Timestamp, Option[Timestamp])]("insert into todo(task, assigned, completed) values (?, ?, ?)")
  val uUpdate = Update[(String, Option[Timestamp], Int)]("update todo set task = ?, completed = ? where id = ?")
  val uDelete = Update[Int]("delete from todo where id = ?")

  if (init) init(config.schema)

  def init(schemaPath: String): Int = {
    val schema = Source.fromInputStream(getClass.getResourceAsStream(schemaPath)).mkString
    Fragment.const(schema).update.run.transact(xa).unsafeRunSync
  }

  def select: List[Todo] = qSelect.to[List].transact(xa).unsafeRunSync

  def insert(todo: Todo): Int = {
    val insert = for {
      id <- uInsert.toUpdate0((todo.task, todo.assigned, todo.completed)).withUniqueGeneratedKeys[Int]("id")
    } yield id
    insert.transact(xa).unsafeRunSync
  }

  def update(todo: Todo): Int = uUpdate.toUpdate0((todo.task, todo.completed, todo.id)).run.transact(xa).unsafeRunSync

  def delete(id: Int): Int = uDelete.toUpdate0(id).run.transact(xa).unsafeRunSync
}