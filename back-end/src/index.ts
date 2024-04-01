import express, {Request, Response} from 'express';//Rest api
import cors from 'cors';//security
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from './routes/users';
import authRoutes from './routes/auth';

//Create connect mongodb
mongoose.connect(process.env.MONGODB_CONNECTION as string);

//create a new express app
const app=express();
//request what express do as middleware
app.use(express.json());
//this request middleware
app.use(express.urlencoded({extended:true}));
//this use cors as security with request and response 
app.use(cors());

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes);

app.listen(7000,()=>{
    console.log("server running on http://localhost:7000/")
});