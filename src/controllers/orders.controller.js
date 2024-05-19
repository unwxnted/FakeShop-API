import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

const prisma = new PrismaClient();

const redis = createClient();

redis.on('error', err => console.log('Redis Client Error', err));

await redis.connect();

class OrdersController{

    async getByUser(req, res){

        try {
    
            const user = await prisma.user.findFirst({
                where: {
                    jwt: req.token
                }
            });
    
            await redis.get(`orders-${req.token}`, (err, reply) => {
                if(reply) return res.json(JSON.parse(reply));
            });
    
            const orders = await prisma.order.findMany({
                where: {
                    userId: user.id
                }
            });
    
            await redis.set(`orders-${req.token}`, JSON.stringify(orders));
    
            return res.json(orders);
        } catch (e){
            console.log(e);
            return res.status(400).json({ 'Error': 'Bad request' });
        }
    
    }

    async post(req, res){

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
    
    }

}

export default new OrdersController;