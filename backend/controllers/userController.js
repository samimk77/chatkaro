const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const User =require("../models/userModel")

//REGISTER
exports.register=async(req,res)=>{
    try {
        const {fullName,username,password,confirmPassword,gender}=req.body;
        if(!fullName || !username|| !password || !confirmPassword|| !gender){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }
        if(password!=confirmPassword){
           return res.status(400).json({
                success:false,
                message:"Password not matching"
            })
        }

        //check if user already exits
        const user= await User.findOne({username});

        if(user){
            return res.status(400).json({
                success:false,
                message:"user already exits. please login"
            })
        }
        const hashedPassword=await bcrypt.hash(password,10)
       
        //profile pic API
        const malepic=`https://api.dicebear.com/9.x/toon-head/svg?seed=${username}`;
        const femalepic=`https://api.dicebear.com/9.x/toon-head/svg?seed=${username}`;

        //now register
        await User.create({
            fullName,
            username,
            password:hashedPassword,
            profilePhoto:gender==="male"?malepic:femalepic,
            gender,
        })
        return res.status(200).json({
            success:true,
            message:"User created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"internal error"
        })

    }

}

//LOGIN

exports.login=async(req,res)=>{
    try{
        const {username,password}=req.body;
        if(!username || !password){
            return res.status(400).json({
                success:false,
                message:"Enter both fields"
            })
        }
        let user= await User.findOne({username});
        //if user does not exist
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not registered"
            })
        }

        //if user exists then verify password

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"password mismatch"
            })
        }
      
        //if password matches then create token
        const tokenData={
            userId:user._id
        }
        const token=await jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:"1d"})
        //now store this token in cookie

     const options = {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    sameSite: "None",   // ⭐ REQUIRED for Vercel → Render
    secure: true        // ⭐ REQUIRED for HTTPS
};
      return res
  .status(200)
  .cookie("token", token, options)
  .json({
    _id:user._id,
    username:user.username,
    fullName:user.fullName,
    profilePhoto:user.profilePhoto,
    message:"User Loggedin Successfully"
  });
        
    }
    catch(error){
        console.log(error);
        
        return res.status(400).json({
            success:false,
            message:"login failure"
        })

    }

}

//LOGOUT
exports.logout=(req,res)=>{  //isme time nahi  lagrha toh async use nahi krege
  
    try{
   
return res
  .status(200)
  .clearCookie("token",{
    httpOnly:true,
    sameSite:"None",
    secure:true
  })
  .json({
    success:true,
    message:"User logged out successfully"
  });

    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"something went wrong"
        })

    }
}

//other users ko show krne ke liye function
exports.getOtherUsers=async(req,res)=>{
    try{
        const loggedinUserid=req.id;
        //fetch all other users except the one logged in   -password means password ko chor ke baaki sb dedo
        const otherUsers=await User.find({_id:{$ne:loggedinUserid}}).select("-password");
        return res.status(200).json({
            otherUsers
        })
    }
    catch(error){
        console.log(error);
        
    }
}