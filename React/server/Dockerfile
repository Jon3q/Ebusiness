FROM golang:1.24.3-alpine AS build


WORKDIR /src

COPY go.* ./
RUN go mod download

COPY . ./
RUN go build -o /app/server

FROM alpine:3.20
COPY --from=build /app/server /server
EXPOSE 8080
ENTRYPOINT ["/server"]
