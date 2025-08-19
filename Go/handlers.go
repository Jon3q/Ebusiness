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
        return c.JSON(http.StatusBadRequest, "Invalid body")
    }
    if p.Name == "" || p.Price < 0 {
        return c.JSON(http.StatusBadRequest, "Invalid product data")
    }
    var cat Category
    if err := db.First(&cat, p.CategoryID).Error; err != nil {
        return c.JSON(http.StatusBadRequest, "Category does not exist")
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
    id := c.Param("id")
    var product Product
    if err := db.First(&product, id).Error; err != nil {
        return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found"})
    }
    return c.JSON(http.StatusOK, product)
}


func updateProduct(c echo.Context) error {
    id := c.Param("id")
    var product Product
    if err := db.First(&product, id).Error; err != nil {
        return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found"})
    }

    update := new(Product)
    if err := c.Bind(update); err != nil {
        return c.JSON(http.StatusBadRequest, echo.Map{"message": "Invalid body"})
    }

    if update.Name != "" {
        product.Name = update.Name
    }
    if update.Price > 0 {
        product.Price = update.Price
    }
    if update.CategoryID > 0 {
        product.CategoryID = update.CategoryID
    }

    if err := db.Save(&product).Error; err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
    }

    return c.JSON(http.StatusOK, product)
}

func deleteProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	db.Delete(&Product{}, id)
	return c.NoContent(http.StatusNoContent)
}

func createCategory(c echo.Context) error {
    category := new(Category)
    if err := c.Bind(category); err != nil {
        return c.JSON(http.StatusBadRequest, "Invalid body")
    }
    if category.Name == "" {
        return c.JSON(http.StatusBadRequest, "Name is required")
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
    var customer Customer
    if err := c.Bind(&customer); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid body"})
    }
    if customer.Email == "" {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "email is required"})
    }
    db.Create(&customer)
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
        return c.JSON(http.StatusBadRequest, echo.Map{"message": "Invalid body"})
    }

    // sprawdź customer_id
    var customer Customer
    if err := db.First(&customer, order.CustomerID).Error; err != nil {
        return c.JSON(http.StatusBadRequest, echo.Map{"message": "Invalid customer_id"})
    }

    if err := db.Create(order).Error; err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
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
		return c.JSON(http.StatusBadRequest, "Invalid body")
	}

	// Sprawdź, czy podano CustomerID
	if cart.CustomerID == 0 {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "customer_id is required"})
	}

	// Sprawdź, czy customer istnieje w bazie
	var customer Customer
	if err := db.First(&customer, cart.CustomerID).Error; err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid customer_id"})
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

// --- Categories ---
func updateCategory(c echo.Context) error {
    id := c.Param("id")
    var cat Category
    if err := db.First(&cat, id).Error; err != nil {
        return c.JSON(http.StatusNotFound, echo.Map{"message": "Category not found"})
    }

    update := new(Category)
    if err := c.Bind(update); err != nil {
        return c.JSON(http.StatusBadRequest, echo.Map{"message": "Invalid body"})
    }

    if update.Name != "" {
        cat.Name = update.Name
    }

    if err := db.Save(&cat).Error; err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
    }

    return c.JSON(http.StatusOK, cat)
}

func deleteCategory(c echo.Context) error {
    id := c.Param("id")
    var cat Category
    if err := db.First(&cat, id).Error; err != nil {
        return c.JSON(http.StatusNotFound, echo.Map{"message": "Category not found"})
    }

    if err := db.Delete(&cat).Error; err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
    }

    return c.NoContent(http.StatusNoContent)
}

// --- Customers ---
func deleteCustomer(c echo.Context) error {
    id := c.Param("id")
    var cust Customer
    if err := db.First(&cust, id).Error; err != nil {
        return c.JSON(http.StatusNotFound, echo.Map{"message": "Customer not found"})
    }

    if err := db.Delete(&cust).Error; err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
    }

    return c.NoContent(http.StatusNoContent)
}

// --- Orders ---
func deleteOrder(c echo.Context) error {
    id := c.Param("id")
    var order Order
    if err := db.First(&order, id).Error; err != nil {
        return c.JSON(http.StatusNotFound, echo.Map{"message": "Order not found"})
    }

    if err := db.Delete(&order).Error; err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
    }

    return c.NoContent(http.StatusNoContent)
}

// --- Carts ---
func deleteCart(c echo.Context) error {
    id := c.Param("id")
    var cart Cart
    if err := db.First(&cart, id).Error; err != nil {
        return c.JSON(http.StatusNotFound, echo.Map{"message": "Cart not found"})
    }

    if err := db.Delete(&cart).Error; err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
    }

    return c.NoContent(http.StatusNoContent)
}
