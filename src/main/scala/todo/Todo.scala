package todo

import java.time.LocalDate

import cats.effect.IO
import io.circe.generic.auto._
import org.http4s.circe._

case class Todo(id: Int = 0, task: String, assigned: String = LocalDate.now.toString, completed: Option[String] = None)

object Todo {
  implicit val todoDecoder = jsonOf[IO, Todo]
  implicit val todoEncoder = jsonEncoderOf[IO, Todo]

  implicit val todoIdDecoder = jsonOf[IO, Int]
  implicit val todoIdEncoder = jsonEncoderOf[IO, Int]

  implicit val todoListDecoder = jsonOf[IO, List[Todo]]
}