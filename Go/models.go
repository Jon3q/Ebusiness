package main

type Category struct {
	ID       uint      `gorm:"primaryKey"`
	Name     string    `json:"name"`
	Products []Product `gorm:"foreignKey:CategoryID"`
}

type Product struct {
	ID         uint     `gorm:"primaryKey"`
	Name       string   `json:"name"`
	Price      float64  `json:"price"`
	CategoryID uint     `json:"category_id"`
	Category   Category `json:"-"`
}

type Customer struct {
	ID    uint   `gorm:"primaryKey"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type Order struct {
	ID         uint     `gorm:"primaryKey"`
	CustomerID uint     `json:"customer_id"`
	Customer   Customer `json:"-"`
}

type Cart struct {
	ID         uint `gorm:"primaryKey"`
	CustomerID uint `json:"customer_id"`
}
