import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { isLogged, isAdmin } from "../helpers/utis.js";

const ordersRouter = new Router();
const prisma = new PrismaClient();


ordersRouter.get('/orders', isLogged, async (req, res) => {

    try {

        const user = await prisma.user.findFirst({
            where: {
                jwt: req.token
            }
        });

        const orders = await prisma.order.findMany({
            where: {
                userId: user.id
            }
        });

        return res.json(orders);
    } catch {
        return res.status(400).json({ 'Error': 'Bad request' });
    }

});


ordersRouter.post('/orders', isLogged, async (req, res) => {

    const { productId, quantity } = req.body;
    if (productId === undefined || quantity === undefined) return res.status(400).json({ 'Error': 'Missing data' });

    try {

        const user = await prisma.user.findFirst({
            where: {
                jwt: req.token
            }
        });


        const newOrder = await prisma.order.create({
            data: {
                date: new Date().toISOString(),
                userId: user.id,
                productId,
                quantity
            }
        });

        await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                stock: {
                    decrement: quantity
                }
            }
        });

        return res.json(newOrder);
    } catch {
        return res.status(400).json({ 'Error': 'Bad request' })
    }

});


export default ordersRouter;