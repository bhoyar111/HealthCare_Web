import React, { useEffect, useState } from "react";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import ReuseableTable from "../../Common/Shared/Components/Table/ReuseableTable";
import Service from "./Services";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaRedo } from "react-icons/fa";
import { Eye } from "react-feather";
import AllTransaction from "./AllTransaction";

const SubscriptionHistory = () => {
  const { userId } = useParams();
  const location = useLocation();
  const patientName = location.state?.patientName;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);

  const columns = [
    {
      key: "purchaseDate",
      label: "Purchase Date & Time",
      render: (row) => {
        const date = new Date(row.purchaseDate);
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
        const formattedTime = date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
        return `${formattedDate} | ${formattedTime}`;
      }
    },
    {
      key: "planName",
      label: "Plan Name",
      render: (row) => row?.planDetails?.planName || "-"
    },
    {
      key: "planPrice",
      label: "Plan Price($)",
      render: (row) => row?.planDetails?.planPrice || "-"
    },
    {
      key: "planDuration",
      label: (
        <span className="d-flex align-items-center gap-1">
          Plan Duration <FaRedo size={12} />
        </span>
      ),
      render: (row) => row?.planDetails?.planDuration || "-"
    },
    {
      key: "subscriptionStatus",
      label: "Subscription Status",
      render: (row) => {
        const status = row?.subscriptionStatus;

        const statusClass =
          status === "Active"
            ? "status-badge status-active"
            : status === "Canceled"
            ? "status-badge status-cancel"
            : "status-badge status-pending";

        return <span className={statusClass}>{status || "-"}</span>;
      }
    },
    {
      key: "amountPaid",
      label: "Amount Paid($)",
      render: (row) => row?.planDetails?.amountPaid || "-"
    }
  ];
  const actions = [
    {
      label: "View",
      icon: <Eye size={14} />,
      onClick: (row) => {
        setSelectedSubscriptionId(row?._id || row?.subscriptionId);
        setShowAllModal(true);
      },
      hide: (row) => row?.subscriptionStatus === "Pending"
    }
  ];
  // API call
  const allUserPaymentList = async ({ page, limit, userId }) => {
    try {
      const reqData = {
        limit,
        page,
        patientId: userId
      };

      const response = await Service.patientSubcriptionList(reqData);
      if (response?.status === 200) {
        setData(response?.data?.data || []);
        setTotalCount(response?.data?.totalRecords || 0);
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.message || "Failed to fetch payment history"
      );
    }
  };

  useEffect(() => {
    if (userId) {
      allUserPaymentList({ page, limit, userId });
    }
  }, [limit, page, userId]);
  const goBack = () => {
    navigate(-1);
  };
  return (
    <>
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/*  LEFT SIDE - BACK BUTTON + TITLE */}
          <div className="d-flex align-items-center">
            <button
              className="btn btn-primary new-appointment-btn me-2"
              onClick={goBack}
            >
              <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
              Back
            </button>
            <h5 className="mb-0">{patientName} - Subscription List</h5>
          </div>

          {/* RIGHT SIDE - VIEW ALL TRANSACTIONS */}
          <button
            onClick={() => setShowAllModal(true)}
            className="btn btn-outline-primary">
            View All Transactions
          </button>
        </div>

        <ReuseableTable
          actions={actions}
          columns={columns}
          data={data}
          pageSize={limit}
          currentPage={page}
          totalCount={totalCount}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newLimit) => setLimit(newLimit)}
          showSearch={false}
        />
      </div>
      {showAllModal && (
        <AllTransaction
          userId={userId}
          subscriptionId={selectedSubscriptionId}
          onClose={() => {
            setShowAllModal(false);
            setSelectedSubscriptionId(null);
          }}
        />
      )}
    </>
  );
};

export default SubscriptionHistory;
