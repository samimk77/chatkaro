import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { acceptCall as acceptCallAction, endCall as endCallAction } from "../redux/callSlice";
import { MdCallEnd, MdCall } from "react-icons/md";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";

const VideoCall = () => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const iceCandidatesQueue = useRef([]);

  const { socket } = useSelector((store) => store.socket);
  const { authUser, selectedUser } = useSelector((store) => store.user);
  const targetUserId = selectedUser?._id;
  const { isReceivingCall, callerSignal, callerInfo, callAccepted, isActiveCall } = useSelector((store) => store.call);
  const dispatch = useDispatch();

  // Attach remote stream when it's available and the video element is mounted
  useEffect(() => {
    if (userVideo.current && remoteStream) {
      userVideo.current.srcObject = remoteStream;
    }
  }, [remoteStream, callAccepted]);

  // Global ICE candidate listener to handle early candidates
  useEffect(() => {
    if (!socket) return;
    const handleIceCandidate = (candidate) => {
      if (connectionRef.current && connectionRef.current.remoteDescription) {
        connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error(e));
      } else {
        iceCandidatesQueue.current.push(candidate);
      }
    };
    socket.on("iceCandidate", handleIceCandidate);
    return () => socket.off("iceCandidate", handleIceCandidate);
  }, [socket]);

  // Get local media stream
  useEffect(() => {
    if ((isActiveCall || isReceivingCall) && !stream) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
        setStream(currentStream);
      }).catch(err => console.error("Failed to get media", err));
    }
  }, [isActiveCall, isReceivingCall, stream]);

  // Attach local stream when it's available and the video element is mounted
  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream, callAccepted, isReceivingCall, isActiveCall]);

  // Handle outgoing call initiation
  useEffect(() => {
    if (isActiveCall && !isReceivingCall && !callAccepted && stream && targetUserId) {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      connectionRef.current = peer;

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", { candidate: event.candidate, to: targetUserId });
        }
      };

      peer.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      peer.createOffer().then((offer) => {
        return peer.setLocalDescription(offer);
      }).then(() => {
        socket.emit("callUser", {
          userToCall: targetUserId,
          signalData: peer.localDescription,
          from: authUser._id,
          callerName: authUser.fullName,
          callerProfilePhoto: authUser.profilePhoto
        });
      });

      const handleCallAccepted = (signal) => {
        dispatch(acceptCallAction());
        peer.setRemoteDescription(new RTCSessionDescription(signal)).then(() => {
          // Flush ICE queue
          while(iceCandidatesQueue.current.length > 0) {
            const candidate = iceCandidatesQueue.current.shift();
            peer.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error(e));
          }
        });
      };

      socket.on("callAccepted", handleCallAccepted);

      return () => {
        socket.off("callAccepted", handleCallAccepted);
      };
    }
  }, [isActiveCall, isReceivingCall, callAccepted, stream, targetUserId, socket, authUser, dispatch]);

  const answerCall = () => {
    dispatch(acceptCallAction());

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    connectionRef.current = peer;

    if(stream){
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", { candidate: event.candidate, to: callerInfo.from });
      }
    };

    peer.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peer.setRemoteDescription(new RTCSessionDescription(callerSignal)).then(() => {
      // Flush ICE queue
      while(iceCandidatesQueue.current.length > 0) {
        const candidate = iceCandidatesQueue.current.shift();
        peer.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error(e));
      }
      return peer.createAnswer();
    }).then((answer) => {
      return peer.setLocalDescription(answer);
    }).then(() => {
      socket.emit("answerCall", { signal: peer.localDescription, to: callerInfo.from });
    });
  };

  const leaveCall = () => {
    dispatch(endCallAction());
    if (connectionRef.current) {
      connectionRef.current.close();
    }
    socket.emit("endCall", { to: targetUserId || callerInfo?.from });
    if(stream){
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setRemoteStream(null);
    iceCandidatesQueue.current = [];
  };

  const rejectCall = () => {
    dispatch(endCallAction());
    socket.emit("rejectCall", { to: callerInfo.from });
    if(stream){
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setRemoteStream(null);
    iceCandidatesQueue.current = [];
  };

  const toggleMic = () => {
    if(stream){
      stream.getAudioTracks()[0].enabled = !micOn;
      setMicOn(!micOn);
    }
  };

  const toggleVideo = () => {
    if(stream){
      stream.getVideoTracks()[0].enabled = !videoOn;
      setVideoOn(!videoOn);
    }
  };

  if (!isActiveCall && !isReceivingCall) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl relative">
        <div className="absolute top-4 w-full flex justify-center z-10 pointer-events-none">
          <p className="text-white text-lg font-semibold bg-black/50 px-4 py-1 rounded-full">
            {isReceivingCall && !callAccepted ? `Incoming call from ${callerInfo?.name}...` : 'Video Call'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 h-[60vh] sm:h-[70vh]">
          <div className="relative bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center border-2 border-zinc-700">
            {stream ? (
              <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover transform scale-x-[-1]" />
            ) : (
              <div className="text-zinc-500 animate-pulse">Starting camera...</div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded-md text-white text-xs">You</div>
          </div>

          <div className="relative bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center border-2 border-zinc-700">
            {callAccepted ? (
              <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
            ) : (
              <div className="text-zinc-500 text-center">
                {isReceivingCall ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={callerInfo?.profilePhoto} className="w-20 h-20 rounded-full border-4 border-purple-500" alt="caller" />
                    <p className="text-lg text-white">{callerInfo?.name}</p>
                    <p className="text-sm">is calling you</p>
                  </div>
                ) : (
                  <div className="animate-pulse">Calling...</div>
                )}
              </div>
            )}
            {callAccepted && <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded-md text-white text-xs">Remote User</div>}
          </div>
        </div>

        <div className="bg-zinc-950 p-4 flex justify-center items-center gap-6">
          {isReceivingCall && !callAccepted ? (
            <>
              <button onClick={answerCall} className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full transition-transform hover:scale-110 flex items-center gap-2">
                <MdCall size={24} /> <span>Accept</span>
              </button>
              <button onClick={rejectCall} className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-transform hover:scale-110 flex items-center gap-2">
                <MdCallEnd size={24} /> <span>Reject</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={toggleMic} className={`p-4 rounded-full transition-colors ${micOn ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-red-500 hover:bg-red-600'} text-white`}>
                {micOn ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} />}
              </button>
              <button onClick={toggleVideo} className={`p-4 rounded-full transition-colors ${videoOn ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-red-500 hover:bg-red-600'} text-white`}>
                {videoOn ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
              </button>
              <button onClick={leaveCall} className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-transform hover:scale-110 ml-4">
                <MdCallEnd size={32} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
