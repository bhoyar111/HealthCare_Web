import React, { useEffect, useState } from "react";
import "./AppointmentList.css";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Service from "../Services";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import { convertToTimezone } from "../../Common/Shared/Hooks/useTimezonecontext";
import { DateTime } from "luxon";

const AppointmentList = () => {
  // const TIMEZONE = process.env.REACT_APP_TIMEZONE || "America/New_York";
  const timezone = useSelector((state) => state.timezone.timezone);
  const navigate = useNavigate();
  // eslint-disable-next-line no-restricted-globals
  const isChildRoute = location.pathname !== "/appointment";
  const userInfo = useSelector((state) => state?.auth?.user?.userData);

  // State for dynamic data
  const [appointments, setAppointments] = useState([]);
  console.log(appointments, "appointments");
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [stats, setStats] = useState({
    totalAppointment: 0,
    totalApproved: 0,
    totalCancelled: 0,
    totalCompleted: 0,
    totalMissed: 0,
    totalPending: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });
  const [filters, setFilters] = useState({
    limit: 10,
    page: 1,
    patientName: "",
    providerName: "",
    status: "ALL",
    fromDate: "",
    toDate: "",
  });
  const appointmentListing = async (filterParams = filters) => {
    try {
      const response = await Service.getAllAppointmentList(filterParams);
      if (response?.status === 200 && response?.data) {
        const {
          result = [],
          totalAppointment = 0,
          totalApproved = 0,
          totalCancelled = 0,
          totalCompleted = 0,
          totalMissed = 0,
          totalPending = 0,
          totalPages = 1,
          totalRecords = 0,
          currentPage = 1,
        } = response.data;

        setAppointments(result);
        setStats({
          totalAppointment,
          totalApproved,
          totalCancelled,
          totalCompleted,
          totalMissed,
          totalPending,
        });
        setPagination({
          currentPage,
          totalPages,
          totalRecords,
        });

        // Group appointments by consultationDate
        const grouped = result.reduce((acc, curr) => {
          const dateKey = curr.consultationDate
            ? new Date(curr.consultationDate).toISOString().split("T")[0]
            : "Unknown Date";
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(curr);
          return acc;
        }, {});
        setGroupedAppointments(grouped);
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.message || "Failed to fetch appointments"
      );
    }
  };
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    appointmentListing(newFilters);
  };
  // Handle pagination
  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    appointmentListing(newFilters);
  };
  // Handle rows per page change
  const handleRowsPerPageChange = (newLimit) => {
    const newFilters = { ...filters, limit: parseInt(newLimit), page: 1 };
    setFilters(newFilters);
    appointmentListing(newFilters);
  };
  // Handle search/filter with current filter values
  const handleSearch = () => {
    const searchFilters = { ...filters, page: 1 };
    setFilters(searchFilters);
    appointmentListing(searchFilters);
  };
  // Reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      limit: 10,
      page: 1,
      patientName: "",
      providerName: "",
      status: "ALL",
      fromDate: "",
      toDate: "",
    };
    setFilters(resetFilters);
    appointmentListing(resetFilters);
  };
  useEffect(() => {
    appointmentListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // // Format date for display
  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("en-US", {
  //     timeZone: TIMEZONE,
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   });
  // };

   // Format date for display
  const formatDate = (dateString) => {
    return convertToTimezone(dateString, timezone).split(',')[0];
  };

  // Convert time based on timezone
  const convertTime = (dateString, timeString) => {
    if (!dateString || !timeString) return timeString;
    
    // Handle time range format like "10:00-10:30"
    if (timeString.includes('-')) {
      const [startTime, endTime] = timeString.split('-');
      const startDateTime = `${dateString.split('T')[0]}T${startTime}:00.000Z`;
      const endDateTime = `${dateString.split('T')[0]}T${endTime}:00.000Z`;
      
      const convertedStart = DateTime.fromISO(startDateTime).setZone(timezone).toFormat('h:mm a');
      const convertedEnd = DateTime.fromISO(endDateTime).setZone(timezone).toFormat('h:mm a');
      
      return `${convertedStart}-${convertedEnd}`;
    }
    
    // Handle single time format
    const combinedDateTime = `${dateString.split('T')[0]}T${timeString}:00.000Z`;
    return DateTime.fromISO(combinedDateTime).setZone(timezone).toFormat('h:mm a');
  };
  // Get status badge class and display text
  const getStatusBadge = (status) => {
    const statusMap = {
      COMPLETED: { class: "status_badge-completed", text: "Completed" },
      APPROVED: { class: "status_badge-confirmed", text: "Booked" },
      CANCELLED: { class: "status_badge-cancelled", text: "Cancelled" },
      PENDING: { class: "status_badge-pending", text: "Pending" },
      MISSED: { class: "status_badge-cancelled", text: "Missed" },
    };
    const statusInfo = statusMap[status] || {
      class: "status_badge-pending",
      text: status,
    };
    return {
      className: `status_badge ${statusInfo.class}`,
      text: statusInfo.text,
    };
  };
  return (
    <>
      {!isChildRoute && (
        <div className="container-fluid p-4 dashboard-container">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title mb-0">Consultation</h5>
            {userInfo?.role !== "Admin" && (
              <button
                className="btn btn-primary new-appointment-btn"
                style={{ marginRight: "4px" }}
                onClick={() => navigate(`/calendar-scheduler`)}
                title="Calendar View"
              >
                <i className="fas fa-calendar"></i>
              </button>
            )}
          </div>

          {/* Stats */}
          {userInfo?.role !== "Provider" && (
            <div className="row mb-4">
              {[
                {
                  label: "Total Appointments",
                  value: stats.totalAppointment,
                  icon: "fa-calendar-alt",
                  color: "total",
                },
                {
                  label: "Approved",
                  value: stats.totalApproved,
                  icon: "fa-check-circle",
                  color: "confirmed",
                },
                {
                  label: "Cancelled",
                  value: stats.totalCancelled,
                  icon: "fa-times-circle",
                  color: "cancelled",
                },
                {
                  label: "Completed",
                  value: stats.totalCompleted,
                  icon: "fa-check-double",
                  color: "completed",
                },
              ].map((s, idx) => (
                <div className="col-md-3 mb-3" key={idx}>
                  <div className={`card stat-card stat-card-${s.color}`}>
                    <div className="card-body d-flex align-items-center">
                      <div className={`stat-icon stat-icon-${s.color} me-3`}>
                        <i className={`fas ${s.icon}`}></i>
                      </div>
                      <div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filters */}
          <div className="card mb-4 filter-card">
            <div className="card-body">
              <div className="row align-items-end">
                <div className="col-md-3">
                  <label className="form-label filter-label">Patient</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by patient name"
                    value={filters.patientName}
                    onChange={(e) =>
                      setFilters({ ...filters, patientName: e.target.value })
                    }
                  />
                </div>
                {userInfo?.role !== "Provider" && (
                  <div className="col-md-3">
                    <label className="form-label filter-label">Provider</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by provider name"
                      value={filters.providerName}
                      onChange={(e) =>
                        setFilters({ ...filters, providerName: e.target.value })
                      }
                    />
                  </div>
                )}
                <div className="col-md-2">
                  <label className="form-label filter-label">Status</label>
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Booked</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="MISSED">Missed</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label filter-label">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.fromDate}
                    onChange={(e) =>
                      handleFilterChange("fromDate", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label filter-label">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.toDate}
                    onChange={(e) =>
                      handleFilterChange("toDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12">
                  <button
                    className="btn btn-primary me-2"
                    onClick={handleSearch}
                  >
                    <i className="fas fa-search me-1"></i> Search
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleResetFilters}
                  >
                    <i className="fas fa-refresh me-1"></i> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="card appointments-card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table appointments-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>PATIENT</th>
                      <th>DOCTOR</th>
                      <th>DATE & TIME</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(groupedAppointments).length > 0 ? (
                      Object.entries(groupedAppointments).map(
                        ([date, group]) => (
                          <React.Fragment key={date}>
                            <tr className="table-group-header bg-light">
                              <td colSpan="6" className="fw-bold">
                                {formatDate(date)} ({group.length} appointments)
                              </td>
                            </tr>

                            {group.map((appointment) => {
                              const statusInfo = getStatusBadge(
                                appointment?.status
                              );
                              return (
                                <tr key={appointment?._id}>
                                  <td>{appointment?.appointment_id}</td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      {/* <div className="patient-avatar me-3">
                                        {appointment?.patient?.profile_pic ? (
                                          <img
                                            src={
                                              appointment?.patient?.profile_pic
                                            }
                                            alt={appointment?.patient?.fullName}
                                            className="rounded-circle"
                                            style={{
                                              width: "40px",
                                              height: "40px",
                                              objectFit: "cover",
                                            }}
                                          />
                                        ) : (
                                          <div
                                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                            style={{
                                              width: "40px",
                                              height: "40px",
                                              fontSize: "16px",
                                            }}
                                          >
                                            {appointment?.patient?.fullName
                                              ?.charAt(0)
                                              ?.toUpperCase() || "P"}
                                          </div>
                                        )}
                                      </div> */}
                                      <div>
                                        <Link
                                          to={`/patients/view-patient/${appointment?.patient?._id}`}
                                          className="fw-semibold text-decoration-none"
                                        >
                                          {appointment?.patient?.fullName}
                                        </Link>
                                        <div className="patient-email">
                                          {appointment?.patient?.email}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/providers/view-provider/${appointment?.provider?._id}`}
                                      className="fw-semibold text-decoration-none"
                                    >
                                      {appointment?.provider?.fullName}
                                    </Link>
                                  </td>
                                  <td>
                                    <div>
                                      {formatDate(
                                        appointment?.consultationDate
                                      )}
                                    </div>
                                    {/* <div>{appointment?.consultationTime}</div> */}
                                     <div>{convertTime(appointment?.consultationDate, appointment?.consultationTime)}</div>
                                  </td>
                                  <td>
                                    <span className={statusInfo.className}>
                                      {statusInfo.text}
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-primary action-icon-btn"
                                      title="View Appointment"
                                      onClick={() =>
                                        navigate(
                                          `/appointment/details/${appointment?._id}`
                                        )
                                      }
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </React.Fragment>
                        )
                      )
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <div className="text-muted">
                            <i className="fas fa-calendar-times fa-3x mb-3"></i>
                            <p>No appointments found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalRecords > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="d-flex align-items-center">
                    <span
                      className="text-muted me-2"
                      style={{ fontSize: "14px" }}
                    >
                      Rows per page:
                    </span>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "66px", height: "40px" }}
                      value={filters.limit}
                      onChange={(e) => handleRowsPerPageChange(e.target.value)}
                    >
                      <option value={2}>2</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  <div className="text-muted" style={{ fontSize: "14px" }}>
                    Showing{" "}
                    <strong>
                      {(pagination.currentPage - 1) * filters.limit + 1}-
                      {Math.min(
                        pagination.currentPage * filters.limit,
                        pagination.totalRecords
                      )}
                    </strong>{" "}
                    of <strong>{pagination.totalRecords}</strong> records
                  </div>
                  <div className="d-flex align-items-center">
                    <span
                      className="text-muted me-3"
                      style={{ fontSize: "14px" }}
                    >
                      {pagination.currentPage}
                    </span>
                    <div className="btn-group">
                      <button
                        type="button"
                        className={`btn btn-outline-secondary btn-sm ${
                          pagination.currentPage === 1 ? "disabled" : ""
                        }`}
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={pagination.currentPage === 1}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        className={`btn btn-outline-secondary btn-sm ${
                          pagination.currentPage === pagination.totalPages
                            ? "disabled"
                            : ""
                        }`}
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={
                          pagination.currentPage === pagination.totalPages
                        }
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
};

export default AppointmentList;
