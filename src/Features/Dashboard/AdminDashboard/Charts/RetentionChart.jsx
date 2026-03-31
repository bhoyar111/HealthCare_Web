import React, { useEffect, useState } from "react";
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

import "./RetentionChart.css";
import Service from "../../AdminDashboard/Service";

const RetentionChart = () => {
  const [retentionData, setRetentionData] = useState([]);

  useEffect(() => {
    const fetchRetention = async () => {
      try {
         const response = await Service.monthlyRetentionRate();
        const { retentionRate } = response.data;

        // Transform API data into chart format
        const month = new Date().toLocaleString("default", { month: "short" });
        setRetentionData([
          {
            month,
            avgRetention: parseFloat(retentionRate),
            newUserRetention: parseFloat(retentionRate),
          },
        ]);
      } catch (error) {
        console.error("Error fetching retention rate:", error);
      }
    };

    fetchRetention();
  }, []);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Monthly Retention Rate</h3>
      <p className="chart-subtitle">% of users retained in subsequent months</p>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={retentionData}
            margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis unit="%" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="avgRetention"
              stroke="#003b49"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Average Monthly Retention"
            />
            <Line
              type="monotone"
              dataKey="newUserRetention"
              stroke="#ff7300"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="New User Retention"
            />
            <Legend verticalAlign="bottom" align="center" height={36} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RetentionChart;
