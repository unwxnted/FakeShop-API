import { Router } from "express";
import { isLogged } from "../helpers/utis.js";
import OrdersController from "../controllers/orders.controller.js";

const ordersRouter = new Router();

ordersRouter.get('/orders', isLogged, OrdersController.getByUser);
ordersRouter.post('/orders', isLogged, OrdersController.post);

export default ordersRouter;