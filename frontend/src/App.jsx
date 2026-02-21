import React, { useEffect,useState } from 'react'
import { Route,Routes } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import HomePage from './components/HomePage'
import { useDispatch, useSelector } from 'react-redux'
import {io} from "socket.io-client"
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/userSlice'


const App = () => {
  const {authUser}=useSelector(store=>store.user)
 const {socket} =useSelector(store=>store.socket)
  const dispatch =useDispatch();

  useEffect(()=>{
    if(authUser){
      const socket = io("http://localhost:8080" , {
        query:{
          userId:authUser._id
        }
      });
      dispatch(setSocket(socket))

      socket.on("getOnlineUsers",(onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      });

      //cleanup
      return()=>socket.close(); //dissconnect wala call hoga
    
    }
  
  },[authUser])

  return (
  <Routes>
    <Route path='/' element={<HomePage/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/login' element={<Login/>}/>


  </Routes>
  )
}

export default App