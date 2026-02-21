import React, { useRef } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
const Message = ({ message }) => {

const time = new Date(message.createdAt).toLocaleTimeString([],{
  hour:"2-digit",
  minute:"2-digit",
  hour12:true
});

const scroll =useRef();

const {authUser}=useSelector(store=>store.user)
const {selectedUser}=useSelector(store=>store.user)


console.log("selecteduser",selectedUser);
console.log("auth user",authUser);


  useEffect(() => {
    scroll.current?.scrollIntoView({behavior:"smooth"})
   }, [message])
  
  return (
    <div>
      <div ref={scroll}
    className={
      `chat ${authUser?._id === message?.senderId ? "chat-end" : "chat-start"
  }`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              //agar jo banda login hai aur message bhi wahi bhej rha then auth user ka pic hona chaiye
              src={message.senderId === authUser?._id ? authUser?.profilePhoto : selectedUser?.profilePhoto} 
            />
          </div>
        </div>
        <div className="chat-header ">
          <time className="text-xs opacity-50 ">{time}</time>
        </div>
        <div className="chat-bubble bg-purple-900">{message?.message}</div>
      </div>  
    </div>
  );
};

export default Message;
