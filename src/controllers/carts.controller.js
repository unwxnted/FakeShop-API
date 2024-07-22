import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

const prisma = new PrismaClient();

const redis = createClient();

redis.on('error', err => console.log('Redis Client Error', err));

await redis.connect();

class CartsController {

    async getByUser(req, res){
        try{
            const user = await prisma.user.findFirst({
                where: {
                    jwt: req.token
                }
            });

            await redis.get(`cart-${req.token}`, (err, reply) => {
                if(reply) return res.json(JSON.parse(reply));
            });

            const response = await prisma.cart.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    product: true
                }
            });

            await redis.set(`cart-${req.token}`, JSON.stringify(response));

            return res.json(response);
        }catch{
            return res.status(400).json({'Error': 'Bad request'});
        }
    }

    async add(req, res) {
        const { productId, quantity } = req.body;
        if (productId === undefined || quantity === undefined) return res.status(400).json({ 'Error': 'Missing data' });


        try {
            const user = await prisma.user.findFirst({
                where: {
                    jwt: req.token
                }
            });

            const product = await prisma.product.findUnique({
                where: {
                    id: productId
                }
            });

            if (!product) return res.status(400).json({ 'Error': 'Product not found' });

            if (product.stock < quantity) return res.status(400).json({ 'Error': 'Product not in stock' });

            const cart = await prisma.cart.findFirst({
                where: {
                    userId: user.id,
                    productId: productId
                }
            });
            
            if (cart && cart.quantity + quantity > product.stock) return res.status(400).json({ 'Error': 'Product not in stock' });

            await prisma.cart.create({
                data: {
                    user: { connect: { id: user.id } },
                    product: { connect: { id: productId } },
                    quantity
                }
            });
            return res.status(200).json({'Message': 'Product added successfully'});
        } catch (e){
            console.log(e);
            return res.status(400).json({ 'Error': 'Error adding product to cart' });
        }

    }

    async pay(req, res) {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    jwt: req.token
                },
                include: {
                    carts: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            if (!user) return res.status(400).json({ 'Error': 'User not found' });

            for (const cartItem of user.carts) {
                await prisma.order.create({
                    data: {
                        userId: user.id,
                        productId: cartItem.productId,
                        quantity: cartItem.quantity,
                        date: new Date().toISOString()
                    }
                });
                
                await prisma.product.update({
                    where : {
                        id: cartItem.productId
                    },
                    data : {
                        stock : {
                            decrement : cartItem.quantity
                        } 
                    }
                });
            }

            await prisma.cart.deleteMany({
                where: {
                    userId: user.id
                }
            });

            return res.status(200).json({ 'Message': 'Cart paid successfully' });
        } catch {
            return res.status(500).json({ 'Error': 'Failed to process payment' });
        }
    }

    async delete(req, res){
        try{
            const user = await prisma.user.findFirst({
                where: {
                    jwt: req.token
                }
            });

            await prisma.cart.deleteMany({
                where: {
                    userId: user.id
                }
            });

            return res.status(200).json({'Message': 'Cart deleted successfully'});
        }catch{
            return res.status(400).json({'Error': 'Bad request'});
        }
    }

    async deleteProduct(req, res){
        try{
            const user = await prisma.user.findFirst({
                where: {
                    jwt: req.token
                }
            });

            const cart = await prisma.cart.findFirst({
                where: {
                    userId: user.id,
                    productId: parseInt(req.params.id)
                }
            });

            if (!cart) return res.status(400).json({'Error': 'Product not found'});

            await prisma.cart.delete({
                where: {
                    id: cart.id
                }
            });

            return res.status(200).json({'Message': 'Product deleted successfully'});
        }catch (e){
            console.log(e);
            return res.status(400).json({'Error': 'Bad request'});
        }
    }

}

export default new CartsController;