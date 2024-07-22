import { Router } from "express";
import { isLogged, isAdmin } from "../helpers/utis.js";
import ProductsController from "../controllers/products.controller.js";

const productsRouter = new Router();

productsRouter.get('/products/search/:name', isLogged, isAdmin, ProductsController.search);
productsRouter.get('/products', isLogged, ProductsController.getAll);
productsRouter.post('/products', isLogged, isAdmin, ProductsController.create);
productsRouter.post('/products/update', isLogged, isAdmin, ProductsController.update);
productsRouter.delete('/products/delete/:id', isLogged, isAdmin, ProductsController.delete);
export default productsRouter;