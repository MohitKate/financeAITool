import mongoose from "mongoose";

const customerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    image_url:{
        type:String,
        required:true
    }
});

const Customers=mongoose.models.Customers || mongoose.model('Customers',customerSchema);

export default Customers;