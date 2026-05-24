const express=require("express");
const { sendMessage, getMessage } = require("../controllers/messageController");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const upload = require("../middleware/upload");
const router=express.Router()

router.post("/send/:id", isAuthenticated, upload.single('media'), sendMessage) // 'media' is the form field name
router.get("/:id",isAuthenticated,getMessage)
module.exports=router;