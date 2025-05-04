import bcrypt from "bcryptjs";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const register = async (req ,res )=> {

    const {email, password, name} = req.body;
    console.log("request body ",req.body)
    try{
        const existingUser = await db.user.findUnique({
            where : {
                email
            }
        })
        if(existingUser){
            return res.status(400).json({
                error:"User already exists"
            })
            }
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await db.user.create({
            data:{
                email,
                password:hashedPassword,
                name,
                role:UserRole.USER
            }                
        })
        
        const token = jwt.sign({id:newUser.id}, process.env.JWT_SECRET, {expiresIn:"7d"});

        res.cookie("jwt", token ,{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "production",
            maxAge: 1000 * 60 * 60 *24 * 7
        })

        res.status(201).json({
            message:"User created successfuly",
            user:{
                id:newUser.id,
                email:newUser.email,
                name:newUser.name,
                role:newUser.role ,
                image: newUser.image
            }
        })
    
    } catch(error){
        console.log("Error Creating User ",error)
        res.status(500).json({
            error:"Error Creating User"
        })

    }
}


export const login = async (req ,res )=> {
    
}

export const logout = async (req ,res )=> {
    
}

export const check = async (req ,res )=> {
    
}