import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import "./Communication.css";
import Service from "../Service/Services";
import showToast from "../../Common/Shared/Utils/ToastNotification";

export default function NoteComponent({ onClose, callId }) {
  const navigate = useNavigate();
  const [note, setNote] = useState("");

  const handleSave = async () => {
    try {
      const response = await Service.videoCallNoteHistory({
        callId,
        notes: note
      });
      showToast("success", response?.message || "Note saved successfully!");
      onClose();
      navigate("/appointment");
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Something went wrong"
      );
    }
    onClose();
  };

  const handleClose = async () => {
    navigate("/appointment");
  };

  return (
    <div className="note-overlay">
      <div className="note-popup">
        <h3>Call Notes</h3>
        <textarea
          placeholder="Write your notes here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="note-actions">
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
          <button onClick={handleClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
