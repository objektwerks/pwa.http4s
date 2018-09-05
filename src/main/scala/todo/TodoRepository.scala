package todo

import cats.effect._
import doobie._
import doobie.implicits._

import scala.io.Source

case class TodoRepositoryConfig(schema: String, driver: String, url: String, user: String, password: String)

case class TodoRepository(config: TodoRepositoryConfig, init: Boolean = false) {
  private val xa = Transactor.fromDriverManager[IO](config.driver, config.url, config.user, config.password)

  if (init) init(config.schema)

  def init(schemaPath: String): Int = {
    val schema = Source.fromInputStream(getClass.getResourceAsStream(schemaPath)).mkString
    Fragment.const(schema).update.run.transact(xa).unsafeRunSync
  }

  def select: List[Todo] = {
    val select = sql"select * from todo".query[Todo]
    select.to[List].transact(xa).unsafeRunSync
  }

  def insert(todo: Todo): Int = {
    val insert = sql"insert into todo(id, task, assigned, completed) values (${todo.id}, ${todo.task}, ${todo.assigned}, ${todo.completed.get})".update
    insert.run.transact(xa).unsafeRunSync
  }

  def update(todo: Todo): Int = {
    val update = sql"update todo set task = ${todo.task}, completed = ${todo.completed.get} where id = ${todo.id}".update
    update.run.transact(xa).unsafeRunSync
  }

  def delete(id: Int): Int = {
    val delete = sql"delete from todo where id = $id".update
    delete.run.transact(xa).unsafeRunSync
  }
}