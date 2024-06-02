import express,{Request,Response} from 'express';
import User from "../models/user";
import jwt from 'jsonwebtoken';
import { check, validationResult } from "express-validator";
import { error } from 'console';
import {verifyToken,verifyEmail} from "../middleware/auth";
import crypto from "crypto";
import Token from '../models/token';

const router=express.Router();



router.get("/me", verifyToken, async (req: Request, res: Response) => {
    const userId = req.userId;
  
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
  });

// /api/users/register
router.post("/register",[
    check("firstName","First name is required").isString(),
    check("lastName","Last name is required").isString(),
    check("email","Email is required").isEmail(),
    check("password","Password with 6 or more characters required").isLength({
            min:6
        }
    )
],async (req:Request,res:Response)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message:errors.array()})
    }
    try{
        const emailToken=crypto.randomBytes(64).toString("hex");
        let user=await User.findOne({
            email:req.body.email
        });
        
        if(user){
            return res.status(400).json({message:"User already exist"});
        }
        user=new User(req.body);
        await user.save();
        const token=jwt.sign(
            {userId:user.id},
            process.env.JWT_SECRET_KEY as string,{
                expiresIn:"1d"
            }
        );
        res.cookie("auth-token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            maxAge:86400000
        })

        //generate verification token 
        const tokenVerify=new Token({
            userId:user._id,
            token:emailToken
        });
        await tokenVerify.save();

        //send email
        const link=`http://localhost:7000/api/users/confirm/${tokenVerify.token}`;
        await verifyEmail(req.body.email,link);
        
        return res.status(200).json({message:"Email sended"});
    }catch(error){
        console.log(error);
        res.status(500).send({message:"Something went wrong"});
    }
})

router.get("/confirm/:token",async(req:Request,res:Response)=>{
    try{
        const token = await Token.findOne({
            token: req.params.token
        });
        if (token) {
            await User.updateOne({ _id: token.userId }, { $set: { verify: true } });
            await Token.findByIdAndDelete(token._id);
            res.status(200).send("email verified")
        } else {
            // Handle the case when no token is found
            res.status(404).json({ message: "Token not found" });
        }
    }catch(error){
        res.status(500).send({message:"An error occurred"});
        console.log(error);
    }
})


export default router;