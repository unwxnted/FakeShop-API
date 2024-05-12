import { Router } from "express";
import { PrismaClient } from '@prisma/client';
import { isLogged, isAdmin } from "../helpers/utis.js";
import { createClient } from "redis";

const productsRouter = new Router();
const prisma = new PrismaClient();

const redis = createClient();

redis.on('error', err => console.log('Redis Client Error', err));

await redis.connect();


productsRouter.get('/products', isLogged, async (req, res) => {
    try {

        redis.get('allProducts', (err, reply) => {
            if(reply) return res.json(JSON.parse(reply));
        })

        const products = await prisma.product.findMany();

        redis.set('allProducts', JSON.stringify(products));

        return res.json(products);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
    
});

productsRouter.post('/products', isLogged, isAdmin, async (req, res) => {
    try {
        const newProduct = await prisma.product.create({
            data: req.body
        });
        return res.json(newProduct);
    } catch {
        return res.status(400).json({
            'Error': 'Bad request'
        });
    }

    
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