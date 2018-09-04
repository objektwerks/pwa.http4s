package todo

import cats.effect._
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s._
import org.http4s.circe._
import org.http4s.dsl.impl.Root
import org.http4s.dsl.io._

object TodoService {
  case class Todo(task: String, assigned: String, completed: Option[String])

  object Todo {
    implicit val todoDecoder = jsonOf[IO, Todo]
  }

  val todoService = HttpService[IO] {
    case GET -> Root / "todos" => Ok(List[Todo]().asJson)
    case POST -> Root / "todo" => Ok()
  }
}