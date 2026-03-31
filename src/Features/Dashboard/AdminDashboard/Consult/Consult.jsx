import React, { useEffect, useState } from "react";

import "./Consult.css";
import Service from "../Service";
import SubscriptionStatus from "../Charts/SubscriptionStatus";
import ConsultsChart from "../Charts/ConsultsChart";
import ConsultBarChart from "../Charts/ConsultBarChart";

const Consult = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [repeatData, setRepeatData] = useState(null);
  const [subscriptionUserCount, setSubscriptionUserCount] = useState(0);

  const getDashboardCount = async () => {
    try {
      const res = await Service.adminAppointmentDetailService();
      if (res.status === 200) {
        setDashboardData(res?.data);
      }
    } catch (err) {
      console.error("Error fetching provider dashboard details:", err);
    }
  };

  const getRepeatConsultCount = async () => {
    try {
      const res = await Service.firstRepeatConsultDetailService();
      if (res.status === 200) {
        setRepeatData(res?.data);
      }
    } catch (err) {
      console.error("Error fetching provider dashboard details:", err);
    }
  };

  const allUserPaymentList = async () => {
    try {
      const response = await Service.patientSubcriptionHistory();
      console.log(response, "ooo")
      if (response?.status === 200) {
        // If API returns total subscribed users
        setSubscriptionUserCount(response?.data?.totalRecords || 0);
      }
    } catch (err) {
      console.log(err, "Subscription Count");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getDashboardCount(), getRepeatConsultCount()]);
    };
    fetchData();
    allUserPaymentList();
  }, []);

  const { totalAppointments = 0, appointmentStatus = {} } = dashboardData || {};
  const { summary = {}, monthly = [] } = repeatData || {};
  const { totalFirstTimeConsult = 0, totalRepeatConsult = 0 } = summary || {};

  return (
    <>
      <div className="dashboard-count">
        <div className="cards-grid">
          {/* Appointment Card */}
          <div className="card stat-card">
            <div className="dasdhboard-icon">📅</div>
            <div className="card-content">
              <p className="dash-title">Appointments</p>
              <h3 className="dash-sub-title">
                Total appointments: {totalAppointments}
              </h3>
              <h3 className="dash-sub-title">
                Missed appointments: {appointmentStatus.MISSED}
              </h3>
              <h3 className="dash-sub-title">
                Cancelled appointments: {appointmentStatus.CANCELLED}
              </h3>
              <h3 className="dash-sub-title">
                Completed appointments: {appointmentStatus.COMPLETED}
              </h3>
            </div>
          </div>
          {/* The prep tool Card */}
          <div className="card stat-card">
            <div className="dasdhboard-icon">🗣️</div>
            <div className="card-content">
              <p className="dash-title">No. of Consult</p>
              <h3 className="dash-sub-title">
                First Time Consult: {totalFirstTimeConsult}
              </h3>
              <h3 className="dash-sub-title">
                Repeat Consult: {totalRepeatConsult}
              </h3>
            </div>
          </div>
          {/* The Subscription Card */}
          <div className="card stat-card">
            <div className="dasdhboard-icon">📋</div>
            <div className="card-content">
              <p className="dash-title">No. of user Subscription</p>
              <h2 className="dash-sub-title2">
                {subscriptionUserCount}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="analystic mb-4">
        <ConsultsChart />
      </div>
      <div className="barchart mb-4">
        <ConsultBarChart monthly={monthly} />
      </div>
      <div className="subscr mb-4">
        <SubscriptionStatus />
      </div>
    </>
  );
};

export default Consult;
