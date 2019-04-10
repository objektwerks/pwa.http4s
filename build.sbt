name := "pwa.http4s"
organization := "objektwerks"
version := "0.1-SNAPSHOT"
scalaVersion := "2.12.7"
libraryDependencies ++= {
  val catsVersion = "1.6.0"
  val doobieVersion = "0.5.3"
  val http4sVersion = "0.18.20"
  val circeVersion = "0.11.1"
  Seq(
    "org.typelevel" % "cats-core_2.12" % catsVersion,
    "org.typelevel" % "cats-effect_2.12" % "0.10.1",
    "io.circe" % "circe-core_2.12" % circeVersion,
    "io.circe" % "circe-generic_2.12" % circeVersion,
    "com.chuusai" % "shapeless_2.12" % "2.3.3",
    "org.tpolecat" % "doobie-core_2.12" % doobieVersion,
    "org.tpolecat" % "doobie-h2_2.12" % doobieVersion,
    "org.tpolecat" % "doobie-hikari_2.12" % doobieVersion,
    "org.http4s" % "http4s-blaze-client_2.12" % http4sVersion,
    "org.http4s" % "http4s-blaze-server_2.12" % http4sVersion,
    "org.http4s" % "http4s-circe_2.12" % http4sVersion,
    "org.http4s" % "http4s-dsl_2.12" % http4sVersion,
    "org.http4s" % "http4s-server_2.12" % http4sVersion,
    "co.fs2" % "fs2-core_2.12" % "0.10.6",
    "com.github.pureconfig" % "pureconfig_2.12" % "0.9.2",
    "com.typesafe.scala-logging" % "scala-logging_2.12" % "3.9.0",
    "ch.qos.logback" % "logback-classic" % "1.2.3",
    "org.tpolecat" % "doobie-scalatest_2.12" % doobieVersion % Test,
    "org.scalatest" % "scalatest_2.12" % "3.0.5" % Test
  )
}