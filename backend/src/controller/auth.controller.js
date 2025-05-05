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
            secure:false,//process.env.NODE_ENV !== "production",
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
            },
            success:true
        })
    
    } catch(error){
        console.log("Error Creating User ",error)
        res.status(500).json({
            error:"Error Creating User"
        })

    }
}


export const login = async (req ,res )=> {
    const {email, password} = req.body;
    try{
        const user = await db.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            return res.status(400).json({

            
                error:"Invalid Credentials"
            })
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                error:"Invalid Credentials"
            })
        }

        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn:"7d"});
        res.cookie("jwt", token ,{
            httpOnly:true,
            sameSite:"strict",
            secure:false, //process.env.NODE_ENV !== "production",
            maxAge: 1000 * 60 * 60 *24 * 7
        })

        res.status(201).json({
            message:"User loggedin successfuly",
            user:{
                id:user.id,
                email:user.email,
                name:user.name,
                role:user.role ,
                image: user.image
            },
            success:true
        })

    }catch(error){
        console.log("Error Creating User ",error)
        res.status(500).json({
            error:"Error Creating User"
        })
    }
    
}

export const logout = async (req ,res )=> {
    try{

        res.clearCookie("jwt", {
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "production",
        })
        res.status(200).json({
            message:"User logged out successfully",
            success:true
        })
    }catch(error){
        console.log("Error Creating User ",error)
        res.status(500).json({
            error:"Error Logging out User"
        })
    }
}

export const check = async (req ,res )=> {
   try{ 
        res.status(200).json({
            success:true,
            message:"User is logged in",
            user:req.user,
            token:req.cookies.jwt
        })


        }catch(error){
            console.log("error checkign user ",error)
            return res.status(500).json({
                error:"Internal server error"
    })

}
} 