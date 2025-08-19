package main

import (
	"net/http"

	sqlite "github.com/glebarez/sqlite"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {

	var err error
	db, err = gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&Category{}, &Product{}, &Customer{}, &Order{}, &Cart{})

	e := echo.New()
	e.GET("/ping", func(c echo.Context) error {
	return c.String(http.StatusOK, "pong")
	})

	e.POST("/products", createProduct)
	e.GET("/products", listProducts)
	e.GET("/products/:id", getProduct)
	e.PUT("/products/:id", updateProduct)
	e.DELETE("/products/:id", deleteProduct)

	e.POST("/categories", createCategory)
	e.GET("/categories", listCategories)

	e.POST("/customers", createCustomer)
	e.GET("/customers", listCustomers)

	e.POST("/orders", createOrder)
	e.GET("/orders", listOrders)

	e.POST("/carts", createCart)
	e.GET("/carts", listCarts)

	e.PUT("/categories/:id", updateCategory)
	e.DELETE("/categories/:id", deleteCategory)
	e.DELETE("/customers/:id", deleteCustomer)
	e.DELETE("/orders/:id", deleteOrder)
	e.DELETE("/carts/:id", deleteCart)

	e.Logger.Fatal(e.Start(":8080"))
}
