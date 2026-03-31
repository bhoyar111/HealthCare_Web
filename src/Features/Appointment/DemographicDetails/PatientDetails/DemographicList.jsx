// src/Modules/Demographic/Pages/DemographicList.js
import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation, useParams } from "react-router-dom";
import { Edit, Eye, Trash2 } from "react-feather";

import Service from "../Service/Services";
import showToast from "../../../Common/Shared/Utils/ToastNotification";
import ReuseableTable from "../../../Common/Shared/Components/Table/ReuseableTable";
import ConfirmModal from "../../../Common/Shared/Components/CustomePopup/ConfirmModal";

export default function DemographicList() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isChildRoute = location.pathname !== `/demographics/${userId}`;

  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [pendingAction, setPendingAction] = useState({
    actionName: "",
    actionValue: null,
  });

  const topButtons = [
    {
      label: "Add",
      onClick: () => navigate(`/demographics/${userId}/add-demographic`),
      className: "btn-success",
    },
  ];

  const columns = [
    { key: "preferredName", label: "Preferred Name" },
    { key: "faithCulture", label: "Faith Culture" },
    { key: "activeConditions", label: "Active Conditions" },
  ];

  const actions = [
    {
      label: "View",
      icon: <Eye size={14} />,
      onClick: (row) =>
        navigate(`/demographics/${userId}/view-demographic/${row._id}`),
    },
    {
      label: "Edit",
      icon: <Edit size={14} />,
      onClick: (row) =>
        navigate(`/demographics/${userId}/edit-demographic/${row._id}`),
    },
    {
      label: "Delete",
      icon: <Trash2 size={14} />,
      btnClass: "btn-outline-danger",
      onClick: (row) => {
        setSelectedRow(row);
        setPendingAction({ actionName: "isDeleted", actionValue: true });
        setShowDeleteModal(true);
      },
    },
  ];

  const fetchList = async () => {
    try {
      const reqData = {
        limit,
        page,
        searchText,
        userId,
        isActive: statusFilter || undefined,
      };

      const res = await Service.getAllDemographicList(reqData);
      if (res?.status === 200) {
        setData(res.data?.result || []);
        setTotalCount(res.data?.totalRecords || 0);
      }
    } catch (err) {
      console.log(err);
      // showToast("error", "Failed to fetch demographic list");
    }
  };

  const handleConfirmAction = async () => {
    try {
      const patientId = selectedRow?._id;
      const response = await Service.deleteDemographicPatient(patientId);

      if (response?.status === 200) {
        showToast("success", response.message || "Deleted successfully");
        fetchList();
      }
    } catch (err) {
      showToast("error", "Delete failed");
    } finally {
      setShowDeleteModal(false);
      setSelectedRow(null);
    }
  };

  useEffect(() => {
    fetchList();

    if (location.state?.refresh) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line
  }, [limit, page, searchText, statusFilter, location.state?.refresh]);

  return (
    <>
      {!isChildRoute && (
        <ReuseableTable
          columns={columns}
          data={data}
          actions={actions}
          pageSize={limit}
          currentPage={page}
          totalCount={totalCount}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
          showSearch={true}
          onSearch={setSearchText}
          showStatusFilter={false}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          showTopButtons={true}
          topButtons={topButtons}
          showBackButton={!isChildRoute}
        />
      )}

      <ConfirmModal
        show={showDeleteModal}
        message={`Are you sure you want to ${
          pendingAction.actionName === "isDeleted"
            ? "delete"
            : pendingAction.actionValue
              ? "activate"
              : "inactivate"
        } this record?`}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmAction}
      />

      <Outlet />
    </>
  );
}
