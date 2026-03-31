// routes/commonRoutes.js
import React from "react";
import ChangePassword from "../../../Authentication/ChangePassword/ChangePassword";
import ErrorComponent from "../Components/ErrorPage/ErrorComponent";
import AppointmentList from "../../../Appointment/List/AppointmentList";
import AppointmentDetails from "../../../Appointment/Details/AppointmentDetails";
import CalendarScheduler from "../../../Appointment/Calender/CalendarScheduler";
import Notification from "../../../Notification/Notification";

const CommonRoute = [
  { path: "/change-password", element: <ChangePassword /> },
  { path: "/notification", element: <Notification />},
  { path: "/calendar-scheduler", element: <CalendarScheduler />},
  { path: "/appointment", element: <AppointmentList />,
    children: [
      { path: "details/:appointmentId", element: <AppointmentDetails /> }
    ]
   },
  { path: "/unauthorized", element: <ErrorComponent /> }
];

export default CommonRoute;
