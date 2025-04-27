package models

case class CartItem(id: Int, productId: Int, quantity: Int)
object CartItem {
  var cartItems: List[CartItem] = List(
    CartItem(1, 1, 2),
    CartItem(2, 3, 1)
  )
}
