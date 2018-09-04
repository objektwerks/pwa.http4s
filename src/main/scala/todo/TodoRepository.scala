package todo

import cats.effect._
import doobie._
import doobie.implicits._

import scala.io.Source

case class TodoRepositoryConfig(driver: String, url: String, user: String, password: String)

case class TodoRepository(config: TodoRepositoryConfig) {
  private val db = Transactor.fromDriverManager[IO](config.driver, config.url, config.user, config.password)

  def init(schemaPath: String): Int = {
    val schema = Source.fromInputStream(getClass.getResourceAsStream(schemaPath)).mkString
    Fragment.const(schema).update.run.transact(db).unsafeRunSync
  }

  def select: List[Todo] = {
    val select = sql"select * from todo".query[Todo]
    select.to[List].transact(db).unsafeRunSync
  }

  def insert(todo: Todo): Int = {
    val insert = sql"insert into todo(task, assigned, completed) values (${todo.task}, ${todo.assigned}, ${todo.completed.get})".update
    insert.run.transact(db).unsafeRunSync
  }

  def update(todo: Todo): Int = {
    val update = sql"update todo set task = ${todo.task}, assigned = ${todo.assigned}, completed = ${todo.completed.get} where id = ${todo.id}".update
    update.run.transact(db).unsafeRunSync
  }

  def delete(id: Int): Int = {
    val delete = sql"delete from todo where id = $id".update
    delete.run.transact(db).unsafeRunSync
  }
}