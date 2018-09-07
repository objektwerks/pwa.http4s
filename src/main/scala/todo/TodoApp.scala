package todo

import cats.effect._
import doobie.hikari.HikariTransactor
import fs2.StreamApp.ExitCode
import fs2.{Stream, StreamApp}
import org.http4s.server.blaze._

import scala.concurrent.ExecutionContext.Implicits.global

object TodoApp extends StreamApp[IO] {
  override def stream(args: List[String], requestShutdown: IO[Unit]): Stream[IO, ExitCode] = {
    for {
      config <- Stream.eval(TodoConfig.load())
      database = config.database
      xa <- Stream.eval(HikariTransactor.newHikariTransactor[IO](
        database.driver,
        database.url,
        database.user,
        database.password))
      exitCode <- BlazeBuilder[IO]
        .bindHttp(config.server.port, config.server.host)
        .mountService(TodoService(TodoRepository(xa, database.schema, init = true)).instance, "/api/v1")
        .serve
    } yield {
      sys.addShutdownHook(requestShutdown.unsafeRunSync)
      exitCode
    }
  }
}