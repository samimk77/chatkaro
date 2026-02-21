
import Message from "./Message";
import useGetMessages from "../hooks/useGetMessages";
import { useSelector } from "react-redux";
import useGetRealTimeMessage from "../hooks/useGetRealTimeMessage";

const Messages = () => {
      useGetMessages(); 
       useGetRealTimeMessage();
        const {messages}=useSelector(store=>store.message)
        console.log("FULL REDUX STATE",messages);
        
    if(!Array.isArray(messages)) return null;
  return (

    <div className="px-4 flex-1 text-white overflow-y-scroll hide-scrollbar mt-2  mb-19">
      {
       messages && messages?.map((message)=>{
          return <Message key={message._id} message={message}/>
        })
      }
    </div>
  );
};

export default Messages;
