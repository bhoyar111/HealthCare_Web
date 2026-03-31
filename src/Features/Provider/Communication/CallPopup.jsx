import React from "react";
import { FaPhoneAlt, FaPhoneSlash } from "react-icons/fa";
import VideoProfile from "../../Common/Assests/profile.png";

import "./Communication.css";

export default function CallPopup({ caller, onAccept, onDecline, isOutgoing }) {
  if (!caller) return null;

  return (
     <div className="call-popup-overlay">
      <div className="call-popup">
        <img className="caller-img" src={VideoProfile} alt="user" />
        <h3>{caller.name}</h3>
        {isOutgoing ? (
         <>
           <p>📞 Ringing...</p>
          <div className="call-actions">
            <button className="decline" onClick={onDecline}>
              <FaPhoneSlash /> End
            </button>
          </div>
         </>
        ) : (
          <div className="call-actions">
            <button className="accept" onClick={onAccept}>
              <FaPhoneAlt /> Accept
            </button>
            <button className="decline" onClick={onDecline}>
              <FaPhoneSlash /> Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
