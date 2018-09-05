package todo

import cats.effect.IO
import io.circe.generic.auto._
import org.http4s.circe._

case class Todo(id: Int, task: String, assigned: String, completed: Option[String])

object Todo {
  implicit val todoDecoder = jsonOf[IO, Todo]
  implicit val todoEncoder = jsonEncoderOf[IO, Todo]
  implicit val todoIdEncoder = jsonEncoderOf[IO, Int]
}