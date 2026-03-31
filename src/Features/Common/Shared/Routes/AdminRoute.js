// routes/adminRoutes.js
import React from "react";
import { withRole } from "../Utils/WithRole";
import AdminDashboard from "../../../Dashboard/AdminDashboard/AdminDashboard";
import AdminProvider from "../../../Admin/UserManagement/Provider/List";
import AdminPatient from "../../../Admin/UserManagement/Patient/List";
import AddUpdateProvider from "../../../Admin/UserManagement/Provider/AddEdit";
import AddUpdatePatient from "../../../Admin/UserManagement/Patient/AddEdit";
import ViewDetailsProvider from "../../../Admin/UserManagement/Provider/ViewDetails";
import ViewDetailsPatient from "../../../Admin/UserManagement/Patient/ViewDetails";
import ServeyPatientView from "../../../Admin/UserManagement/Patient/ListSurveyView";
import ViewSurveyDetailsPatient from "../../../Admin/UserManagement/Patient/ViewSurveyDetails";
import Questionnaire from "../../../Admin/Questionniare/ListQuestions/Questionnaire";
import AddUpdateQuestions from "../../../Admin/Questionniare/AddUpdateQuestions/AddUpdateQuestions";
import PlanList from "../../../Admin/Subscription/Plan/PlanList";
import AssignmentControl from "../../../Admin/AssigmentControl/ListControl/AssignmentControl";
import TestPatient from "../../../Admin/UserManagement/Patient/TestPatient";
import FeedBack from "../../../Admin/Feedback/Feedback";
import AddUpdateCategory from "../../../Admin/ArticleManagement/Category/AddEdit";
import AdminCategory from "../../../Admin/ArticleManagement/Category/List";
import AdminSubCategory from "../../../Admin/ArticleManagement/SubCategory/List";
import AddUpdateSubCategory from "../../../Admin/ArticleManagement/SubCategory/AddEdit";

import AdminArticle from "../../../Admin/ArticleManagement/Article/List";
import AddUpdateArticle from "../../../Admin/ArticleManagement/Article/AddEdit";
import ContactUsList from "../../../Admin/ContactUS/ContactUs";
import StaticPageList from "../../../Admin/Master/StaticPage/List";
import AddUpdateStaticPage from "../../../Admin/Master/StaticPage/AddEdit";
import List from "../../../Admin/Master/OnBoardQuestions/List/List";
import AddUpdate from "../../../Admin/Master/OnBoardQuestions/AddUpdate/AddUpdate";
import Notification from "../../../Notification/Notification";
import SubscriptionHistory from "../../../Admin/PaymentHistory/PatientPurchased";
import PurchasedPlanHistory from "../../../Admin/PaymentHistory/SubscriptionHistory";

const rawAdminRoutes = [
  // Dashboard
  { path: "/admin-dashboard", element: <AdminDashboard /> },

  // User Management
  {
    path: "/providers",
    element: <AdminProvider />,
    children: [
      { path: "add-provider", element: <AddUpdateProvider /> },
      { path: "edit-provider/:userId", element: <AddUpdateProvider /> },
      { path: "view-provider/:userId", element: <ViewDetailsProvider /> },
    ],
  },
  {
    path: "/patients",
    element: <AdminPatient />,
    children: [
      { path: "add-patient", element: <AddUpdatePatient /> },
      { path: "edit-patient/:userId", element: <AddUpdatePatient /> },
      { path: "view-patient/:userId", element: <ViewDetailsPatient /> },
    ],
  },

  // Content Management
  {
    path: "/articles",
    element: <AdminArticle />,
    children: [
      { path: "add", element: <AddUpdateArticle /> },
      { path: "edit/:articleId", element: <AddUpdateArticle /> },
    ],
  },

  // Contact Management
  { path: "/contactUs", element: <ContactUsList /> },

  // Survey Form Management
  {
    path: "/questionnaire",
    element: <Questionnaire />,
    children: [
      { path: "add-question", element: <AddUpdateQuestions /> },
      { path: "edit-question/:id", element: <AddUpdateQuestions /> },
    ],
  },
  {
    path: "/surveydetails",
    element: <ServeyPatientView />,
    children: [
      {
        path: "view-patient-survey/:userId",
        element: <ViewSurveyDetailsPatient />,
      },
    ],
  },
  {
    path: "/plan",
    element: <PlanList />,
  },
  {
    path: "/payment-history",
    element: <SubscriptionHistory />,
    children: [
      { path: "subscription-history/:userId", element: <PurchasedPlanHistory /> }
    ]
  },

  // Masters
  {
    path: "/categories",
    element: <AdminCategory />,
    children: [
      { path: "add", element: <AddUpdateCategory /> },
      { path: "edit/:categoryId", element: <AddUpdateCategory /> },
    ],
  },
  {
    path: "/subcategories",
    element: <AdminSubCategory />,
    children: [
      { path: "add", element: <AddUpdateSubCategory /> },
      { path: "edit/:subCategoryId", element: <AddUpdateSubCategory /> },
    ],
  },
  {
    path: "/static-pages",
    element: <StaticPageList />,
    children: [
      { path: "add", element: <AddUpdateStaticPage /> },
      { path: "edit/:staticPageId", element: <AddUpdateStaticPage /> },
    ],
  },

  // Others pages
  { path: "/notification", element: <Notification /> },
  { path: "/assignment-control", element: <AssignmentControl /> },
  { path: "/TestPatient", element: <TestPatient /> },
  { path: "/feedback", element: <FeedBack /> },
  {
    path: "/on-board-question",
    element: <List />,
    children: [
      { path: "add-on-board-question", element: <AddUpdate /> },
      { path: "edit-on-board-question/:id", element: <AddUpdate /> },
    ],
  },
];

const AdminRoute = withRole("Admin", rawAdminRoutes);
export default AdminRoute;
