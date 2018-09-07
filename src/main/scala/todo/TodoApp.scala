package todo

import cats.effect._
import fs2.StreamApp.ExitCode
import fs2.{Stream, StreamApp}
import org.http4s.server.blaze._

import scala.concurrent.ExecutionContext.Implicits.global

object TodoApp extends StreamApp[IO] {
  override def stream(args: List[String], requestShutdown: IO[Unit]): Stream[IO, ExitCode] = {
    for {
      config <- Stream.eval(TodoConfig.load())
      exitCode <- BlazeBuilder[IO]
        .bindHttp(config.server.port, config.server.host)
        .mountService(TodoService(TodoRepository(config.database, init = true)).instance, "/api/v1")
        .serve
    } yield {
      sys.addShutdownHook(requestShutdown.unsafeRunSync)
      exitCode
    }
  }
}