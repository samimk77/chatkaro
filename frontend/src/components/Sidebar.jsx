import React from "react";
import { IoSearch } from "react-icons/io5";
import OtherUsers from "./OtherUsers";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setAuthUser, setOtherUsers } from "../redux/userSlice";


const Sidebar = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [filteredUsers, setFilteredUsers] = useState([]);


  const dispatch=useDispatch();

  const {otherUsers}=useSelector(store=>store.user);


  //search function
const handleSearch = (e) => {
  e.preventDefault();

  if (!search.trim()) {
    setFilteredUsers([]); // reset search
    return;
  }

  const result = otherUsers.filter(user =>
    user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  if (result.length > 0) {
    setFilteredUsers(result);
  } else {
    toast.error("User not found");
  }
};


  const handleLogout = async () => {
    try {
      //axios with credential yha pe zaruri nhi coz middleware nhi pass krrhe isme
      const res = await axios.get(`http://localhost:8080/api/v1/user/logout`);
      console.log(res);
      toast.success(res.data.message);

      //logout krne ke baad login page pe redirect krjao
      navigate("/login");
       dispatch(setAuthUser(null));
        dispatch(setSelectedUser(null));  // ✅ add this
        dispatch(setMessages([]));        // ✅ add this
        localStorage.removeItem("authUser"); // ✅ add this
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col p-5 border border-r border-slate-500 w-[35%]">
      <form onSubmit={handleSearch} className="flex">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search Users.."
          className="border border-gray-500  bg-white/95 flex-1 p-1 text-gray-900 "
        />
        <button type="submit">
          <IoSearch className=" text-white  size-8 cursor-pointer ml-1" />
        </button>
      </form>

      <div className="mt-5">
        <hr className="border-black" />
      </div>

      <OtherUsers users={filteredUsers.length ? filteredUsers : otherUsers} />

      <hr className="border-black" />
      <button
        onClick={handleLogout}
        className="bg-red-700 w-[40%] rounded-md mt-3 py-1 cursor-pointer text-white text-md hover:bg-red-800 duration-200 active:scale-95 "
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
