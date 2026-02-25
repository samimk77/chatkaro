import React from "react";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";



const Signup = () => {
  const [user, setUser] = useState({
    fullName:"",
    username:"",
    password:"",
    confirmPassword:"",
    gender:""

  })

  const navigate=useNavigate()

  const handleCheckbox=(gender)=>{
    setUser({...user,gender})
  }

  const onSubmitHandler=async(e)=>{
    e.preventDefault();
  

    try{
      console.log(user);
      
      const res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`,user,{
        headers:{
          "Content-Type":'application/json'
        },
        withCredentials:true
      })
      if(res.data.success){
        console.log(res);
        
        navigate("/login")
        toast.success(res.data.message)
      }
      
    }
    catch(error){
      toast.error(error.response.data.message)
      console.log(error);
      
    }

    //submit krne ke baad form empty  krdo
    setUser({
    fullName:"",
    username:"",
    password:"",
    confirmPassword:"",
    gender:""
    })
    
  }
  
  return (
    <div className="text-white w-full h-screen flex items-center justify-center">
      <div className="h-[80%] w-[30%] bg-blue-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 border border-gray-100 bg-transparent">
        <form onSubmit={onSubmitHandler} action="">
          <div className="flex flex-col ml-10 mt-3 gap-3">
            <div className="mb-5">
              <h1 className="flex items-center justify-center mr-10 mt-0 text-3xl font-medium">
                SIGNUP
              </h1>
            </div>

            <label htmlFor="name" className="">
              Name:
            </label>
            <input
            value={user.fullName}
            onChange={(e)=>setUser({...user,fullName:e.target.value})}
              type="text"
              placeholder="Enter your fullname"
              id="fullname"
              className="border border-gray-200 p-2 w-[90%]"
            />

            <label htmlFor="username">Username:</label>
            <input
            value={user.username}
            onChange={(e)=>setUser({...user,username:e.target.value})}
              type="text"
              placeholder="Enter username"
              id="username"
              className="border border-gray-200 p-2 w-[90%]"
            />

            <label htmlFor="password">Password:</label>
            <input
            value={user.password}
            onChange={(e)=>setUser({...user,password:e.target.value})}
              type="password"
              placeholder="Enter password"
              id="password"
              className="border border-gray-200 p-2 w-[90%]"
            />

            <label htmlFor="confirmpassword">Confirm Password:</label>
            <input
            value={user.confirmPassword}
               onChange={(e)=>setUser({...user,confirmPassword:e.target.value})}
              type="password"
              placeholder="Confirm password"
              id="confirmpassword"
              className="border border-gray-200 p-2 w-[90%]"
            />

            <div className="flex gap-2 mt-2 ">
              <p>Male</p>
              <input
                type="checkbox"
                checked={user.gender==="male"}
                onChange={()=>handleCheckbox("male")}
                className="checkbox border border-gray-300"
                id="male"
              />
              <p className="ml-3">Female</p>
              <input
                type="checkbox"
                checked={user.gender==="female"}
                onChange={()=>handleCheckbox("female")}
                className="checkbox border border-gray-300"
                id="female"
              />
            </div>

            <button type="submit" className="border border-gray-300  p-2 w-[90%] mt-8 cursor-pointer hover:bg-purple-600/30 active:translate-y-0.5 transition-all transition duration-200 ">
              Create Account
            </button>
            <Link
              to="/login"
              className="flex items-center justify-center mr-10 mt-3"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
