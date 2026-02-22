const express=require("express")
const cookieparser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");

// ✅ import app and server from socket.js, don't create new ones
const { app, server } = require("./socket/socket");

const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));

const corsOption = {
    origin: "https://chat-application-samimkausar240-6708s-projects.vercel.app/",
    credentials: true
}
app.use(cors(corsOption));

// connect db
const db = require("./config/database");
db.connectDB();

// routes
const userRoutes = require("./routes/userRoute");
app.use('/api/v1/user', userRoutes); // ✅ only need to register once

const messageRoutes = require("./routes/messageRoute");
app.use("/api/v1/message", messageRoutes);

// ✅ listen on server (not app) so socket.io works
server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
});
