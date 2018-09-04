package todo

import java.time.LocalDateTime

import cats.effect._
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s._
import org.http4s.circe._
import org.http4s.dsl.impl.Root
import org.http4s.dsl.io._

object Services {
  case class Todo(task: String = "Enter todo.",
                  assigned: String = LocalDateTime.now.toString,
                  completed: String = LocalDateTime.now.toString)

  object Todo {
    implicit val nowDecoder = jsonOf[IO, Todo]
  }

  val nowService = HttpService[IO] {
    case GET -> Root / "todo" => Ok(Todo().asJson)
  }
}