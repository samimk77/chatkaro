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
        <div className="chat-bubble bg-purple-900 flex flex-col gap-2">
          {message?.mediaUrl && message?.mediaType === 'image' && (
            <img 
              src={message.mediaUrl} 
              alt="attachment" 
              className="max-w-[200px] sm:max-w-xs rounded-lg cursor-pointer hover:opacity-90"
              onClick={() => window.open(message.mediaUrl, '_blank')}
            />
          )}
          {message?.mediaUrl && message?.mediaType !== 'image' && (
            <a 
              href={message.mediaUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-purple-800 p-2 rounded text-white hover:bg-purple-700 transition-colors"
            >
              📄 View Document
            </a>
          )}
          {message?.message && (
            <span>{message.message}</span>
          )}
        </div>
      </div>  
    </div>
  );
};

export default Message;
