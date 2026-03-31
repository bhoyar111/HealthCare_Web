import React, { useEffect, useState } from "react";
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

import "./BookingRateChart.css";
import Service from "../../AdminDashboard/Service";

const BookingRateChart = () => {
  const [bookingRateData, setBookingRateData] = useState([]);

  useEffect(() => {
    const fetchBookingRate = async () => {
      try {
        // Call new backend API
        const response = await Service.userBookingConsultRate();
        const data = response.data;

        // Transform API data for chart
        setBookingRateData(
          data.map((item) => ({
            month: item.month,
            totalUsers: item.totalUsers,
            booked: item.booked,
            bookingRate: parseFloat(item.bookingRate), // Convert string to number
          }))
        );
      } catch (error) {
        console.error("Error fetching booking rate:", error);
      }
    };

    fetchBookingRate();
  }, []);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Consult Booking Rate</h3>
      <p className="chart-subtitle">
        Percentage of users who booked at least one consult each month
      </p>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bookingRateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis unit="%" />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="bookingRate"
              fill="#003b49"
              name="Booking Rate (%)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingRateChart;
