import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetRealTimeMessage = () => {
  const { socket } = useSelector((store) => store.socket);
  const { messages } = useSelector((store) => store.message);
  const dispatch = useDispatch();

  useEffect(() => {
    //actual msg   //any variable name
    socket?.on("newMessage", (newMsg) => {
dispatch(setMessages([...(messages || []), newMsg]));
    });
  }, [socket, setMessages, messages]);
};

export default useGetRealTimeMessage;