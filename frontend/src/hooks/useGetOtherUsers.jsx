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
        axios.defaults.withCredentials = true; //jha jha middleware use hoga wha pe ye line likhna pdega coz idhar isauthenticated walla middleware use horha hai
        const res = await axios.get(`http://localhost:8080/api/v1/user/`);
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