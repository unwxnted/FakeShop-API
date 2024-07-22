import { Router } from "express";
import UsersController from "../controllers/users.controller.js";
import { isAdmin, isLogged } from "../helpers/utis.js";

const usersRouter = new Router();

usersRouter.get('/users', isLogged, UsersController.data);
usersRouter.get('/users/search/:name', isLogged, isAdmin, UsersController.search);
usersRouter.post('/users/signin', UsersController.signin);
usersRouter.post('/users/signup', UsersController.signup);
usersRouter.post('/users/promote/:id',isLogged, isAdmin, UsersController.promote);
usersRouter.post('/users/demote/:id', isLogged, isAdmin, UsersController.demote);

export default usersRouter;