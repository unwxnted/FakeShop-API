import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const {SECRET} = process.env;

export const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export const matchPassword = async (password, savedPasword) =>{

    try{
        return await bcrypt.compare(password, savedPasword);
    }catch(e){
        console.log(e)
    }
    
};

export const isLogged = async (req, res, next) => {
    const token = req.headers['authorization'];
    if(token === undefined) return res.status(400).json({'Error': 'Token Missing'});
    req.token = token;
    jsonwebtoken.verify(req.token, SECRET, (err, data) => {
        if(!err) return next();
        return res.status(403).json({'Error': 'Token not valid'});
    });
}

export const isAdmin = async (req, res, next) => {
    const token = req.token;
    
    const user = await prisma.user.findFirst({
        where: {
            jwt : token
        }
    });

    if(user && user.admin) return next();
    
    return res.status(403).json({'Error': 'Incorrect user privileges'});

}