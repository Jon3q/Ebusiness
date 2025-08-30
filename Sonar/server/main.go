package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Product struct {
	ID    string  `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

var products = []Product{
	{ID: "1", Name: "Laptop", Price: 5999},
	{ID: "2", Name: "Słuchawki", Price: 599},
	{ID: "3", Name: "Mikrofon", Price: 699},
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/products", func(c *gin.Context) {
		c.JSON(http.StatusOK, products)
	})

	r.POST("/cart", func(c *gin.Context) {
		c.Status(http.StatusCreated)
	})

	r.POST("/payment", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	r.Run(":8080")
}
