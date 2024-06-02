import { NextFunction,Request,Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import nodemailer from "nodemailer";

declare global{
    namespace Express{
        interface Request{
            userId:string;
        }
    }
}

const verifyToken=(req:Request, res:Response, next:NextFunction)=>{
    const token=req.cookies['auth-token'];
    if(!token){
        return res.status(401).json({message:"not have token"});
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY as string);
        req.userId=(decoded as JwtPayload).userId;
        next();
    }catch(error){
        return res.status(401).json({message:"wrong token"});
    }
};

const verifyEmail=async(email: string | string[] ,link:string)=>{
    try{
        let transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"vongola392112@gmail.com",
                pass:"obxoufgsowrcxiph",
            },
            tls:{
                rejectUnauthorized:false
            }
        });

        //send email
        let info=await transporter.sendMail({
            from:"vongola392112@gmail.com",//sender email
            to:email,//receiver email
            subject:"Verify Email",
            text:"Please verify email",
            html:`<div>
            <a href=${link}>Click here to verify email</a>
            </div>`,
        })
        console.log("mail send successfully");
    }catch(error){
        console.log(error);
    }
}

const emailNotification=async(email: string|string[], hotelName:string, price:Number)=>{
    try{
        let transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"vongola392112@gmail.com",
                pass:"obxoufgsowrcxiph",
            },
            tls:{
                rejectUnauthorized:false
            }
        });

        //send email
        let info=await transporter.sendMail({
            from:"vongola392112@gmail.com",//sender email
            to:email,//receiver email
            subject:`You have booking hotel ${hotelName}`,
            text:`You have successfully booked a hotel named ${hotelName} for ${price}`,
        })
        console.log("mail send successfully");
    }catch(error){
        console.log(error);
    }
}

const forgetPassword=async(email: string | string[] ,link:string)=>{
    try{
        let transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"vongola392112@gmail.com",
                pass:"obxoufgsowrcxiph",
            },
            tls:{
                rejectUnauthorized:false
            }
        });

        //send email
        let info=await transporter.sendMail({
            from:"vongola392112@gmail.com",//sender email
            to:email,//receiver email
            subject:"Reset Password",
            text:"Click link after to reset password",
            html:`<div>
            <a href=${link}>Click here to Reset password</a>
            </div>`,
        })
        console.log("mail send successfully");
    }catch(error){
        console.log(error);
    }
}

export {
    verifyToken,
    verifyEmail,
    forgetPassword,
    emailNotification
}