import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
// import { socketUrl } from "../../../Config/Environment";

import OT from "@opentok/client";
// import io from "socket.io-client";
import "./Communication.css";

import Service from "../Service/Services";
import CallPopup from "./CallPopup";
import ChatScreen from "./ChatScreen";
import NoteComponent from "./NoteComponent";
const socket = "";

// const socket = io(`${socketUrl}`, {
//   withCredentials: true,
//   transports: ["websocket", "polling"]
// });

const Communication = forwardRef((props, ref) => {
  const publisherContainerRef = useRef(null);
  const subscriberContainerRef = useRef(null);
  const publisherInstanceRef = useRef(null);
  const sessionRef = useRef(null);

  const userProviderId = useSelector(
    (state) => state.auth.user.userData?._id
  );

   useImperativeHandle(ref, () => ({
    startCall,
    endCall,
    getStatus: () => callStatus
  }));

  // Call states
  const [callStatus, setCallStatus] = useState("idle"); // idle | calling | in-call
  const [outgoingCall, setOutgoingCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [callHistoryId, setCallHistoryId] = useState(null);

  // Temp hardcoded IDs for testing
  const userPatientId = "68625279caf0f21945049413";

  // Register provider on socket
  useEffect(() => {
    if (!userProviderId) return;
    socket.emit("register", userProviderId);
  }, [userProviderId]);

  // Handle socket events
  useEffect(() => {
    // Incoming call
    socket.on("incoming-call", ({ providerId, sessionData }) => {
      setIncomingCall({ from: providerId, sessionData });
      setCurrentSessionId(incomingCall.sessionData.sessionId);
    });

    // Call accepted
    socket.on("call-accepted", ({ sessionData }) => {
      // console.log(sessionData, "jjj");
      setCallStatus("in-call");
      setOutgoingCall(false);
      initVideoCall(sessionData);
    });

    // Call declined
    socket.on("call-declined", () => {   // { by }
      // console.log("Call declined by", by);
      setCallStatus("idle");
      setOutgoingCall(false);
    });

    // Call cancelled
    socket.on("call-cancelled", () => {
      // console.log("Call cancelled by", by);
      endCall();
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-declined");
      socket.off("call-cancelled");
    };
  }, []);

  // ---------- Start Call (Provider side) ----------
  const startCall = async () => {
    try {
      setCallStatus("calling");
      setOutgoingCall(true);

      // Get session & token
      const { data: sessionResponse } = await Service.getVideoSession();
      const { sessionId, applicationId } = sessionResponse;

      // Generate a Token from just a sessionId
      const { data: tokenResponse } = await Service.getUserToken({
        sessionId,
        userId: userProviderId
      });
      const token = tokenResponse.token;
      setCurrentSessionId(sessionId);

      // Save Call History (start)
      const callHistory = await Service.manageVideoCallHistory({
        sessionId,
        providerId: userProviderId,
        patientId: userPatientId,
        action: "start"
      });
      setCallHistoryId(callHistory?.data?._id);

      // Only send to patient, don’t start OpenTok yet
      socket.emit("call-user", {
        providerId: userProviderId,
        patientId: userPatientId,
        sessionData: { applicationId, sessionId, token }
      });
    } catch (err) {
      // console.error("Error starting call:", err);
      setCallStatus("idle");
      setOutgoingCall(false);
    }
  };

  // ---------- Accept/Decline (Patient side) ----------
  const acceptCall = () => {
    if (incomingCall) {
      socket.emit("accept-call", {
        patientId: userPatientId,
        providerId: incomingCall.from,
        sessionData: incomingCall.sessionData
      });
      setCallStatus("in-call");
      initVideoCall(incomingCall.sessionData);
      setIncomingCall(null);
    }
  };

  const declineCall = () => {
    if (incomingCall) {
      socket.emit("decline-call", {
        patientId: userPatientId,
        providerId: incomingCall.from
      });
      setIncomingCall(null);
      setCallStatus("idle");
    }
  };

  // ---------- OpenTok Init ----------
  const initVideoCall = ({ applicationId, sessionId, token }) => {
    const session = OT.initSession(applicationId, sessionId);
    sessionRef.current = session;

    session.on("streamCreated", (event) => {
      session.subscribe(event.stream, subscriberContainerRef.current, {
        insertMode: "append",
        width: "100%",
        height: "100%"
      });
    });

    const publisher = OT.initPublisher(publisherContainerRef.current, {
      insertMode: "append",
      width: "100%",
      height: "100%"
    });
    publisherInstanceRef.current = publisher;

    session.connect(token, (err) => {
      if (!err) {
        session.publish(publisher);
        setCallStatus("in-call");
      }
    });

    session.on("sessionDisconnected", () => {
      setCallStatus("idle");
    });
  };

  // ---------- Toggle Video ----------
  const toggleVideo = () => {
    if (publisherInstanceRef.current) {
      publisherInstanceRef.current.publishVideo(!isVideoOn);
      setIsVideoOn(!isVideoOn);
    }
  };

  // ---------- Toggle Video ----------
  const toggleMute = () => {
     if (publisherInstanceRef.current) {
    const newMuteState = !isMuted;
    publisherInstanceRef.current.publishAudio(!newMuteState); // false = mute, true = unmute
    setIsMuted(newMuteState);
  }

  };

  // ---------- End Call ----------
  const endCall = async () => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }
    if (publisherInstanceRef.current) {
      publisherInstanceRef.current.destroy();
      publisherInstanceRef.current = null;
    }

    // Save Call History (end)
    if (currentSessionId) {
      await Service.manageVideoCallHistory({
        sessionId: currentSessionId, // use current sessionId
        providerId: userProviderId,
        patientId: userPatientId,
        action: "end"
      });
    }

    // Notify patient that provider ended the call
    socket.emit("end-call", {
      providerId: userProviderId,
      patientId: userPatientId
    });

    setCallStatus("idle");
    setOutgoingCall(false);
    setIncomingCall(null);
    setShowNotePopup(true);
  };

  return (
    <div className="communication-container">
      {/* ---------- Header ---------- */}
      <div className="communication-header">
        <div className="call-timer">Video calling</div>
        <div className="header-actions">
          {/* ---------- In call Video Area ---------- */}
          {callStatus === "in-call" && (
            <div>
              <button onClick={() => setShowChat(true)} className="header-btn">Chat</button>
              <button className="header-btn">More</button>
              <button onClick={toggleVideo} className="header-btn">{isVideoOn ? <FaVideo /> : <FaVideoSlash />}</button>
              <button className="leave-btn" onClick={endCall}>Leave</button>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Main Video Area ---------- */}
      <div className="call-area">
        <div className="video-wrapper">
          <div ref={subscriberContainerRef} className="subscriber-container"></div>
          <div ref={publisherContainerRef} className="publisher-container"></div>
        </div>
      </div>

      {/* ---------- Bottom Control Bar ---------- */}
      {callStatus === "in-call" && (
        <div className="control-bar">
          <button onClick={toggleMute} className="control-btn">
            {isMuted ? <i className="fas fa-microphone-slash"></i> : <i className="fas fa-microphone"></i>}
          </button>
          <button onClick={toggleVideo} className="control-btn">{isVideoOn ? <FaVideo /> : <FaVideoSlash />}</button>
          <button onClick={() => setShowChat(true)} className="control-btn"><i className="fas fa-comment"></i></button>
          <button className="control-btn end-call" onClick={endCall}><i className="fas fa-phone-slash"></i></button>
        </div>
      )}

      {/* ---------- Outgoing Call Popup ---------- */}
        {outgoingCall && (
          <CallPopup
            caller={{ name: "Calling Patient...", profile_pic: "/patient.jpg" }}
            isOutgoing={true}
            onDecline={endCall}
          />
        )}

        {/* ---------- Incoming Call Popup ---------- */}
        {incomingCall && (
          <CallPopup
            caller={{ name: "Doctor is calling...", profile_pic: "/doctor.jpg" }}
            isOutgoing={false}
            onAccept={acceptCall}
            onDecline={declineCall}
          />
        )}

        {/* ---------- Chat Screen Popup ---------- */}
        {showChat && (
          <div className="chat-overlay">
            <div className="chat-popup">
              <ChatScreen
                onClick={() => setShowChat(false)}
                callId={callHistoryId}
              />
            </div>
          </div>
        )}

        {/* ---------- Note Screen Popup ---------- */}
        {showNotePopup && (
          <NoteComponent
            onClose={() => setShowNotePopup(false)}
            callId={callHistoryId}
          />
        )}

    </div>
  );
});

Communication.displayName = "Communication";
export default Communication;

