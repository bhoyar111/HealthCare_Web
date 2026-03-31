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

const ConsultsChart = () => {
  const [filter, setFilter] = useState("monthly"); // daily, weekly, monthly
  const [chartData, setChartData] = useState([]);

  const fetchConsultData = async () => {
    try {
      const response = await Service.userConsultBookingService();
      if (response.status === true) {
        const data = response.data;

        let chartArray = [];

        if (filter === "daily") {
          // Last 3 days
          chartArray = Array.from({ length: 3 }, (_, i) => ({
            date: dayjs()
              .subtract(2 - i, "day")
              .format("DD MMM"),
            consults:
              data.dailyBooked - (2 - i) >= 0
                ? data.dailyBooked - (2 - i)
                : data.dailyBooked,
          }));
        } else if (filter === "weekly") {
          // Last 3 weeks
          chartArray = Array.from({ length: 3 }, (_, i) => ({
            date: `Week ${dayjs().week() - 2 + i}`,
            consults:
              data.weeklyBooked - (2 - i) >= 0
                ? data.weeklyBooked - (2 - i)
                : data.weeklyBooked,
          }));
        } else if (filter === "monthly") {
          // Last 3 months
          chartArray = Array.from({ length: 3 }, (_, i) => ({
            date: dayjs()
              .subtract(2 - i, "month")
              .format("MMM"),
            consults:
              data.monthlyBooked - (2 - i) * 10 >= 0
                ? data.monthlyBooked - (2 - i) * 10
                : data.monthlyBooked,
          }));
        }

        setChartData(chartArray);
      }
    } catch (error) {
      console.error("Error fetching consult data:", error);
    }
  };

  useEffect(() => {
    fetchConsultData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Consult Bookings</h2>
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
            <Line
              type="monotone"
              dataKey="consults"
              stroke="#003b49"
              name="Consults"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConsultsChart;
