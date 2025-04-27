#!/bin/bash

# Port aplikacji Play
APP_PORT=9000

# Uruchom Docker
docker build -t play-scala-app .
docker run -d -p $APP_PORT:$APP_PORT --name play-scala-app-container play-scala-app

# Poczekaj chwilę, aż serwer ruszy
sleep 10

# Uruchom ngrok (port aplikacji wewnątrz Dockera)
ngrok http $APP_PORT
