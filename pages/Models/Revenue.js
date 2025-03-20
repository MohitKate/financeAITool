import mongoose from "mongoose";

const revenueSchema=new mongoose.Schema({
    revenueId:{
        type:String,
        required:true
    },
    month:{
        type:String,
        required:true
    },
    revenue:{
        type:Number,
        required:true
    }
});

const Revenue=mongoose.models.Revenues || mongoose.model('Revenues',revenueSchema);

export default Revenue;