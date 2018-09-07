package todo

import cats.effect.IO
import com.typesafe.config.ConfigFactory
import pureconfig.error.ConfigReaderException
import pureconfig._

object TodoConfig {
  case class ServerConfig(host: String, port: Int)

  case class DatabaseConfig(schema: String, driver: String, url: String, user: String, password: String)

  case class Config(server: ServerConfig, database: DatabaseConfig)

  def load(confFilePath: String = "todo.conf"): IO[Config] = {
    IO {
      loadConfig[Config](ConfigFactory.load(confFilePath))
    }.flatMap {
      case Left(error) => IO.raiseError[Config](new ConfigReaderException[Config](error))
      case Right(config) => IO.pure(config)
    }
  }
}