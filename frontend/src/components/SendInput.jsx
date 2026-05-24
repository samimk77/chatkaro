import React, { useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
import { MdCancel } from "react-icons/md";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);
  const messages = useSelector((store) => store.message?.messages || []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setMediaPreview(null); // Document
      }
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmitHadler = async (e) => {
    e.preventDefault();
    if (!message.trim() && !media) return;

    try {
      const formData = new FormData();
      if (message) formData.append("message", message);
      if (media) formData.append("media", media);

      const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/message/send/${selectedUser?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      dispatch(setMessages([...messages, res?.data?.newMessage]));

    } catch (error) {
      console.log(error);
    }
    setMessage("");
    removeMedia();
  };

  return (
    <div className="absolute bottom-2 left-0 w-full p-3 flex flex-col gap-2 bg-transparent z-10">
      {/* Preview Section */}
      {media && (
        <div className="relative w-max bg-zinc-800 p-2 rounded-lg border border-zinc-700 shadow-lg ml-2">
          <button 
            onClick={removeMedia} 
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 z-10"
            type="button"
          >
            <MdCancel size={16} />
          </button>
          {mediaPreview ? (
            <img src={mediaPreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
          ) : (
            <div className="h-20 w-20 bg-zinc-700 flex items-center justify-center rounded text-xs text-white text-center p-1 break-words">
              {media.name}
            </div>
          )}
        </div>
      )}

      <form onSubmit={onSubmitHadler} className="flex items-center gap-2 w-full">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,application/pdf,.txt,.doc,.docx"
        />
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          title="Attach file"
        >
          <ImAttachment className="text-gray-700 text-xl" />
        </button>

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
      </form>
    </div>
  );
};

export default SendInput;
