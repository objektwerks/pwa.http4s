package todo

import cats.effect._
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s._
import org.http4s.circe._
import org.http4s.dsl.impl.Root
import org.http4s.dsl.io._

case class TodoService(repository: TodoRepository) {
  val instance = HttpService[IO] {
    case GET -> Root / "todos" => Ok(repository.select.asJson)
    case POST -> Root / "todo" => Ok()
  }
}