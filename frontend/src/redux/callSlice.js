import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isReceivingCall: false,
  callerSignal: null,
  callerInfo: null,
  callAccepted: false,
  callEnded: false,
  isActiveCall: false,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setIncomingCall: (state, action) => {
      state.isReceivingCall = true;
      state.callerSignal = action.payload.signal;
      state.callerInfo = {
        from: action.payload.from,
        name: action.payload.callerName,
        profilePhoto: action.payload.callerProfilePhoto,
      };
      state.callEnded = false;
      state.callAccepted = false;
    },
    acceptCall: (state) => {
      state.callAccepted = true;
      state.isActiveCall = true;
      state.isReceivingCall = false;
    },
    startCall: (state) => {
      state.isActiveCall = true;
      state.callEnded = false;
    },
    endCall: (state) => {
      state.isReceivingCall = false;
      state.callerSignal = null;
      state.callerInfo = null;
      state.callAccepted = false;
      state.isActiveCall = false;
      state.callEnded = true;
    },
    resetCallState: (state) => {
      return initialState;
    },
  },
});

export const { setIncomingCall, acceptCall, startCall, endCall, resetCallState } = callSlice.actions;
export default callSlice.reducer;
