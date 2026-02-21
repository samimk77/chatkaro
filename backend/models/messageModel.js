const mongoose=require("mongoose")

const messageModel=new mongoose.Schema({
    senderId:{
        //primary key foreign key type ka relation banana hai userModel ke through ek id generate hoga joki sender ka ref hoga
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",  //"User" name hai  userModel me thats why uska reference le liye
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports= mongoose.model("Message",messageModel)