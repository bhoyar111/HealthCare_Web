import React, { useEffect, useState, useRef } from "react";

import { useSelector } from "react-redux";

import Service from "../Service/Services";

import "./ChatHistory.css";

export default function ChatHistory() {
  const userId = useSelector((state) => state.auth.user.userData?._id);

  const [userList, setUserList] = useState([]);
  const [threadList, setThreadList] = useState({});

  const [messages, setMessages] = useState([]);

  const [activeUser, setActiveUser] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [showThreadsFor, setShowThreadsFor] = useState(null);

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);

  // ==================== FETCH USERS LIST ====================
  const fetchUserList = async () => {
    try {
      const res = await Service.fetchAllChatHistory(userId);

      if (res.status === 200 && res.data) {
        setUserList(res.data);
      }
    } catch (err) {
      console.error("Error fetching user list:", err);
    }
  };

  // ==================== FETCH THREADS FOR SELECTED USER ====================
  const fetchThreadList = async (selectedUserId) => {
    try {
      const data = { senderId: selectedUserId, receiverId: userId };

      const res = await Service.fetchThreadsList(data);
      if (res.status === 200 && res.data) {
        setThreadList((prev) => ({
          ...prev,

          [selectedUserId]: res.data,
        }));
      }
    } catch (err) {
      console.error("Error fetching thread list:", err);
    }
  };

  // ==================== FETCH MESSAGES FOR THREAD ====================
  const fetchMessages = async (threadId) => {
    try {
      const res = await Service.fetchChatHistoryById(threadId);
      if (res.status === 200 && res.data) {
        setMessages(Array.isArray(res.data) ? res.data : res.data || []);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([]);
    }
  };

  // ==================== SEND MESSAGE ====================
  const handleSend = async () => {
    if (!input.trim() || !activeThread) return;

    try {
      const receiverId =
        activeThread.sender._id === userId
          ? activeThread.receiver._id
          : activeThread.sender._id;

      const payload = {
        threadId: activeThread._id,
        senderId: userId,
        receiverId,
        message: input,
      };
      const res = await Service.sendMessageChat(payload);
      if (res.status === 200 && res.data) {
        setMessages((prev) => [...prev, res.data]);
        fetchThreadList(receiverId);
      }

      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // ==================== SCROLL TO LATEST MESSAGE ====================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (userId) fetchUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ==================== FILTER USERS ====================
  const filteredUsers = userList.filter((user) =>
    user?.sender?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  // ==================== Helper ====================
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);

  // ==================== UI ====================
  return (
    <div className="chat-container">
      {/* LEFT SIDEBAR – USER LIST WITH THREADS */}
      <div className="chat-list">
        <div className="chat-list-header">
          <input
            type="text"
            placeholder="Search user"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chat-list-body">
          {filteredUsers.length === 0 ? (
            <div className="no-chat">No users found</div>
          ) : (
            filteredUsers.map((user) => {
              const isExpanded = showThreadsFor === user.sender._id;

              const userThreads = threadList[user.sender._id] || [];

              return (
                <div key={user._id} className="user-section">
                  {/* User Header */}

                  <div
                    className={`chat-list-item ${isExpanded ? "active" : ""}`}
                    onClick={() => {
                      if (isExpanded) {
                        setShowThreadsFor(null); // hide if already open
                      } else {
                        setShowThreadsFor(user.sender._id);

                        setActiveUser(user);

                        fetchThreadList(user.sender._id);
                      }
                    }}
                  >
                    {user?.profile_pic ? (
                      <img
                        src={user.profile_pic}
                        alt="avatar"
                        className="avatar"
                      />
                    ) : (
                      <div className="avatar initials">
                        {getInitials(user.sender.fullName)}
                      </div>
                    )}

                    <div className="chat-info">
                      <div className="chat-name">{user.sender.fullName}</div>
                    </div>
                  </div>

                  {/* Thread List Below User */}

                  {isExpanded && (
                    <div className="thread-sublist">
                      {userThreads.length === 0 ? (
                        <div className="no-thread">No threads found</div>
                      ) : (
                        userThreads.map((thread) => (
                          <div
                            key={thread._id}
                            className={`thread-item ${
                              activeThread?._id === thread._id ? "active" : ""
                            }`}
                            onClick={() => {
                              setActiveThread(thread);

                              fetchMessages(thread._id);
                            }}
                          >
                            <div className="thread-name">
                              {thread.threadName || "Untitled Thread"}
                            </div>

                            <div className="thread-time">
                              {new Date(thread.updatedAt).toLocaleDateString(
                                [],
                                {
                                  day: "2-digit",

                                  month: "short",
                                }
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL – CHAT WINDOW */}

      <div className="chat-window">
        {activeThread ? (
          <>
            <div className="chat-header">
              {activeUser?.sender?.fullName} / {activeThread.threadName}
            </div>

            <div className="chat-messages">
              {messages.map((msg, i) => {
                const msgDate = new Date(msg.createdAt);

                const prevDate =
                  i > 0 ? new Date(messages[i - 1].createdAt) : null;

                const isNewDay =
                  !prevDate ||
                  msgDate.toDateString() !== prevDate.toDateString();

                const showDate =
                  isNewDay &&
                  (msgDate.toDateString() === new Date().toDateString()
                    ? "Today"
                    : msgDate.toLocaleDateString([], {
                        day: "2-digit",

                        month: "long",

                        year: "numeric",
                      }));

                return (
                  <React.Fragment key={msg._id}>
                    {isNewDay && (
                      <div className="date-separator">{showDate}</div>
                    )}

                    <div
                      className={`message-box ${
                        (msg.senderId?._id || msg.senderId) === userId
                          ? "outgoing"
                          : "incoming"
                      }`}
                    >
                      <div className="message-text">{msg.message}</div>

                      <div className="message-time">
                        {msgDate.toLocaleTimeString([], {
                          hour: "2-digit",

                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <button onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat">Select a thread to view messages</div>
        )}
      </div>
    </div>
  );
}
