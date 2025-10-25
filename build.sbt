name := "pwa.http4s"
organization := "objektwerks"
version := "0.1-SNAPSHOT"
scalaVersion := "2.12.20"
libraryDependencies ++= {
  val catsVersion = "1.6.1"
  val doobieVersion = "0.5.4"
  val http4sVersion = "0.18.24"
  val circeVersion = "0.11.1"
  Seq(
    "org.typelevel" %% "cats-core" % catsVersion,
    "org.typelevel" %% "cats-effect" % "0.10.1",
    "io.circe" %% "circe-core" % circeVersion,
    "io.circe" %% "circe-generic" % circeVersion,
    "com.chuusai" %% "shapeless" % "2.3.3",
    "org.tpolecat" %% "doobie-core" % doobieVersion,
    "org.tpolecat" %% "doobie-h2" % doobieVersion,
    "org.tpolecat" %% "doobie-hikari" % doobieVersion,
    "org.http4s" %% "http4s-blaze-client" % http4sVersion,
    "org.http4s" %% "http4s-blaze-server" % http4sVersion,
    "org.http4s" %% "http4s-circe" % http4sVersion,
    "org.http4s" %% "http4s-dsl" % http4sVersion,
    "org.http4s" %% "http4s-server" % http4sVersion,
    "co.fs2" %% "fs2-core" % "0.10.7",
    "com.github.pureconfig" %% "pureconfig" % "0.17.1",
    "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5",
    "ch.qos.logback" % "logback-classic" % "1.5.20",
    "org.tpolecat" %% "doobie-scalatest" % doobieVersion % Test,
    "org.scalatest" %% "scalatest" % "3.2.19" % Test
  )
}
