import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

const OtherUsers = ({ users }) => {
  useGetOtherUsers();

  const { otherUsers } = useSelector((store) => store.user);

  // ⭐ Ensure displayUsers is always an array
  const displayUsers =
    Array.isArray(users) && users.length
      ? users
      : Array.isArray(otherUsers)
      ? otherUsers
      : [];

  return (
    <div className="overflow-y-scroll hide-scrollbar mb-2 flex-1">
      {displayUsers.map((user) => (
        <OtherUser key={user._id} user={user} />
      ))}
    </div>
  );
};

export default OtherUsers;