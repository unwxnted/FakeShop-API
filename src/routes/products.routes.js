import { Router } from "express";
import { PrismaClient } from '@prisma/client';
import { isLogged, isAdmin } from "../helpers/utis.js";

const productsRouter = new Router();
const prisma = new PrismaClient();

productsRouter.get('/products', isLogged, async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        return res.json(products);
    } catch (error) {
        return res.sendStatus(500);
    }
    
});

productsRouter.post('/products', isLogged, isAdmin, async (req, res) => {
    try {
        const newProduct = await prisma.product.create({
            data: req.body
        });
    } catch {
        return res.status(400).json({
            'Error': 'Bad request'
        });
    }

    return res.json(newProduct);
});

productsRouter.post('/products/update', isLogged, isAdmin, async (req, res) => {
    try{
        const updatedProduct = await prisma.product.update({
            where: {
                id : req.body.id
            },
            data: req.body
        });
        return res.json(updatedProduct);
    }catch{
        return res.status(400).json({'Error': 'Bad request'});
    }
});

export default productsRouter;