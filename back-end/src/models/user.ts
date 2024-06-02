import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserType } from "../shared/types";
import { verify } from 'crypto';

const userSchema= new mongoose.Schema({
    email:{type:String,required:true, unique:true},
    password:{type:String, required:true},
    firstName:{type:String, required:true},
    lastName:{type:String,required:true},
    profilePicture: {type: String, required: false},
    verify:{type:Boolean,default:false},
});

userSchema.pre("save",async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,8);
    }
    next();
})

const User=mongoose.model<UserType>("User",userSchema);

export default User;