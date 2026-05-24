import React from "react";
import { IoSearch } from "react-icons/io5";
import OtherUsers from "./OtherUsers";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setAuthUser, setSelectedUser } from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const dispatch = useDispatch();
  const { otherUsers } = useSelector((store) => store.user);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      setFilteredUsers([]);
      return;
    }

    const result = otherUsers.filter((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    );

    result.length > 0
      ? setFilteredUsers(result)
      : toast.error("User not found");
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
        { withCredentials: true }
      );

      toast.success(res.data.message);
      navigate("/login");
      dispatch(setAuthUser(null));
      dispatch(setSelectedUser(null));
      dispatch(setMessages([]));
      localStorage.removeItem("authUser");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col p-4 sm:p-5 border-r border-slate-500 
                    w-full md:w-[30%] lg:w-[25%] h-full overflow-y-auto">

      <form onSubmit={handleSearch} className="flex w-full gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Users.."
          className="border border-gray-500 bg-white/95 flex-1 p-2 text-gray-900 rounded-md"
        />
        <button type="submit">
          <IoSearch className="text-white size-7 cursor-pointer" />
        </button>
      </form>

      <hr className="my-4 border-black" />

      <OtherUsers users={filteredUsers.length ? filteredUsers : otherUsers} />

      <hr className="border-black mt-3" />

      <button
        onClick={handleLogout}
        className="bg-red-700 w-full sm:w-[60%] md:w-[50%] rounded-md mt-3 py-2 
                   cursor-pointer text-white hover:bg-red-800 duration-200 active:scale-95"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;