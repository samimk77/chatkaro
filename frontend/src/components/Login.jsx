import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const dispatch=useDispatch(); //action ko dispatch krne ke liye
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
   

    try {

      const res = await axios.post(
        `http://localhost:8080/api/v1/user/login`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      //GET THE LOGGED IN USER
      console.log("LOGGEDIN USER",res);

      dispatch(setAuthUser(res.data))
        toast.success(res.data.message);
      navigate("/");

      setUser({
        username: "",
        password: "",
      });
    } catch (error) {
      toast.error(error.response.data.message);
      setUser ({
        username:user.username,
        password: "",
      });
    }
  };
  return (
    <div className="text-white w-full h-screen flex items-center justify-center">
      <div className="h-[60%] w-[30%] bg-blue-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 border border-gray-100 bg-transparent">
        <form onSubmit={handleSubmit} action="">
          <div className="flex flex-col ml-10 mt-3 gap-3">
            <div className="mb-5">
              <h1 className="flex items-center justify-center mr-10 mt-0 text-3xl font-medium">
                LOGIN
              </h1>
            </div>

            <label htmlFor="username">Username:</label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              placeholder="Enter username"
              id="username"
              className="border border-gray-200 p-2 w-[90%]"
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter password"
              id="password"
              className="border border-gray-200 p-2 w-[90%]"
            />
            <button
              type="submit"
              className="border border-gray-300  p-2 w-[90%] mt-8 cursor-pointer hover:bg-purple-600/30 active:translate-y-0.5 transition-all transition duration-200 "
            >
              Login
            </button>
            <Link
              to="/signup"
              className="flex items-center justify-center mr-10 mt-3"
            >
              Don't have an account? Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
