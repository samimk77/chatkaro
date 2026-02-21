import React, { useEffect } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useDispatch, useSelector } from "react-redux";
import { TiMessages } from "react-icons/ti";
import { setSelectedUser } from "../redux/userSlice";
const MessageContainer = () => {
 
  const {selectedUser,authUser}=useSelector(store=>store.user)

  //logout krne ke baad bhi redux state me selecteduser ka value stored reh rha toh cleanup kro

  const dispatch=useDispatch();

  // useEffect(()=>{
  //   return ()=>dispatch(setSelectedUser(null));
  // },[])
  
  return (

    <>
      {
        selectedUser ? (<div className="flex flex-col w-[75%] relative ">
      <div className="flex items-center p-3 text-white cursor-pointer bg-purple-950/45">
        <div className="flex items-center pb-[2.5px] gap-2 ">
          <img src={selectedUser?.profilePhoto} alt="user" className="w-12" />
          <p className="flex ml-3">{selectedUser?.fullName}</p>
        </div>
       
      </div>
       <hr className="border-black"/>
       <Messages/>
       <SendInput/>
    </div>) : (

   <div className="flex flex-col w-[75%] h-full items-center justify-center text-white gap-2 font-serif">
   <h1  className="text-3xl font-md text-center">Hi {authUser?.fullName}</h1>
  <h1 className="text-2xl font-md text-center">
    Start Chatting !
  </h1>

  <TiMessages className="text-4xl mt-2" />
</div>

      )
      }
    </>
    
  );
};

export default MessageContainer;
