import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import "./AppointmentDetails.css";

import Service from "../Services";
// import Diagnosis from "../Diagnosis/Diagnosis";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import Communication from "../../Provider/Communication/Communication";
import { convertToTimezone } from "../../Common/Shared/Hooks/useTimezonecontext";
import { DateTime } from "luxon";


const AppointmentDetails = () => {
  const userInfo = useSelector((state) => state?.auth?.user?.userData);
  const timezone = useSelector((state) => state.timezone.timezone);
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [appointment, setAppointment] = useState(null);
  const commRef = useRef();
  const [inCall, setInCall] = useState(false);

  // Fetch Appointment data by appointmentId
  useEffect(() => {
    if (appointmentId) fetchAppointmentData(appointmentId);
  }, [appointmentId]);

  const fetchAppointmentData = async (id) => {
    try {
      const response = await Service.appointmentDetails({ appointmentId: id });
      if (response?.status === 200 && response.data) {
        setAppointment(response?.data);
      }
    } catch (err) {
      showToast("error", err?.response?.message || "Failed to fetch details");
    }
  };

  // start video consult
  // const handleVideoConsultation = () => {
  //   setInCall(true);
  //   commRef.current?.startCall();
  //   setTimeout(() => {
  //     commRef.current?.startCall();
  //   }, 0);
  // };

  // const handleReschedule = () => {
  // reschedule logic
  // };

  // Cancel consultation
  const handleCancelAppointment = async () => {
    let reqData = {
      appointmentId: appointmentId,
      cancelReason: cancelReason,
    };
    try {
      const response = await Service.cancelAppointment(reqData);
      if (response?.status === 200 && response.data) {
        showToast("success", response?.message);
        setShowCancelModal(false);
        fetchAppointmentData(appointmentId);
      }
    } catch (err) {
      showToast("error", err?.response?.message);
      setShowCancelModal(false);
    }
  };

   const handleCompletedAppointment = async () => {
    let reqData = {
      appointmentId: appointmentId
    };
    try {
      const response = await Service.completedAppointment(reqData);
      if (response?.status === 200 && response.data) {
        showToast("success", response?.message);
        fetchAppointmentData(appointmentId);
      }
    } catch (err) {
      showToast("error", err?.response?.message);
      setShowCancelModal(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  // Function to calculate age from date range
  // const calculateAge = (dob) => {
  //   if (!dob) return "";
  //   const birthDate = new Date(dob);
  //   const today = new Date();
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const monthDiff = today.getMonth() - birthDate.getMonth();
  //   if (
  //     monthDiff < 0 ||
  //     (monthDiff === 0 && today.getDate() < birthDate.getDate())
  //   ) {
  //     age--;
  //   }
  //   return age;
  // };

  // Format date from YYYY-MM-DD to DD-MM-YYYY
  // const formatDate = (date) => {
  //   if (!date) return "-";
  //   const dateObj = new Date(date);
  //   if (isNaN(dateObj)) return "-";
  //   const day = String(dateObj.getDate()).padStart(2, "0");
  //   const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  //   const year = dateObj.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
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

  // Function to calculate duration from time range (e.g., "12:00-12:30")
  const calculateDuration = (timeRange) => {
    if (!timeRange || typeof timeRange !== "string") return "-";
    const [startTime, endTime] = timeRange.split("-");
    if (!startTime || !endTime) return "-";

    // Parse start and end times (HH:MM)
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    // Validate parsed times
    if (
      isNaN(startHours) ||
      isNaN(startMinutes) ||
      isNaN(endHours) ||
      isNaN(endMinutes)
    ) {
      return "-";
    }

    // Convert to minutes since midnight
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    // Calculate duration
    const duration = endTotalMinutes - startTotalMinutes;
    return duration >= 0 ? duration : "-"; // Return "-" if negative duration
  };
  return (
    <>
      {!inCall ? (
        <div className="container-fluid p-4 appointment-details-container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title mb-0">
              Details: {appointment?.appointment_id}
            </h5>
            <button
              className="btn btn-primary new-appointment-btn"
              style={{ marginRight: "4px" }}
              onClick={goBack}
            >
              <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
              Back
            </button>
          </div>

          {/* Doctor and Patient Info */}
          <div className="row mb-4">
            {userInfo?.role !== "Provider" && (
              <div className="col-md-6">
                <div className="info-card doctor-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center cardDetails">
                      <div className="info-icon doctor-icon me-3">
                        <i className="fas fa-user-md"></i>
                      </div>
                      <div>
                        <h6 className="info-name mb-1">
                          {appointment?.providerId?.fullName}
                        </h6>
                        <p className="info-role mb-2">
                          {appointment?.providerId?.speciality?.join(", ")}
                        </p>
                        <div className="info-details">
                          <div className="info-item mb-1">
                            <i className="fas fa-briefcase me-2"></i>
                            <span>
                              {appointment?.providerId?.experience} years
                              experience
                            </span>
                          </div>
                          <div className="info-item mb-1">
                            <i className="fas fa-phone me-2"></i>
                            <span>{appointment?.providerId?.mobile}</span>
                          </div>
                          <div className="info-item">
                            <i className="fas fa-envelope me-2"></i>
                            <span>{appointment?.providerId?.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="col-md-6">
              <div className="info-card patient-card">
                <div className="card-body">
                  <div className="d-flex align-items-center cardDetails">
                    <div className="info-icon patient-icon me-3">
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <h6 className="info-name mb-1">
                        {appointment?.patientId?.fullName}
                      </h6>
                      <div className="info-details">
                        <div className="info-item mb-1">
                          <i className="fas fa-phone me-2"></i>
                          <span>{appointment?.patientId?.mobile}</span>
                        </div>
                        <div className="info-item">
                          <i className="fas fa-envelope me-2"></i>
                          <span>{appointment?.patientId?.email}</span>
                        </div>
                        {/* {appointment?.patientId?.dob && (
                          <div className="info-item mb-1">
                            <i className="fas fa-calendar me-2"></i>
                            <span>
                              {typeof calculateAge(
                                appointment?.patientId?.dob
                              ) === "number"
                                ? `${calculateAge(appointment?.patientId?.dob)} years old`
                                : "-"}
                            </span>
                          </div>
                        )} */}
                        {appointment?.patientId?.gender && (
                          <div className="info-item mb-1">
                            <i className="fas fa-person me-2"></i>
                            <span>
                              {appointment?.patientId?.gender
                                ? appointment?.patientId?.gender
                                : "-"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Information */}
          <div className="card appointment-info-card mb-4">
            <div className="card-body">
              <h5 className="section-title mb-4">Consultation Information</h5>
              <div className="row">
                <div className="col-md-4">
                  <div className="appointment-detail">
                    <label className="detail-label">Consultation For</label>
                    <p className="detail-value">
                      {appointment?.consultId?.consultFor}
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="appointment-detail">
                    <label className="detail-label">Full Name</label>
                    <p className="detail-value">
                      {appointment?.consultId?.firstName} {appointment?.consultId?.lastName}
                    </p>
                  </div>
                </div>
                {/* <div className="col-md-4">
                  <div className="appointment-detail">
                    <label className="detail-label">DOB</label>
                    <p className="detail-value">
                      {appointment?.consultId?.dob}
                    </p>
                  </div>
                </div> */}
                <div className="col-md-4">
                  <div className="appointment-detail">
                    <label className="detail-label">Reason</label>
                    <p className="detail-value">
                      {appointment?.consultId?.reason}
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="appointment-detail">
                    <label className="detail-label">Status</label>
                    <span className="detail-value">
                      {appointment?.consultId?.isMobileVerified
                        ? "Verified"
                        : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="appointment-detail">
                    <label className="detail-value">Description:</label>
                    <p>
                      {appointment?.consultId?.description1}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Information */}
          <div className="card appointment-info-card mb-4">
            <div className="card-body">
              <h5 className="section-title mb-4">Appointment Information</h5>
              <div className="row">
                <div className="col-md-4">
                  <div className="appointment-detail">
                    <label className="detail-label">Date & Time</label>
                   {/* <p className="detail-value">
                      {formatDate(appointment?.consultationDate)} •{" "}
                      {appointment?.consultationTime}
                    </p> */}
                    <p className="detail-value">
                      {formatDate(appointment?.consultationDate)} •{" "}
                      {convertTime(appointment?.consultationDate, appointment?.consultationTime)}
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="appointment-detail">
                    <label className="detail-label">Duration</label>
                    <p className="detail-value">
                      {calculateDuration(appointment?.consultationTime)} minutes
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="appointment-detail">
                    <label className="detail-label">Status</label>
                    <span
                      className={`status-badge status-${appointment?.status?.toLowerCase() || "unknown"}`}
                    >
                      {appointment?.status === "APPROVED"
                        ? "BOOKED"
                        : appointment?.status || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="row mb-4">
            <div className="col-md-4">
            </div>
            {userInfo?.role !== "Admin" &&
              appointment?.status === "APPROVED" && (
                <div className="col-md-4">
                  <button
                    className="btn btn-primary action-btn-primary w-100"
                    onClick={handleCompletedAppointment}
                  >
                    <i className="fas fa-video me-2"></i>
                    Completed Appointment
                  </button>
                </div>
              )}
            {appointment?.status !== "COMPLETED" &&
              appointment?.status !== "CANCELLED" && (
                <>
                  <div className="col-md-4">
                    <button
                      className="btn btn-danger action-btn-danger w-100"
                      onClick={() => setShowCancelModal(true)}
                    >
                      <i className="fas fa-times me-2"></i>
                      Cancel Appointment
                    </button>
                  </div>
                </>
              )}
          </div>
          {/* Diagnosis Records */}
          {/* <Diagnosis
            appointmentId={appointmentId}
            appointmentStatus={appointment?.status}
          /> */}
          {/* Cancel Appointment Modal */}
          {showCancelModal && (
            <div className="modal-overlay">
              <div className="modal-container">
                <h5>Are you sure you want to cancel this appointment?</h5>
                <textarea
                  className="form-control mt-3"
                  placeholder="Enter reason for cancellation..."
                  rows="3"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <div className="d-flex justify-content-end mt-3">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setShowCancelModal(false)}
                  >
                    No
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleCancelAppointment}
                  >
                    Yes, Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Communication ref={commRef} onEndCall={() => setInCall(false)} />
      )}
    </>
  );
};

export default AppointmentDetails;
