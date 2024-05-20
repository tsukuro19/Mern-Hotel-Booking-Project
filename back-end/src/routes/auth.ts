import express,{Request,Response} from 'express';
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import verifyToken from '../middleware/auth';
import * as passport from "passport";
import { jwtDecode } from "jwt-decode";

const router=express.Router();

// /api/auth/login-google
router.post("/login-google", async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
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
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
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

// /api/auth/validate-token
router.get("/validate-token",verifyToken,(req:Request,res:Response)=>{
    res.status(200).send({userId:req.userId})
});

// /api/auth/logout
router.post("/logout",(req:Request, res:Response)=>{
    res.cookie("auth-token","",{
        expires:new Date(0)
    });
    res.send();
});

export default router;