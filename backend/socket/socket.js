const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});


//get receiver sockt id method
const getReceiverSocketId = (receiverId)=>{
  return userSocketMap[receiverId];
}
const userSocketMap={};  //{userId->socketid} key value pair

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  const userId=socket.handshake.query.userId
  //agar userid milti hai toh usko usersocket map me store krdo
  if(userId !=undefined){
    userSocketMap[userId]=socket.id
  } 

  io.emit('getOnlineUsers',Object.keys(userSocketMap));

 socket.on('disconnect',()=>{
    console.log('user disconnected',socket.id);
    delete userSocketMap[userId]
     io.emit('getOnlineUsers',Object.keys(userSocketMap)); //delete hone ke baad phirse update kro

  })
});

module.exports = { app, io, server,getReceiverSocketId };
