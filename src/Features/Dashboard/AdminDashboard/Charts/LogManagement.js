import React from "react";
import "./LogManagement.css";

const LogManagement = () => {
  return (
    <div className="log-management-container">
      <div className="log-header">
        <h2>Log Management</h2>
      </div>

      <div className="log-grid">
        <div className="log-card">
          <h4>Activity Log</h4>
          <p className="log-count">1,245 entries</p>
          <span className="log-desc">Tracks all user actions on the platform</span>
        </div>

        <div className="log-card">
          <h4>Feedback Log</h4>
          <p className="log-count">320 entries</p>
          <span className="log-desc">Contains user feedback and ratings</span>
        </div>

        <div className="log-card">
          <h4>Action Log (Admin)</h4>
          <p className="log-count">85 entries</p>
          <span className="log-desc">Tracks admin actions like edits or deletions</span>
        </div>

        <div className="log-card error">
          <h4>Error Log</h4>
          <p className="log-count">42 entries</p>
          <span className="log-desc">System or API errors detected</span>
        </div>
      </div>
    </div>
  );
};

export default LogManagement;
