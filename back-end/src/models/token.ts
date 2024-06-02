import mongoose from "mongoose";

const tokenSchema= new mongoose.Schema({
    userId:{
        type:String,
        ref:"user",
        required:true,
    },
    token:{
        type:String,
        require:true,
    }
});

const Token=mongoose.model("token",tokenSchema);

export default Token;