import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnalyticsDashboard from "../Charts/AnalyticsDashboard";
import RetentionChart from "../Charts/RetentionChart";
import BookingRateChart from "../Charts/BookingRateChart";
import "./Traction.css";
import Service from "../Service";

const Traction = (props) => {

  const { providerCount, patientCount } = props.usersData;

   const [prepareTool, setPrepareTool] = useState(null);
    
    // Fetch API Data
    useEffect(() => {
      fetchPrepareToolCount();
    }, []);
  
    const fetchPrepareToolCount = async () => {
      try {
        const res = await Service.mostSaveQuesService();
        if (res?.status === 200) {
          setPrepareTool(res?.data);
        }
      } catch (err) {
        console.error("Error fetching most searched terms:", err);
      }
    };

  const navigate = useNavigate();

  const providerClick = () => {
    navigate("/providers");
  };

  const patientClick = () => {
    navigate("/patients");
  };

  const { totalUsers = 0 } = prepareTool || {}

  return (
    <>
      <div className="dashboard-count">
        <h2>Welcome back!</h2>
        <div className="cards-grid">
          {/* Provider card */}
          <div
            className="card stat-card"
            onClick={providerClick}
            style={{ cursor: "pointer" }}
          >
            <div className="dasdhboard-icon">👨‍⚕️</div>
            <div className="card-content">
              <p className="dash-title">Providers</p>
              <h2>{providerCount}</h2>
            </div>
          </div>
          {/* patients card */}
          <div
            className="card stat-card"
            onClick={patientClick}
            style={{ cursor: "pointer" }}
          >
            <div className="dasdhboard-icon">🧑‍⚕️</div>
            <div className="card-content">
              <p className="dash-title">Patients</p>
              <h2>{patientCount}</h2>
            </div>
          </div>
          {/* The prep tool Card */}
          <div className="card stat-card">
            <div className="dasdhboard-icon">🧑‍🤝‍🧑</div>
            <div className="card-content">
              <p className="dash-title">No. of users who used the prep tool</p>
              <h3>{totalUsers}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="retention mb-4">
        <AnalyticsDashboard />
      </div>
      <div className="retention mb-4">
        <RetentionChart />
      </div>
      <div className="retention mb-4">
        <BookingRateChart />
      </div>
    </>
  );
};

export default Traction;
