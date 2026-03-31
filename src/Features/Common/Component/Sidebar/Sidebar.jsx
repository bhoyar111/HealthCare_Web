import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFileInvoice, FaMoneyBillWave, FaRegCreditCard, FaUserDoctor } from "react-icons/fa6";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserMd,
  FaComments,
  FaDatabase,
  FaFileAlt,
  FaFolder,
  FaFolderOpen,
  FaPoll,
  FaSync,
  FaCalendarCheck,
  FaBell,
} from "react-icons/fa";
import "./Sidebar.css";
import { toggleSidebar } from "../../Shared/Slice/SidebarSlice";
import logo from "../../Assests/logo.png";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const role = useSelector((state) => state?.auth?.user?.userData?.role);

  const [expandedMenus, setExpandedMenus] = useState([]);
  const [activeItem, setActiveItem] = useState("");

  const routeMap = {
    dashboard: "/admin-dashboard",
    patients: "/patients",
    providers: "/providers",
    articles: "/articles",
    content: "/content-management",
    contactus: "/contactus",
    questionnaire: "/questionnaire",
    "assignment-control": "/assignment-control",
    categories: "/categories",
    subcategories: "/subcategories",
    audio: "/audio-library",
    video: "/video-library",
    notification: "/notification",
    feedback: "/feedback",
    "provider-dashboard": "/provider-dashboard",
    "my-patient": "/my-patient",
    availability: "/availability",
    appointment: "/appointment",
    communication: "/communication",
    subscription: "/subscription",
    assignmentControl: "/assignment-control",
    surveydetails:"/surveydetails",
    StaticPage: "/static-pages",
    TestPatient: "/TestPatient",
    OnBoardQuestion: "/on-board-question",
    demographics: "/demographics",
    paymentHistory: "/payment-history",
    plan:"/plan",
    productapp:"/productapp"
  };

  const adminMenu = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    {
      id: "users",
      label: "User Directory",
      icon: <FaUsers />,
      subItems: [
        { id: "providers", label: "Providers", icon: <FaUserMd /> },
        { id: "patients", label: "Patients", icon: <FaUsers /> },
      ],
    },
    { id: "articles", label: "Content", icon: <FaFileAlt /> },
    { id: "contactus", label: "Contact Us", icon: <FaUserMd /> },
    {
      id: "surve",
      label: "Survey",
      icon: <FaSync />,
      subItems: [
        { id: "questionnaire", label: "Survey Question", icon: <FaPoll /> },
        { id: "surveydetails", label: "Survey View", icon: <FaFolderOpen /> },
      ],
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: <FaFileInvoice />,
      subItems: [
        { id: "plan", label: "Plan", icon: <FaRegCreditCard /> },
        { id: "paymentHistory", label: "Payment History", icon: <FaMoneyBillWave /> },
      ],
    },
    {
      id: "master",
      label: "Master",
      icon: <FaDatabase />,
      subItems: [
        { id: "categories", label: "Category", icon: <FaFolder /> },
        { id: "subcategories", label: "Sub Category", icon: <FaFolderOpen /> },
        { id: "StaticPage", label: "Static Pages", icon: <FaFolderOpen /> },
        { id: "OnBoardQuestion", label: "On-Board Question", icon: <FaFolderOpen /> },
      ],
    },
    { id: "notification", label: "Notification", icon: <FaBell /> },

    // { id: "assignment-control", label: "Assignment Control", icon: <FaCalendarCheck /> },
    // { id: "appointmentControl", label: "Appointment Control", icon: <FaCalendarAlt /> },
    // {
    //   id: "master", label: "Master", icon: <FaDatabase />, subItems: [
    //     { id: "content", label: "Content Management", icon: <FaFileAlt /> },
    //     { id: "audio", label: "Audio Library", icon: <FaHeadphones /> },
    //     { id: "video", label: "Video Library", icon: <FaVideo /> }
    //   ]
    // },
    // { id: "feedback", label: "Feedback", icon: <MdFeedback /> },
    // { id: "TestPatient", label: "Test-Patient", icon: <FaRegCreditCard /> }
  ];

  const providerMenu = [
    { id: "provider-dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "my-patient", label: "Patients", icon: <FaUsers /> },
    { id: "availability", label: "My Availability", icon: <FaCalendarCheck /> },
    { id: "appointment", label: "Consultations", icon: <FaUserDoctor /> },
    { id: "communication", label: "Messages", icon: <FaComments /> },
    { id: "productapp", label:"Upload videos",icon:<FaFileAlt/>},
    // { id: "demographics", label: "Demographics", icon: <FaComments /> },
    { id: "notification", label: "Notification", icon: <FaBell /> }
  ];

  const menuItems = role === "Admin" ? adminMenu : providerMenu;

  useEffect(() => {
    const path = location.pathname;
    const matchedKey = Object.keys(routeMap).find(
      (key) => routeMap[key] === path
    );
    if (matchedKey) {
      setActiveItem(matchedKey);
      const parent = adminMenu.find((item) =>
        item.subItems?.some((sub) => sub.id === matchedKey)
      );
      if (parent) {
        setExpandedMenus((prev) =>
          prev.includes(parent.id) ? prev : [...prev, parent.id]
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleMenuClick = (id, hasSubItems) => {
    if (hasSubItems) {
      setExpandedMenus((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setActiveItem(id);
      if (routeMap[id]) navigate(routeMap[id]);
    }
  };

  const renderSubMenu = (subItems, parentId) => {
    if (!isOpen || !expandedMenus.includes(parentId)) return null;
    return (
      <ul className="submenu">
        {subItems.map(({ id, label, icon }) => (
          <li
            key={id}
            className={`submenu-item ${activeItem === id ? "active" : ""}`}
            onClick={() => {
              setActiveItem(id);
              if (routeMap[id]) navigate(routeMap[id]);
            }}
          >
            {icon && <span className="icon">{icon}</span>}
            <span className="label">{label}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderMenu = () =>
    menuItems.map(({ id, label, icon, subItems }) => {
      const isActive = activeItem === id;
      const hasSubItems = !!subItems;

      return (
        <React.Fragment key={id}>
          <li
            className={`sidebar-item ${isActive ? "active" : ""}`}
            onClick={() => handleMenuClick(id, hasSubItems)}
          >
            <span className="icon">{icon}</span>
            {isOpen && (
              <>
                <span className="label">{label}</span>
                {hasSubItems && (
                  <span className="arrow">
                    {expandedMenus.includes(id) ? "▼" : "▶"}
                  </span>
                )}
              </>
            )}
          </li>
          {hasSubItems && renderSubMenu(subItems, id)}
        </React.Fragment>
      );
    });

  return (
    <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header" onClick={() => dispatch(toggleSidebar())}>
        <img
          src={logo}
          alt="Logo"
          className={isOpen ? "logo-icon" : "logo-icon-collapsed"}
        />
        {isOpen && <span className="admin-text">{role} Panel</span>}
      </div>
      <ul className="sidebar-links">{renderMenu()}</ul>
    </div>
  );
};

export default Sidebar;
