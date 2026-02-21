const jwt=require("jsonwebtoken")

exports.isAuthenticated=async(req,res,next)=>{
    try{
        //token ko cookkie se extract krne ke liye cookie-parser chaiye hota hai
        const token=req.cookies.token;
         
        if(!token){
            return res.status(401).json({
                message:"user not authenticated"
            })
        }
        const decode=await jwt.verify(token,process.env.JWT_SECRET);
       
        
        if(!decode){
            return res.status(401).json({
                message:"invalid token"
            })
        }
        req.id=decode.userId;
      
        next();
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            message:"something went wrong"
        })
        
    }
}