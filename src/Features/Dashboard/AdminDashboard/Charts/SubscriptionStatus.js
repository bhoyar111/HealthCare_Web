import React from "react";
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

import "./SubscriptionStatus.css";

const SubscriptionStatus = () => {
  // 🔹 Static Monthly Data (replace with API later)
  const monthlyData = [
    { month: "Jan", Active: 320, Trial: 80, Canceled: 40 },
    { month: "Feb", Active: 340, Trial: 100, Canceled: 35 },
    { month: "Mar", Active: 360, Trial: 90, Canceled: 50 },
    { month: "Apr", Active: 380, Trial: 85, Canceled: 45 },
    { month: "May", Active: 400, Trial: 95, Canceled: 55 },
    { month: "Jun", Active: 420, Trial: 100, Canceled: 60 },
  ];

  const COLORS = ["#003b49", "#ff7300", "#d9534f"];

  return (
    <div className="subscription-chart-container">
      <div className="subscription-header">
        <h2>Monthly Subscription Status</h2>
      </div>

      <div className="subscription-chart-content">
        {/* 🔹 Line Chart */}
        <div className="chart-area">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={monthlyData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Active"
                stroke={COLORS[0]}
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Active Membership"
              />
              <Line
                type="monotone"
                dataKey="Trial"
                stroke={COLORS[1]}
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Trial Membership"
              />
              <Line
                type="monotone"
                dataKey="Canceled"
                stroke={COLORS[2]}
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Canceled"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🔹 Legend section (right side) */}
        <div className="chart-legend">
          <h4>Status Breakdown</h4>
          <ul>
            {["Active Membership", "Trial Membership", "Canceled"].map(
              (name, index) => (
                <li key={name}>
                  <span
                    className="legend-color"
                    style={{ backgroundColor: COLORS[index] }}
                  ></span>
                  <span className="legend-label">{name}</span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
