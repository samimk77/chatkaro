import React from "react";
import { useDispatch ,useSelector} from "react-redux";
import { setSelectedUser } from "../redux/userSlice";

const OtherUser = (props) => {
  const user = props.user;
const dispatch=useDispatch();
const {selectedUser} =useSelector(store=>store.user)
const {onlineUsers}=useSelector(store=>store.user)

const isOnline=onlineUsers.includes(user._id)

  const selectedUserHandler=(user)=>{
    console.log(user);

    //ab iss user ke info ko redux me store krdo
    dispatch(setSelectedUser(user));
    
  }

  return (
    <div
  onClick={() => selectedUserHandler(user)}
  className={`${selectedUser?._id === user?._id ? "bg-purple-950/65 rounded-md hover:bg-purple-950/65 scale-101"  : ""} 
  flex items-center justify-between mt-5 text-white cursor-pointer hover:bg-purple-700/18 rounded-md`}
>

      <div className="flex items-center  gap-2 ">
       <img
  src={user?.profilePhoto}
  alt="avatar"
  className="w-12"
/>
        <p className="flex ml-2">{user?.fullName}</p>
      </div>
      <div className={`${isOnline ? 'w-2 h-2 bg-green-500 rounded-full mr-5' : ''}`}>

      </div>
    </div>
  );
};

export default OtherUser;