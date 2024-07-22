import jsonwebtoken from "jsonwebtoken";
import { encryptPassword, matchPassword } from "../helpers/utis.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const {SECRET} = process.env;

class UsersController{

    async data(req, res){
        const user = await prisma.user.findFirst({
            where: {
                jwt: req.token
            }
        });
        delete user.id;
        delete user.password;
        if(!user) return res.status(400).json({'Error': 'User not found'});
        return res.json(user);
    }

    async search(req, res){
        const { name } = req.params;
        if (name === undefined) return res.status(400).json({ 'Error': 'Missing Data' });
        try{
            const user = await prisma.user.findMany({
                where: {
                    name
                }
            });
            if (!user) return res.status(400).json({ 'Error': 'User not found' });
            return res.json(user);
        }catch (e){
            console.log(e);
            return res.status(400).json({ 'Error': 'invalid data in use' });
        }
    }

    
    async signup(req, res){

        const { name, password } = req.body;
    
        if (name === undefined || password == undefined) return res.status(400).json({ 'Error': 'Missing Data' });
    
        let user = {
            name,
            password,
            admin : false
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
    
    }

    async promote(req, res){
        const {id} = req.params;
        if (id === undefined) return res.status(400).json({ 'Error': 'Missing Data' });
        try{
            await prisma.user.update({
                where: {
                    id: Number(id)
                },
                data: {
                    admin: true
                }
            });
            return res.status(200).json({'Message' : `User ${id} promoted successfully`});
        }catch (e){
            console.log(e);
            return res.status(400).json({ 'Error': 'invalid data in use' });
        }
    }

    async demote(req, res){
        const { id } = req.params;
        if (id === undefined) return res.status(400).json({ 'Error': 'Missing Data' });
        try{
            await prisma.user.update({
                where: {
                    id: Number(id)
                },
                data: {
                    admin: false
                }
            });
            return res.status(200).json({'Message' : `User ${id} demoted successfully`});
        }catch (e){
            console.log(e);
            return res.status(400).json({ 'Error': 'invalid data in use' });
        }
    }

    async signin(req, res){
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
    }

}

export default new UsersController;