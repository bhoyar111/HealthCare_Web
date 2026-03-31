import React, { useRef, useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useSelector } from "react-redux";

import "./Communication.css";
import Service from "../Service/Services";

export default function ChatScreen({ onClick, callId }) {
  const userId = useSelector(
    (state) => state.auth.user.userData?._id
  );
   const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Hardcoded patient for testing (you can replace with actual)
  const receiverId = "688073c771e6a8e8dc79c7cf";

   const fetchMessages = async () => {
      try {
        const res = await Service.getByCallId(callId);
        if (res.status === 200) {
          setMessages(res.data.data);
        }
      } catch (err) {
        // console.error("Error fetching messages:", err);
      }
    };
   useEffect(() => {
    if (!callId) return;
    fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    try {
      if (!input.trim()) return;
      const res = await Service.chatVideoCallHistory({
        callId,
        senderId: userId,
        receiverId,
        message: input,
        type: "text"
      });
      if (res.data?.data) {
          setMessages((prev) => [...prev, res.data.data]); // append new message
        }
      setInput("");
      fetchMessages();
    } catch (err) {
      // console.error("Error sending message:", err);
    }
  };

  return (
    <div className="chat-overlay">
      <div className="chat-popup">
        {/* Header */}
        <div className="chat-header">
          <h3>Chat</h3>
          <button className="close-btn" onClick={onClick}>
            <FiX />
          </button>
        </div>

        {/* Messages */}
        <div className="messages">
          {messages?.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.senderId?._id === userId ? "outgoing" : "incoming"
              }`}
            >
              <p>{msg.message}</p>
              <span className="time">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
           <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="input-bar">
          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}
