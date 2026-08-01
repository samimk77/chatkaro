import React, { useEffect } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useDispatch, useSelector } from "react-redux";
import { TiMessages } from "react-icons/ti";
import { setSelectedUser } from "../redux/userSlice";

const MessageContainer = () => {
  const { selectedUser, authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => dispatch(setSelectedUser(null));
  }, []);

  return (
    <>
      {selectedUser ? (
        <div className="flex flex-col flex-1 w-full relative">
          <div className="flex items-center p-3 text-white bg-purple-950/45">
            <div className="flex items-center gap-2">
              <img
                src={selectedUser?.profilePhoto}
                alt="user"
                className="w-10 sm:w-12 rounded-full"
              />
              <p>{selectedUser?.fullName}</p>
            </div>

          </div>

          <hr className="border-black" />

          <Messages />
          <SendInput />
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center text-white gap-2 font-serif text-center px-4">
          <h1 className="text-2xl sm:text-3xl">Hi {authUser?.fullName}</h1>
          <h1 className="text-xl sm:text-2xl">Start Chatting !</h1>
          <TiMessages className="text-4xl mt-2" />
        </div>
      )}
    </>
  );
};

export default MessageContainer;