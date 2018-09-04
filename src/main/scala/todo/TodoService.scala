package todo

import cats.effect._
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s._
import org.http4s.circe._
import org.http4s.dsl.impl.Root
import org.http4s.dsl.io._

object TodoService {
  import TodoRepository._

  val todoService = HttpService[IO] {
    case GET -> Root / "todos" => Ok(select.asJson)
    case POST -> Root / "todo" => Ok()
  }
}