import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCog, FaSignOutAlt, FaRegUser, FaBell } from "react-icons/fa";
import { setHeading } from "../../Shared/Slice/PageSlice";
import { userlogout } from "../../Shared/Slice/AuthSlice";
import { setTimezone } from "../../Shared/Slice/TimezoneSlice";
import Service from "../../../Authentication/Login/Service";
import "./Nav.css";

const headingMap = {
  "/admin-dashboard": "Dashboard",
  "/questionnaire": "Survey Question",
  "/appointments": "Appointments",
  "/providers": "Providers",
  "/patients": "Patients",
  "/content-management": "Content Management",
  "/audio-library": "Audio Library",
  "/video-library": "Video Library",
  "/notification": "Notification",
  "/feedback": "Feedback",
  "/provider-dashboard": "Dashboard",
  "/my-patient": "Patients",
  "/appointment": "Consultation",
  "/communication": "Messages",
  "/subscription": "Manage Subscription",
  "/assignment-control":"Assignment Control",
  "/surveydetails": "Survey View",
  "/demographics": "Demoghraphic",
  "/payment-history": "Payment History",
  "plan": "Plan",
  "/productapp":"Upload videos"
};

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  const logsData = useSelector((state) => state.logs.logs);
  const loggedInUser = useSelector((state) => state?.auth?.user?.userData);
  const loggedInUserId = useSelector((state) => state?.auth?.user?.userData?._id);
  const loggedInUserRole = useSelector((state) => state?.auth?.user?.userData?.role);
   const timezone = useSelector((state) => state.timezone.timezone);

  const fullName = loggedInUser?.fullName || "Admin User";

  useEffect(() => {
    const heading = headingMap[location.pathname] || "Page";
    dispatch(setHeading(heading));
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (profileRef.current) {
      setDropdownWidth(profileRef.current.offsetWidth);
    }
  }, [loggedInUser?.fullName, showDropdown]);

  const handleLogout = async () => {
    const response = await Service.logInLogs({ logsId: logsData?._id });
    if (response?.status === 200) dispatch(userlogout());
  };

  const getInitials = (name) => {
    if (!name) return "";
    const [first = "", last = ""] = name.trim().split(" ");
    return `${first[0] || ""}${last[0] || ""}`.toUpperCase();
  };

   const handleProfileClick = () => {
    if (loggedInUserRole === "Provider") {
      navigate("/provider-profile", { state: { userId: loggedInUserId } });
    }
  };

  const handleTimezoneChange = (e) => {
    dispatch(setTimezone(e.target.value));
  };

  return ( 
    <div className="header-container">
      <h2 className="page-heading">{headingMap[location.pathname] || ""}</h2>

      <div className="header-actions">
        {/* Timezone Dropdown */}
        <div className="timezone-wrapper" style={{ display: 'flex', alignItems: 'center', marginRight: '15px', background: '#fff', padding: '5px 10px', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <select
            value={timezone}
            onChange={handleTimezoneChange}
            style={{ border: 'none', outline: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#333' }}
          >
             <option value="Asia/Kolkata">IST</option>
             <option value="America/New_York">EST</option>
             <option value="America/Los_Angeles">PT</option>
            {/* add option id needed */}
          </select>
        </div>
        
        {/* Notification */}
        <div className="icon-wrapper" onClick={() => navigate(`/notification`)}>
          <FaBell className="icon notif-icon" />
          <span className="notif-badge" />
        </div>

        {/* Profile */}
        <div
          className={`profile-wrapper ${showDropdown ? "active" : ""}`}
          onClick={() => setShowDropdown((prev) => !prev)}
          ref={profileRef}
        >
          <div className="profile-circle">{getInitials(fullName)}</div>
          <span className="profile-name">
            {fullName} <span className="dropdown-arrow">▼</span>
          </span>

          {showDropdown && (
            <div className="dropdown" style={{ width: dropdownWidth }}>
              {/* <div className="dropdown-header">
                <strong>{fullName}</strong>
                <div className="email">{email}</div>
              </div> */}

              <ul className="profile-dropdown-list">
                {loggedInUserRole === "Provider" && (
                 <li onClick={handleProfileClick}>
                 <FaRegUser className="dropdown-icon" /> Profile
               </li>
                )}
                <li>
                  <FaCog className="dropdown-icon" /> Settings
                </li>
                <li className="logout" onClick={handleLogout}>
                  <FaSignOutAlt className="dropdown-icon" /> Log-out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
