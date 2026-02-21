const Conversation =require("../models/conversationModel");
const Message=require("../models/messageModel");
const { io, getReceiverSocketId } = require("../socket/socket");

exports.sendMessage=async(req,res)=>{
    try{
        const senderId=req.id;
        const receiverId=req.params.id;
        const {message}=req.body;

        let gotConversation=await Conversation.findOne({
            participants:{$all :[senderId,receiverId]}
        })
        if(!gotConversation){
            gotConversation=await Conversation.create({ //if conversation does not exits then create a conveesation
                participants:[senderId,receiverId]
            })
        }
        const newMessage=await Message.create({
            senderId,
            receiverId,
            message
        })

        //agar msg aya toh usko exisiting messages me add krdo
        if(newMessage){
            gotConversation.messages.push(newMessage._id)
        }
        //save conversation
        //humko dono conversation saath me save krna hai to 
        //iss tarah nahi likh skte

       // await gotConversation.save()
       // await newMessage.save()

       //instead use promise

       await Promise.all([gotConversation.save(),newMessage.save()])


        //IMPLEMENT SOCKET.IO
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }



        

       

        return res.status(200).json({
           newMessage
        })
        
        

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            message:"cannot send message",
        })
    }
}

//GET THE MSG FROM PARTICIPANTS ONLY NOT ALL MSGS

exports.getMessage=async(req,res)=>{
    try {
        const senderId=req.id;    
        const receiverId=req.params.id;
        const conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate("messages"); //POPULATE IS USED TO RETRIVE THE MESSAGE FROM OBJECTID
       
        return res.status(200).json({
            conversations:conversation?.messages,
            message:"message retrived successfully",
       
        })
        
        
    } catch (error) {
        console.log(error);
        res.staus(400).json({
            message:"cannot retrive the message"
        })
        
        
    }
}