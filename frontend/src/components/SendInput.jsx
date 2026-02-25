import React from "react";
import { IoSend } from "react-icons/io5";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);
 const messages = useSelector((store) => store.message?.messages || []);


  console.log("MESSAGES STATE:", messages);

  const onSubmitHadler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/message/send/${selectedUser?._id}`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      console.log(res);
      dispatch(setMessages([...messages, res?.data?.newMessage])); //already existing messages me new message add krdo


    } catch (error) {
      console.log(error);
    }
    setMessage("");
  };

  return (
    <form
      onSubmit={onSubmitHadler}
      className="absolute bottom-2 left-0 w-full p-3"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
          className="flex-1 bg-gray-200 p-2 rounded-md py-1.5 text-gray-900"
        />
        <button type="submit">
          <IoSend className="text-white text-xl size-7 cursor-pointer" />
        </button>
      </div>
    </form>
  );
};

export default SendInput;
