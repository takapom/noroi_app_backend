package main

import (
	"fmt"
	"log"
	"os"

	"noroi/internal/handler"
	"noroi/internal/infrastructure/db"
)

func main() {
	// Load database configuration
	dbConfig := db.NewConfig()

	// Connect to database
	dbConn, err := db.NewConnection(dbConfig)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer dbConn.Close()

	log.Println("Successfully connected to database")

	// Initialize router
	router := handler.NewRouter(dbConn)

	// Get port from environment variable
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := fmt.Sprintf(":%s", port)
	log.Printf("Server starting on %s", addr)

	// Start server
	if err := router.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
