const express=require("express")
const router = express.Router();

const{register,login,logout,getOtherUsers}=require("../controllers/userController");
const { isAuthenticated } = require("../middleware/isAuthenticated");


router.post("/register",register)
router.post("/login",login)
router.get("/logout",logout)
router.get("/",isAuthenticated,getOtherUsers)

module.exports=router;