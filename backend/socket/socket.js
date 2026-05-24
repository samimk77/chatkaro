const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chatkaro-frontend.vercel.app"
    ],
    methods: ["GET", "POST"],
     credentials:true
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

  });

  // WebRTC Signaling
  socket.on("callUser", (data) => {
    const receiverSocketId = getReceiverSocketId(data.userToCall);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incomingCall", { 
        signal: data.signalData, 
        from: data.from, 
        callerName: data.callerName, 
        callerProfilePhoto: data.callerProfilePhoto 
      });
    }
  });

  socket.on("answerCall", (data) => {
    const callerSocketId = getReceiverSocketId(data.to);
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", data.signal);
    }
  });

  socket.on("iceCandidate", (data) => {
    const targetSocketId = getReceiverSocketId(data.to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("iceCandidate", data.candidate);
    }
  });

  socket.on("endCall", (data) => {
    const targetSocketId = getReceiverSocketId(data.to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("endCall");
    }
  });

  socket.on("rejectCall", (data) => {
    const targetSocketId = getReceiverSocketId(data.to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("callRejected");
    }
  });

});

module.exports = { app, io, server,getReceiverSocketId };
