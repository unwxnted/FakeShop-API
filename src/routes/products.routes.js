import { Router } from "express";
import { isLogged, isAdmin } from "../helpers/utis.js";
import ProductsController from "../controllers/products.controller.js";

const productsRouter = new Router();

productsRouter.get('/products', isLogged, ProductsController.getAll);
productsRouter.post('/products', isLogged, isAdmin, ProductsController.create);
productsRouter.post('/products/update', isLogged, isAdmin, ProductsController.update);

export default productsRouter;