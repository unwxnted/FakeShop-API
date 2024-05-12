import { Router } from "express";
import jsonwebtoken from "jsonwebtoken";
import { encryptPassword, matchPassword } from "../helpers/utis.js";
import { PrismaClient } from '@prisma/client';

const usersRouter = new Router();
const prisma = new PrismaClient();

const {SECRET, ADMIN_SECRET} = process.env;

usersRouter.post('/users/signup', async (req, res) => {

    const { name, password } = req.body;

    if (name === undefined || password == undefined) return res.status(400).json({ 'Error': 'Missing Data' });

    let admin = false;

    if (req.body.admin && req.body.admin === ADMIN_SECRET) admin = true;

    let user = {
        name,
        password,
        admin
    };

    try {
        if (await prisma.user.findFirst({
            where: {
                name
            }
        })) return res.status(400).json({ 'Error': 'This name has been used' });

        user.jwt = jsonwebtoken.sign({ user }, SECRET);
        user.password = await encryptPassword(user.password);

        const newUser = await prisma.user.create({
            data: user
        });
        
        return res.json({name :newUser.name, jwt: newUser.jwt});
    } catch (error) {
        return res.status(400).json({ 'Error': 'invalid data in use' });
    }

});


usersRouter.get('/users/signin', async (req, res) => {
    const { name, password } = req.body;
    if (name === undefined || password === undefined) return res.status(400).json({ 'Error': 'Missing data' });

    try {
        const user = await prisma.user.findFirst({
            where: {
                name
            }
        });
        if (user && matchPassword(password, user.password)) return res.json({ jwt: user.jwt });
    } catch (error) {
        return res.status(400).json({ 'Error': 'invalid data in use' });
    }

    return res.status(404).json({ 'Error': 'Auth error' });
});

export default usersRouter;