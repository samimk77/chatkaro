const mongoose=require("mongoose")
require("dotenv").config();

exports.connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DATABASE CONNECTION SUCCESSFUL");
    }
    catch(error){
        console.log("DB CONNECTION FAILED");
        console.error(error);
        process.exit(1)
        
    }
}