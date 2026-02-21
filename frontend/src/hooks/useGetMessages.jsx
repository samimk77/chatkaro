import React,{useEffect} from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch=useDispatch();

  useEffect(() => {
      dispatch(setMessages([]));
     if (!selectedUser?._id) return
       
    const fetchMessages = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          `http://localhost:8080/api/v1/message/${selectedUser?._id}`,
        );
        console.log("messagefetched",res);
        dispatch(setMessages(res.data.conversations))
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [selectedUser?._id,setMessages]);
};

export default useGetMessages;