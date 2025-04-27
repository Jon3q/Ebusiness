package controllers

import play.api.mvc._
import play.api.libs.json._
import javax.inject._
import models.Product

@Singleton
class ProductController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  implicit val productFormat: OFormat[Product] = Json.format[Product]

  def getAll: Action[AnyContent] = Action {
    Ok(Json.toJson(Product.products))
  }

  def getById(id: Int): Action[AnyContent] = Action {
    Product.products.find(_.id == id) match {
      case Some(product) => Ok(Json.toJson(product))
      case None => NotFound(s"No product with id: $id")
    }
  }

  def add: Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].map { product =>
      Product.products = Product.products :+ product
      Created(Json.toJson(product))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def update(id: Int): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].map { updated =>
      Product.products = Product.products.map(p => if (p.id == id) updated else p)
      Ok(Json.toJson(updated))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def delete(id: Int): Action[AnyContent] = Action {
    val originalSize = Product.products.size
    Product.products = Product.products.filterNot(_.id == id)
    if (Product.products.size < originalSize) NoContent else NotFound("Product not found")
  }
}
