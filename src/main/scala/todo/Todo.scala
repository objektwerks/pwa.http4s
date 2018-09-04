package todo

import cats.effect.IO
import io.circe.generic.auto._
import org.http4s.circe.jsonOf

case class Todo(id: Int, task: String, assigned: String, completed: Option[String])

object Todo {
  implicit val todoDecoder = jsonOf[IO, Todo]
}