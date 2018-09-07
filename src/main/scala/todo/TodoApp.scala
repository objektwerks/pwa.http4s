package todo

import cats.effect._
import fs2.StreamApp.ExitCode
import fs2.{Stream, StreamApp}
import org.http4s.server.blaze._

import scala.concurrent.ExecutionContext.Implicits.global

object TodoApp extends StreamApp[IO] {
  val todoRepositoryConfig = TodoRepositoryConfig("/schema.sql", "org.h2.Driver", "jdbc:h2:./target/appdb", "sa", "sa")
  val todoRepository = TodoRepository(todoRepositoryConfig, init = true)
  val todoService = TodoService(todoRepository)

  override def stream(args: List[String], requestShutdown: IO[Unit]): Stream[IO, ExitCode] =
    BlazeBuilder[IO]
      .bindHttp(7777)
      .mountService(todoService.instance, "/api/v1")
      .serve
}