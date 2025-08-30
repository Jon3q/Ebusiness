package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Product represents a single product in the store.
type Product struct {
	ID    string  `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

// seedProducts initializes the product list.
func seedProducts() []Product {
	return []Product{
		{ID: "1", Name: "Laptop", Price: 5999},
		{ID: "2", Name: "Sluchawki", Price: 599},
		{ID: "3", Name: "Mikrofon", Price: 699},
		{ID: "4", Name: "Biurko", Price: 899},
	}
}

const defaultPort = ":8080"

func main() {
	products := seedProducts()

	router := gin.Default()
	router.Use(cors.Default())

	router.GET("/products", func(c *gin.Context) {
		c.JSON(http.StatusOK, products)
	})

	router.POST("/cart", func(c *gin.Context) {
		c.Status(http.StatusCreated)
	})

	router.POST("/payment", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	if err := router.Run(defaultPort); err != nil {
		log.Fatalf("server failed to start: %v", err)
	}
}
