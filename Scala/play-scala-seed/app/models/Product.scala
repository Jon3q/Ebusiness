package models

case class Product(id: Int, name: String, categoryId: Option[Int])
object Product {
  var products: List[Product] = List(
    Product(1, "Laptop", Some(1)),
    Product(2, "Phone", Some(2)),
    Product(3, "Headphones", None)
  )
}