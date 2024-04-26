import express, {Request, Response} from 'express';//Rest api
import cors from 'cors';//security
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from "cookie-parser";
import {initialize,session} from "passport";
import {v2 as cloudinary} from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


//Create connect mongodb
mongoose.connect(process.env.MONGODB_CONNECTION as string);

//create a new express app
const app=express();



//request what express do as middleware
app.use(cookieParser());
app.use(express.json());
//this request middleware
app.use(express.urlencoded({extended:true}));
//this use cors as security with request and response 
app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}));

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes);
app.use("/api/my-hotels",myHotelRoutes);

app.listen(7000,()=>{
    console.log("server running on http://localhost:7000/")
});