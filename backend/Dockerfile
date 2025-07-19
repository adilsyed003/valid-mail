FROM golang:1.21-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main ./cmd/email-validator

FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=build /app/main /main
EXPOSE 8080
CMD ["/main"]