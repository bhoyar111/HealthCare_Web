import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { withRole } from "../Utils/WithRole";
import ProviderDashboard from "../../../Dashboard/ProviderDashboard/ProviderDashboard";
import Profile from "../../../Provider/Profile/Profile";
import ProviderEdit from "../../../Provider/Profile/ProviderEdit";
import PatientList from "../../../Provider/Patient/PatientList";
import Communication from "../../../Provider/Communication/ChatHistory";
import AvailabilityCalendar from "../../../Provider/Availability/Calender/AvailabilityCalendar";
import DemographicList from "../../../Appointment/DemographicDetails/PatientDetails/DemographicList";
import DemographicAddEdit from "../../../Appointment/DemographicDetails/PatientDetails/DemographicAddEdit";
import DemographicView from "../../../Appointment/DemographicDetails/PatientDetails/DemographicView";
import ProductApp from "../../../Provider/Product/Productapp";

const rawProviderRoutes = [
  { path: "/provider-dashboard", element: <ProviderDashboard /> },
  { path: "/provider-profile", element: <Profile /> },
  { path: "/provider-Edit/:userId", element: <ProviderEdit /> },
  { path: "/my-patient", element: <PatientList /> },
  {
    path: "/availability",
    element: (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AvailabilityCalendar />
      </LocalizationProvider>
    ),
  },
  { path: "/communication", element: <Communication /> },
  {path:"/Productapp", element:<ProductApp/>},
  {
    path: "/demographics/:userId",
    element: <DemographicList />,
    children: [
      { path: "add-demographic", element: <DemographicAddEdit /> },
      { path: "edit-demographic/:id", element: <DemographicAddEdit /> },
      { path: "view-demographic/:id", element: <DemographicView /> },
    ],
  },
];

const ProviderRoute = withRole("Provider", rawProviderRoutes);
export default ProviderRoute;
