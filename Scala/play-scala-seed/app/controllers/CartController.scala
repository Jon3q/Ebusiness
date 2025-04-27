package controllers

import play.api.mvc._
import play.api.libs.json._
import javax.inject._
import models.CartItem

@Singleton
class CartController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  implicit val format: OFormat[CartItem] = Json.format[CartItem]

  def getAll = Action { Ok(Json.toJson(CartItem.cartItems)) }

  def getById(id: Int) = Action {
    CartItem.cartItems.find(_.id == id).map(item => Ok(Json.toJson(item))).getOrElse(NotFound)
  }

  def add = Action(parse.json) { request =>
    request.body.validate[CartItem].map { item =>
      CartItem.cartItems :+= item
      Created(Json.toJson(item))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def update(id: Int) = Action(parse.json) { request =>
    request.body.validate[CartItem].map { updated =>
      CartItem.cartItems = CartItem.cartItems.map(i => if (i.id == id) updated else i)
      Ok(Json.toJson(updated))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def delete(id: Int) = Action {
    val originalSize = CartItem.cartItems.size
    CartItem.cartItems = CartItem.cartItems.filterNot(_.id == id)
    if (CartItem.cartItems.size < originalSize) NoContent else NotFound
  }
}
