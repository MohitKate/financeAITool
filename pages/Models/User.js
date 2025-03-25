import { request } from "http";
import mongoose from "mongoose";
import { type } from "os";

const userSchema= new mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const User= mongoose.models.User || mongoose.model('User', userSchema);

export default User;