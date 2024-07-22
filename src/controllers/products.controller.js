import { PrismaClient } from '@prisma/client';
import { createClient } from "redis";

const prisma = new PrismaClient();

const redis = createClient();

redis.on('error', err => console.log('Redis Client Error', err));

await redis.connect();

class ProductsController{

    async search(req, res){
        const { name } = req.params;
        if (name === undefined) return res.status(400).json({ 'Error': 'Missing Data' });
        try{
            const product = await prisma.product.findMany({
                where: {
                    name
                }
            });
            if (!product) return res.status(400).json({ 'Error': 'Product not found' });
            return res.json(product);
        }catch (e){
            console.log(e);
            return res.status(400).json({ 'Error': 'invalid data in use' });
        }
    }

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
        } catch (e){
            console.log(e);
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

    async delete(req, res){
        try{
            const deletedProduct = await prisma.product.delete({
                where: {
                    id: parseInt(req.params.id)
                }
            });
            return res.json(deletedProduct);
        }catch (e){
            console.log(e);
            return res.status(400).json({'Error': 'Bad request'});
        }
    }

}

export default new ProductsController;