import {createSlice} from "@reduxjs/toolkit"

export const userSlice=createSlice({
    name:"user",
    initialState:{
        authUser:null,
        otherUsers:[],
        selectedUser:null,
        onlineUsers:[]
        
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.authUser=action.payload; //FRONTEND SE JO DATA BHEJEGE/DISPATCH KREGE WO ISME JAAKE STORE HOJAEGA
        },
        setOtherUsers:(state,action)=>{
            state.otherUsers=action.payload  //other ussers ko yha pe store krdo
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers=action.payload
        }
      
    }
})

export const {setAuthUser,setOtherUsers,setSelectedUser,setOnlineUsers} =userSlice.actions
export default userSlice.reducer