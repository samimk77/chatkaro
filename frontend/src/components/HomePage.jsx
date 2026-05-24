import React from "react";
import Sidebar from "./Sidebar";
import MessageContainer from "./MessageContainer";
import VideoCall from "./VideoCall";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-2 sm:px-4">

      {/* Main Chat Wrapper */}
      <div
        className="
        flex flex-col md:flex-row   /* ⭐ mobile stack, desktop side-by-side */
        h-screen md:h-[85vh]        /* full height on mobile */
        w-full md:w-[90%] lg:w-[75%]
        bg-blue-600 rounded-md
        backdrop-blur-xl bg-opacity-10
        border border-gray-100
        overflow-hidden
        bg-transparent 
        "
      >
        <Sidebar />
        <MessageContainer />
      </div>

      <VideoCall />


    </div>
  );
};

export default HomePage;