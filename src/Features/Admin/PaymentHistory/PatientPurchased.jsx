import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSelector } from "react-redux";
import { Eye } from "react-feather";
import dayjs from "dayjs";

import Service from "./Services";
import PatientService from "../UserManagement/Services";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import ReuseableTable from "../../Common/Shared/Components/Table/ReuseableTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const PatientPurchased = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-restricted-globals
  const isChildRoute = location.pathname !== "/payment-history";
  const TIMEZONE = useSelector((state) => state.timezone.timezone);

  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fromDate, setFromDate] = useState(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(
    dayjs().endOf("month").format("YYYY-MM-DD")
  );

  const [patientId, setPatientId] = useState("");
  const [allPatientOptions, setAllPatientOptions] = useState([]);

  //   FETCH ALL PATIENTS FOR DROPDOWN (FROM YOUR API)
  const patientListing = async () => {
    try {
      const reqData = {
        limit: 0,
        page: 1,
        role: "Patient",
      };

      const response = await PatientService.getListProviders(reqData);

      if (response?.status === 200) {
        const patients = response?.data?.result || [];

        const formattedOptions = [
          { label: "All Patients", value: "" },
          ...patients.map((item) => ({
            label: `${item?.fullName}${item?.email ? ` - (${item?.email})` : ""}`,
            value: item?._id,
          })),
        ];

        setAllPatientOptions(formattedOptions);
      }
    } catch (err) {
      showToast("error", "Failed to fetch patients");
    }
  };

  useEffect(() => {
    patientListing();
  }, []);

  //   DATE FILTER
  const handleDateChange = ({ from, to }) => {
    setFromDate(from);
    setToDate(to);

    allUserPaymentList({
      fromDate: from,
      toDate: to,
      page,
      limit,
      userId: patientId,
    });
  };

  //   PATIENT DROPDOWN CHANGE
  const handlePatientChange = (selectedOption) => {
    const selectedPatientId = selectedOption?.value || "";

    setPatientId(selectedPatientId);
    setPage(1);

    allUserPaymentList({
      fromDate,
      toDate,
      page: 1,
      limit,
      userId: selectedPatientId,
    });
  };

  const columns = [
    {
      key: "lastPurchase",
      label: "Latest Purchase Date & Time",
      render: (row) =>
        new Date(row.lastPurchase).toLocaleDateString("en-US", {
          timeZone: TIMEZONE,
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "patientName",
      label: "Patient Name",
      render: (row) => row?.patient?.fullName || "-",
    },
    {
      key: "email",
      label: "Email",
      render: (row) => row?.patient?.email || "-",
    },
    {
      key: "phone",
      label: "Phone Number",
      render: (row) => row?.patient?.mobile || "-",
    },
  ];

  const actions = [
    {
      label: "View",
      icon: <Eye size={14} />,
      onClick: (row) =>
        navigate(`/payment-history/subscription-history/${row?.patient?._id}`, {
          state: {
            patientName: row?.patient?.fullName,
          },
        }),
    },
  ];

  //   SUBSCRIPTION LIST API
  const allUserPaymentList = async ({
    fromDate,
    toDate,
    page,
    limit,
    userId,
  }) => {
    try {
      const reqData = {
        limit,
        page,
        userId,
        fromDate,
        toDate,
      };

      const response = await Service.patientSubcriptionHistory(reqData);

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
    allUserPaymentList({ fromDate, toDate, page, limit, userId: patientId });
  }, [limit, page, fromDate, toDate, patientId]);

  return (
    <>
      {!isChildRoute && (
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <h5 className="mb-3">Patient Subscription Purchased List</h5>

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
              showDateFilters={true}
              onDateChange={handleDateChange}
              fromDate={fromDate}
              toDate={toDate}
              showDropdownFilter={true}
              dropdownOptions={allPatientOptions} //   SEARCHABLE DROPDOWN
              onDropdownChange={handlePatientChange}
            />
          </LocalizationProvider>
        </div>
      )}
      <Outlet />
    </>
  );
};

export default PatientPurchased;
