import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./AnalyticsDashboard.css";
import Service from "../../AdminDashboard/Service";

const AnalyticsDashboard = () => {
  const [filter, setFilter] = useState("monthly"); // daily | weekly | monthly
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await Service.userAnalyticsViews();
        const data = res.data;
        let processedData = [];

        if (filter === "daily") {
          // Show daily active users for last 7 days
          for (let i = 6; i >= 0; i--) {
            const day = dayjs().subtract(i, "day");
            processedData.push({
              date: day.format("DD MMM"),
              signups: data.newRegistrations.find(
                u => dayjs(u._id).format("DD MMM") === day.format("DD MMM")
              )?.count || 0,
              activeUsers: data.dailyActive, // you can also make it per day if needed
            });
          }
        } else if (filter === "weekly") {
          // Show weekly active users for last 4 weeks
          for (let i = 3; i >= 0; i--) {
            const startOfWeek = dayjs().subtract(i, "week").startOf("week");
            const endOfWeek = dayjs().subtract(i, "week").endOf("week");

            const weekSignups = data.newRegistrations.reduce((sum, user) => {
              const created = dayjs(user._id);
              if (created.isAfter(startOfWeek) && created.isBefore(endOfWeek)) {
                return sum + user.count;
              }
              return sum;
            }, 0);

            processedData.push({
              date: `Week ${4 - i}`,
              signups: weekSignups,
              activeUsers: data.weeklyActive,
            });
          }
        } else if (filter === "monthly") {
          // Show monthly active users for last 3 months
          const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          for (let i = 2; i >= 0; i--) {
            const month = dayjs().subtract(i, "month").month() + 1; // _id in aggregation
            const monthSignups = data.newRegistrations.find(u => u._id === month)?.count || 0;

            processedData.push({
              date: monthNames[month - 1],
              signups: monthSignups,
              activeUsers: data.monthlyActive,
            });
          }
        }

        setChartData(processedData);

      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    fetchAnalytics();
  }, [filter]);

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>User Analytics</h2>
        <div className="filter-buttons">
          <button
            className={filter === "daily" ? "active" : ""}
            onClick={() => setFilter("daily")}
          >
            Daily
          </button>
          <button
            className={filter === "weekly" ? "active" : ""}
            onClick={() => setFilter("weekly")}
          >
            Weekly
          </button>
          <button
            className={filter === "monthly" ? "active" : ""}
            onClick={() => setFilter("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="signups" stroke="#003b49" name="Signups" />
            <Line type="monotone" dataKey="activeUsers" stroke="#ff7300" name="Active Users" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
