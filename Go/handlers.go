package main

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func ScopeByCategory(catID uint) func(*gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("category_id = ?", catID)
	}
}

func createProduct(c echo.Context) error {
	p := new(Product)
	if err := c.Bind(p); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	if err := db.Create(p).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusCreated, p)
}

func listProducts(c echo.Context) error {
	var products []Product
	if q := c.QueryParam("category"); q != "" {
		if id, err := strconv.Atoi(q); err == nil {
			db.Scopes(ScopeByCategory(uint(id))).Find(&products)
		} else {
			db.Find(&products)
		}
	} else {
		db.Find(&products)
	}
	return c.JSON(http.StatusOK, products)
}

func getProduct(c echo.Context) error {
	var p Product
	id, _ := strconv.Atoi(c.Param("id"))
	if err := db.First(&p, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Product not found")
	}
	return c.JSON(http.StatusOK, p)
}

func updateProduct(c echo.Context) error {
	var p Product
	id, _ := strconv.Atoi(c.Param("id"))
	if err := db.First(&p, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Product not found")
	}
	if err := c.Bind(&p); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	db.Save(&p)
	return c.JSON(http.StatusOK, p)
}

func deleteProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	db.Delete(&Product{}, id)
	return c.NoContent(http.StatusNoContent)
}

func createCategory(c echo.Context) error {
	category := new(Category)
	if err := c.Bind(category); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	if err := db.Create(category).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusCreated, category)
}

func listCategories(c echo.Context) error {
	var categories []Category
	db.Preload("Products").Find(&categories)
	return c.JSON(http.StatusOK, categories)
}

func createCustomer(c echo.Context) error {
	customer := new(Customer)
	if err := c.Bind(customer); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	if err := db.Create(customer).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusCreated, customer)
}

func listCustomers(c echo.Context) error {
	var customers []Customer
	db.Find(&customers)
	return c.JSON(http.StatusOK, customers)
}

func createOrder(c echo.Context) error {
	order := new(Order)
	if err := c.Bind(order); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	if err := db.Create(order).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusCreated, order)
}

func listOrders(c echo.Context) error {
	var orders []Order
	db.Find(&orders)
	return c.JSON(http.StatusOK, orders)
}

func createCart(c echo.Context) error {
	cart := new(Cart)
	if err := c.Bind(cart); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	if err := db.Create(cart).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusCreated, cart)
}

func listCarts(c echo.Context) error {
	var carts []Cart
	db.Find(&carts)
	return c.JSON(http.StatusOK, carts)
}
