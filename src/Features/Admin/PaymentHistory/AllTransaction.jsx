import React, { useEffect, useState } from "react";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import ReuseableTable from "../../Common/Shared/Components/Table/ReuseableTable";
import Service from "./Services";
import { FaTimes } from "react-icons/fa";

const AllTransaction = ({ userId, subscriptionId, onClose }) => {
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // CORRECT COLUMNS AS PER YOUR API RESPONSE
  const columns = [
    {
      key: "createdAt",
      label: "Transaction Date & Time",
      render: (row) => {
        const date = new Date(row.createdAt);
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        return `${formattedDate} | ${formattedTime}`;
      },
    },
    {
      key: "transactionId",
      label: "Transaction ID",
    },
    {
      key: "paymentMode",
      label: "Payment Mode",
      render: (row) => row?.paymentMode || "-",
    },
    {
      key: "paymentType",
      label: "Payment Type",
      render: (row) => row?.paymentType || "-",
    },
    {
      key: "amountPaid",
      label: "Amount Paid ($)",
      render: (row) => row?.amountPaid || "-",
    },
    {
      key: "currency",
      label: "Currency",
      render: (row) => row?.currency?.toUpperCase() || "-",
    },
    {
      key: "status",
      label: "Payment Status",
      render: (row) => row?.status || "-",
    },
  ];

  // API CALL
  const fetchAllTransactions = async ({ page, limit }) => {
    try {
      const reqData = {
        limit,
        page,
        patientId: userId,
      };
      if (subscriptionId) {
        reqData.subscriptionId = subscriptionId;
      }

      const response = await Service.patientAllTransaction(reqData);

      if (response?.status === 200) {
        setData(response?.data?.data || []);
        setTotalCount(response?.data?.totalRecords || 0);
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.message || "Failed to fetch transactions"
      );
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAllTransactions({ page, limit, subscriptionId });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, userId]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "90%",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: "8px",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">All Transactions</h5>

          <button className="btn btn-danger btn-sm" onClick={onClose}>
            <FaTimes /> Close
          </button>
        </div>

        {/* TABLE */}
        <ReuseableTable
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
    </div>
  );
};

export default AllTransaction;
