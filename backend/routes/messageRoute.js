const express=require("express");
const { sendMessage, getMessage } = require("../controllers/messageController");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const router=express.Router()

router.post("/send/:id",isAuthenticated,sendMessage) //next kya krta hai ki pehle authenticate wala function chalaega then sendMessage wala
router.get("/:id",isAuthenticated,getMessage)
module.exports=router;