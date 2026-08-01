import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/`);
        console.log(res); //iss response ke data ko store me store krdo (react redux)
        console.log("API DATA:", res.data);
        console.log("HOOK RUNNING");

        dispatch(setOtherUsers(res.data.otherUsers));
      }
       catch (error) {
        console.log(error);
      }
    };

    fetchOtherUsers();
  }, []);
};

export default useGetOtherUsers;