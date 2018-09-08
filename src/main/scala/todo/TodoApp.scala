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
      conf <- Stream.eval(TodoConfig.load())
      db = conf.database
      xa <- Stream.eval(HikariTransactor.newHikariTransactor[IO](
        db.driver,
        db.url,
        db.user,
        db.password))
      exitCode <- BlazeBuilder[IO]
        .bindHttp(conf.server.port, conf.server.host)
        .mountService(TodoService(TodoRepository(xa, db.schema)).instance, "/api/v1")
        .serve
    } yield {
      sys.addShutdownHook(requestShutdown.unsafeRunSync)
      exitCode
    }
  }
}