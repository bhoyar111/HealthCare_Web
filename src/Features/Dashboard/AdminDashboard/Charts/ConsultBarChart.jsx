import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./ConsultBarChart.css";

const ConsultBarChart = ({ monthly = [] }) => {
  // Format API response to chart-friendly structure
  const chartData = monthly.map((item) => ({
    month: item?.month || "",
    firstTime: item?.firstTimeBookings ?? 0,
    repeat: item?.repeatBookings ?? 0,
  }));

  const COLORS = ["#003b49", "#ff7300"];

  return (
    <div className="consult-chart-container">
      <div className="consult-header">
        <h2>First-time vs Repeat Consults</h2>
      </div>

      <div className="consult-chart-content">
        {/* 🔹 Bar Chart (Stacked) */}
        <div className="chart-area">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="firstTime"
                name="First-time Consults"
                stackId="a"
                fill={COLORS[0]}
                barSize={50}
              />
              <Bar
                dataKey="repeat"
                name="Repeat Consults"
                stackId="a"
                fill={COLORS[1]}
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🔹 Legend */}
        <div className="chart-legend">
          <h4>Status Breakdown</h4>
          <ul>
            <li>
              <span
                className="legend-color"
                style={{ backgroundColor: COLORS[0] }}
              ></span>
              <span className="legend-label">First-time Consults</span>
            </li>
            <li>
              <span
                className="legend-color"
                style={{ backgroundColor: COLORS[1] }}
              ></span>
              <span className="legend-label">Repeat Consults</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConsultBarChart;
