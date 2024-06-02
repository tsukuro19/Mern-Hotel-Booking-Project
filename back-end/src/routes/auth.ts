import express,{Request,Response, response} from 'express';
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import {verifyToken,forgetPassword} from '../middleware/auth';
import * as passport from "passport";
import { jwtDecode } from "jwt-decode";

const router=express.Router();

// /api/auth/login-google
router.post("/login-google", async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const passwordGoogle=RandomPassword();

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        // Decode the Google token to get user information
        const tokenDecoded: any = jwtDecode(token); // Ensure jwtDecode returns a type compatible with the user info
        const { email, given_name, family_name } = tokenDecoded;

        if (!email) {
            return res.status(400).json({ message: "Invalid token" });
        }

        // Check if the user already exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists, generate JWT and set cookie
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: "1d" }
            );

            res.cookie("auth-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000, // 1 day
            });

            return res.status(200).json({ userId: user._id });
        } else {
            // User does not exist, create a new user
            user = new User({
                email,
                firstName: given_name,
                lastName: family_name,
                password: passwordGoogle,
                verify:true
            });

            await user.save();

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: "1d" }
            );

            res.cookie("auth-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000, // 1 day
            });

            return res.status(200).json({ userId: user._id });
        }
    } catch (error) {
        console.error("Error during Google login", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// /api/auth/login
router.post("/login",[
    check("email","Email is required").isEmail(),
    check("password","Password with 6 or more characters is required").isLength({
        min:6
    })
], async (req:Request, res:Response)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({message:errors.array()});
    }

    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Cannot find user"});
        }
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Wrong Password"});
        }

        if(user.verify===false){
            return res.status(400).json({message:"Please verify your email"});
        }
        const token=jwt.sign(
            {userId:user.id},
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn:"1d"
            }
        )
        res.cookie("auth-token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            maxAge:86400000,
        });
        res.status(200).json({userId:user._id})
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
})

// /api/auth/forget-password
router.post("/forget-password",[
    check("email","Email is required").isEmail()
],async(req:Request, res:Response)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({message:errors.array()});
    }

    const {email}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Cannot find user"});
        }
        return res.status(200).json({user:user});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
})

router.post("/new-password/:userId",[
    check("password","Password with 6 or more characters is required").isLength({
        min:6
    })
],async(req:Request, res:Response)=>{
    try{
        const { userId } = req.params;
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        
        const user=await User.findOneAndUpdate({
            _id:userId
        },{
            password:hashedPassword
        })
        await(user?.save())
        res.status(200).json({message:"Changed password"});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
})

// /api/auth/validate-token
router.get("/validate-token",verifyToken,async (req:Request,res:Response)=>{
    try{
        const user=await User.findOne({_id:req.userId});
        if(user?.verify===false){
            res.status(404).send({message:"Please verify your email"});
        }else{
            res.status(200).send({userId:req.userId})
        }
    }catch(error){
        console.log(error);
    }
});

// /api/auth/logout
router.post("/logout",(req:Request, res:Response)=>{
    res.cookie("auth-token","",{
        expires:new Date(0)
    });
    res.send();
});

const RandomPassword=()=>{
    const length=12;
    const upperCase="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCase="abcdefghijklmnopqrstuvwxyz";
    const number="0123456789";
    const symbol=`~!@#$%^&*()-_=+[{]}\|;:'",<.>/?`;
    const allChar=upperCase+lowerCase+number+symbol;

    let password="";
    while(length>password.length){
        password+=allChar[Math.floor(Math.random()*allChar.length)];
    }
    return password;
}

export default router;