import { Router } from "express";
import { isLogged } from "../helpers/utis.js";
import CartsController from "../controllers/carts.controller.js";

const cartRouter = new Router();

cartRouter.get('/carts', isLogged, CartsController.getByUser);
cartRouter.post('/carts/add', isLogged, CartsController.add);
cartRouter.post('/carts/pay', isLogged, CartsController.pay);
cartRouter.delete('/carts/delete/product/:id', isLogged, CartsController.deleteProduct);
cartRouter.delete('/carts/delete', isLogged, CartsController.delete);

export default cartRouter;