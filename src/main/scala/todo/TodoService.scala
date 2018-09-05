package todo

import cats.effect._
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s._
import org.http4s.circe._
import org.http4s.dsl.impl.Root
import org.http4s.dsl.io._

case class TodoService(repository: TodoRepository) {
  import Todo._

  val instance = HttpService[IO] {
    case GET -> Root / "todos" => Ok(repository.select.asJson)
    case request @ POST -> Root / "todo" =>
      for {
        todo <- request.as[Todo]
        result <- Ok(repository.insert(todo).asJson)
      } yield result
    case request @ PUT -> Root / "todo" =>
      for {
        todo <- request.as[Todo]
        result <- Ok(repository.update(todo).asJson)
      } yield result
    case DELETE -> Root / "todo" / IntVar(id) => Ok(repository.delete(id))
  }
}