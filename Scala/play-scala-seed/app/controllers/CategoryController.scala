package controllers

import play.api.mvc._
import play.api.libs.json._
import javax.inject._

// add Product here
import models.{Category, Product}

@Singleton
class CategoryController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  implicit val format: OFormat[Category] = Json.format[Category]

  def getAll: Action[AnyContent] = Action {
    Ok(Json.toJson(Category.categories))
  }

  def getById(id: Int): Action[AnyContent] = Action {
    Category.categories
      .find(_.id == id)
      .map(c => Ok(Json.toJson(c)))
      .getOrElse(NotFound(s"Category not found: $id"))
  }

  def add: Action[JsValue] = Action(parse.json) { req =>
  req.body.validate[Category].fold(
    errors => BadRequest(JsError.toJson(errors)),
    c => {
      Category.categories = Category.categories :+ c
      Created(Json.toJson(c))
    }
  )
}

  def update(id: Int): Action[JsValue] = Action(parse.json) { req =>
  req.body.validate[Category].fold(
    errors  => BadRequest(JsError.toJson(errors)),
    updated => {
      Category.categories = Category.categories.map(c => if (c.id == id) updated else c)
      Ok(Json.toJson(updated))
    }
  )
}

  def delete(id: Int): Action[AnyContent] = Action {
    val before = Category.categories.size
    Category.categories = Category.categories.filterNot(_.id == id)

    if (Category.categories.size < before) {
      // now that we’ve removed the category, unlink it from every product
      Product.products = Product.products.map { p =>
        if (p.categoryId.contains(id)) p.copy(categoryId = None) else p
      }
      NoContent
    } else {
      NotFound(s"Category not found: $id")
    }
  }
}
