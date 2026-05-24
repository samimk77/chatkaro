import React, { useEffect,useState } from 'react'
import { Route,Routes } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import HomePage from './components/HomePage'
import { useDispatch, useSelector } from 'react-redux'
import {io} from "socket.io-client"
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/userSlice'
import { setIncomingCall, endCall } from './redux/callSlice'


const App = () => {
  const {authUser}=useSelector(store=>store.user)
 const {socket} =useSelector(store=>store.socket)
  const dispatch =useDispatch();

useEffect(()=>{
  if(authUser && !socket){
    const newSocket = io(import.meta.env.VITE_BACKEND_URL,{
      query:{ userId:authUser._id },
      withCredentials:true
    });

    dispatch(setSocket(newSocket));

    newSocket.on("getOnlineUsers",(onlineUsers)=>{
      dispatch(setOnlineUsers(onlineUsers));
    });

    newSocket.on("incomingCall", (data) => {
      dispatch(setIncomingCall(data));
    });

    newSocket.on("endCall", () => {
      dispatch(endCall());
    });
    
    newSocket.on("callRejected", () => {
      dispatch(endCall());
    });

    return ()=> newSocket.close();
  }
},[authUser]);

  return (
  <Routes>
    <Route path='/' element={<HomePage/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/login' element={<Login/>}/>


  </Routes>
  )
}

export default App