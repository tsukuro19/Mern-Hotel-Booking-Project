import express, {Request, Response} from 'express';//Rest api
import cors from 'cors';//security
import "dotenv/config"
import mongoose from "mongoose"

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

app.get("/api/test",async(req:Request, res:Response)=>{
    res.json({message:"hello"});
});

app.listen(7000,()=>{
    console.log("server running on http://localhost:7000/")
});