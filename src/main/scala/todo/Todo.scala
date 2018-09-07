package todo

import java.sql.Timestamp
import java.time.Instant

import cats.effect.IO
import io.circe.Decoder.Result
import io.circe.generic.auto._
import io.circe.{Decoder, Encoder, HCursor, Json}
import org.http4s.circe._

case class Todo(id: Int = 0, task: String, assigned: Timestamp = Timestamp.from(Instant.now), completed: Option[Timestamp] = None)

object Todo {
  implicit val todoDecoder = jsonOf[IO, Todo]
  implicit val todoEncoder = jsonEncoderOf[IO, Todo]

  implicit val todoIdDecoder = jsonOf[IO, Int]
  implicit val todoIdEncoder = jsonEncoderOf[IO, Int]

  implicit val todoListDecoder = jsonOf[IO, List[Todo]]

  implicit val timestampEncoderDecoder: Encoder[Timestamp] with Decoder[Timestamp] = new Encoder[Timestamp] with Decoder[Timestamp] {
    override def apply(timestamp: Timestamp): Json = Encoder.encodeLong.apply(timestamp.getTime)
    override def apply(cursor: HCursor): Result[Timestamp] = Decoder.decodeLong.map(long => new Timestamp(long)).apply(cursor)
  }

  case class Inserted(id: Int)
  implicit val idDecoder = jsonOf[IO, Inserted]
  implicit val idEncoder = jsonEncoderOf[IO, Inserted]


  case class Updated(id: Int)
  implicit val updatedDecoder = jsonOf[IO, Updated]
  implicit val updatedEncoder = jsonEncoderOf[IO, Updated]

  case class Deleted(id: Int)
  implicit val deletedDecoder = jsonOf[IO, Deleted]
  implicit val deletedEncoder = jsonEncoderOf[IO, Deleted]
}