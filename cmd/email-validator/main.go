package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/adilsyed003/email-validator/handlers"
)

func main() {
	router := http.NewServeMux()
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Email Validator API is running! Use /validate endpoint."))
	})
	log.Println("Starting Email Validator API on port 8081")
	router.HandleFunc("/validate",handlers.EmailValidatorHandler)
	done:=make(chan os.Signal,1)
	signal.Notify(done,os.Interrupt, syscall.SIGTERM, syscall.SIGINT, syscall.SIGTERM)
	server := &http.Server{
		Addr:    "localhost:8081",
		Handler: router,
	}
	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()
	<-done
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err := server.Shutdown(ctx)
	if err != nil {
		log.Printf("Error shutting down server: %v", err)
	} else {
		log.Println("Server gracefully stopped")
	}
}