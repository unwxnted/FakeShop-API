import { PrismaClient } from '@prisma/client';
import { createClient } from "redis";

const prisma = new PrismaClient();

const redis = createClient();

redis.on('error', err => console.log('Redis Client Error', err));

await redis.connect();

class ProductsController{

    async getAll(req, res){
        try {
    
            await redis.get('allProducts', (err, reply) => {
                if(reply) return res.json(JSON.parse(reply));
            })
    
            const products = await prisma.product.findMany();
    
            await redis.set('allProducts', JSON.stringify(products));
    
            return res.json(products);
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }

    async create(req, res){
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
    }

    async update(req, res){
        try{
            const updatedProduct = await prisma.product.update({
                where: {
                    id : req.body.id
                },
                data: req.body
            });
            return res.json(updatedProduct);
        }catch (e){
            console.log(e);
            return res.status(400).json({'Error': 'Bad request'});
        }
    }

}

export default new ProductsController;