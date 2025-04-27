name := """play-scala-seed"""
organization := "Wiktor.tec"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.13.16"
enablePlugins(PlayScala)
libraryDependencies += guice
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "7.0.1" % Test
libraryDependencies += ws
libraryDependencies += "com.typesafe.play" %% "play-filters-helpers" % "2.8.21"
libraryDependencies += filters