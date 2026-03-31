import React, { useEffect, useState } from "react";

import "./AdminDashboard.css";
import Service from "./Service";
import TractionDashboard from "./Traction/Traction";
import ContentDashboard from "./Content/Content";
import ConsultDashboard from "./Consult/Consult";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Traction");

  const tabs = ["Traction", "Content", "Consult"];

  const [usersData, setUsersData] = useState(null);

  const [loading, setLoading] = useState(true);

  const getDashboardCount = async () => {
    try {
      const res = await Service.userCountViews();
      if (res.status === 200) {
        setUsersData(res?.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardCount();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* ==================== Tabs ==================== */}
      <div className="dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} Dashboard
          </button>
        ))}
      </div>

      {/* ==================== Tab Content ==================== */}
      <div className="tab-content">
        {activeTab === "Traction" && (
          <TractionDashboard usersData={usersData} />
        )}

        {activeTab === "Content" && <ContentDashboard />}

        {activeTab === "Consult" && <ConsultDashboard />}
      </div>
    </div>
  );
};

export default AdminDashboard;
