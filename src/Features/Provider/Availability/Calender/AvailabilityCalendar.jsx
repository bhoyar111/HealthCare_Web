import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import "./AvailabilityCalendar.css";
import Service from "../../Service/Services";
import showToast from "../../../Common/Shared/Utils/ToastNotification";
import Availability from "../Availability";

const localizer = momentLocalizer(moment);

const AvailabilityCalendar = () => {
  const providerId = useSelector((state) => state?.auth?.user?.userData?._id);

  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [monthlyAvailability, setMonthlyAvailability] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingDate, setEditingDate] = useState(null);
  const [formData, setFormData] = useState({
    date: moment().format("YYYY-MM-DD"),
    is_available: true,
    slot_interval: "30",
    slots: [{ start_time: "09:00", end_time: "17:00" }],
  });

  const [summary, setSummary] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
  });

  /** Fetch Availability **/
  const fetchAvailability = async () => {
    try {
      const res = await Service.getProviderMonthlySlots({ providerId });
      if (res?.success === true && res?.data?.monthly_availability) {
        const availabilities = res.data.monthly_availability;
        setMonthlyAvailability(availabilities);

        const mappedEvents = availabilities.flatMap((day) => {
          if (!day.is_available || !Array.isArray(day.slots)) return [];
          return day.slots.map((slot, idx) => {
            const dayOnly =
              typeof day.date === "string"
                ? day.date.split("T")[0]
                : new Date(day.date).toISOString().split("T")[0];
            const start = new Date(`${dayOnly}T${slot.start_time}:00`);
            const end = new Date(`${dayOnly}T${slot.end_time}:00`);
            return {
              id: slot._id || `${dayOnly}-${idx}`,
              title: `${slot.start_time} - ${slot.end_time}`,
              start,
              end,
              allDay: false,
            };
          });
        });
        setEvents(mappedEvents);
        const range = getRangeForView(view, date);
        calculateSummary(mappedEvents, range.start, range.end);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      showToast("error", "Internal Server Error");
    }
  };

  useEffect(() => {
    if (providerId) fetchAvailability();
    const refreshListener = () => fetchAvailability();
    window.addEventListener("refreshMonthlyAvailability", refreshListener);
    return () =>
      window.removeEventListener("refreshMonthlyAvailability", refreshListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId]);

  /** Calendar Helpers **/
  const getRangeForView = (v, d) => {
    const current = new Date(d);
    if (v === Views.DAY) {
      const start = new Date(current.setHours(0, 0, 0, 0));
      const end = new Date(current.setHours(23, 59, 59, 999));
      return { start, end };
    }
    if (v === Views.WEEK) {
      const day = current.getDay();
      const start = new Date(current);
      start.setDate(current.getDate() - day);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    if (v === Views.MONTH) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const first = new Date(year, month, 1);
      const last = new Date(year, month + 1, 0);
      const monthStart = new Date(first);
      monthStart.setDate(first.getDate() - first.getDay());
      monthStart.setHours(0, 0, 0, 0);
      const monthEnd = new Date(last);
      monthEnd.setDate(last.getDate() + (6 - last.getDay()));
      monthEnd.setHours(23, 59, 59, 999);
      return { start: monthStart, end: monthEnd };
    }
    const s = new Date(current.setHours(0, 0, 0, 0));
    const e = new Date(current.setHours(23, 59, 59, 999));
    return { start: s, end: e };
  };

  const calculateSummary = (evts, start, end) => {
    const filtered = evts.filter((e) => e.start >= start && e.start <= end);
    const total = filtered.length;
    const available = total;
    setSummary({ total, available, unavailable: 0 });
  };

  useEffect(() => {
    const range = getRangeForView(view, date);
    calculateSummary(events, range.start, range.end);
  }, [events, view, date]);

  /** Calendar Click Handler **/
  const handleSelectSlot = (slotInfo) => {
    const clickedDate = moment(slotInfo.start).format("YYYY-MM-DD");

    // 🔸 Prevent editing or adding for past dates
    if (moment(clickedDate).isBefore(moment(), "day")) {
      showToast("warning", "Past dates cannot be edited or updated.");
      return;
    }

    const existing = monthlyAvailability.find(
      (day) => moment(day.date).format("YYYY-MM-DD") === clickedDate
    );

    if (existing) {
      // Edit existing
      setFormData({
        date: clickedDate,
        is_available: existing.is_available,
        slot_interval: existing.slot_interval || "30",
        slots: existing.slots || [],
      });
    } else {
      // Add new
      setFormData({
        date: clickedDate,
        is_available: true,
        slot_interval: "30",
        slots: [{ start_time: "09:00", end_time: "17:00" }],
      });
    }

    setEditingDate(clickedDate);
    setShowPopup(true);
  };

  /** Field Handlers **/
  const handleFieldChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const updateSlot = (index, field, value) => {
    const updatedSlots = [...formData.slots];
    updatedSlots[index][field] = value;
    setFormData((prev) => ({ ...prev, slots: updatedSlots }));
  };

  const addSlot = () => {
    setFormData((prev) => ({
      ...prev,
      slots: [...prev.slots, { start_time: "10:00", end_time: "11:00" }],
    }));
  };

  const removeSlot = (index) => {
    const updatedSlots = [...formData.slots];
    updatedSlots.splice(index, 1);
    setFormData((prev) => ({ ...prev, slots: updatedSlots }));
  };

  /** Save **/
  const handleSave = async () => {
    const payload = {
      providerId,
      slot_interval: formData.slot_interval,
      availability: (() => {
        const idx = monthlyAvailability.findIndex(
          (d) => moment(d.date).format("YYYY-MM-DD") === formData.date
        );
        if (idx !== -1) {
          const copy = [...monthlyAvailability];
          copy[idx] = formData;
          return copy;
        }
        return [...monthlyAvailability, formData];
      })(),
    };

    try {
      const response = await Service.saveProviderMonthlyAvailability(payload);
      if (response?.status === 200 || response?.success) {
        showToast("success", "Availability saved successfully");
        fetchAvailability();
        setShowPopup(false);
      } else {
        showToast("error", response?.message || "Save failed");
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="availability-calendar-container">
      <div className="calendar-header">
        <h2 className="calendar-title">Provider Availability</h2>
        <div className="header-actions">
          <div>
            Total Slots: <strong>{summary.total}</strong>
          </div>
          <div style={{ color: "#003b49" }}>
            Available: <strong>{summary.available}</strong>
          </div>
          <div style={{ color: "#666" }}>
            Unavailable: <strong>{summary.unavailable}</strong>
          </div>
        </div>
      </div>

      <div className="weekly-available-set mb-4">
        <Availability />
      </div>

      <div className="calendar-card">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          view={view}
          date={date}
          onNavigate={setDate}
          onView={setView}
          defaultView={Views.MONTH}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          style={{ height: 600 }}
          eventPropGetter={(event, start, end, isSelected) => {
            const now = new Date();
            const isPast = end < now; // check if event has already ended
            return {
              style: {
                backgroundColor: isPast ? "#ccc" : "#28a745",
                color: isPast ? "#000" : "#fff",
                borderRadius: "20px",
                padding: "4px 8px",
                fontSize: "13px",
                textAlign: "center",
              },
            };
          }}
        />
      </div>

      {/* Popup for Add/Edit */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="availability-popup">
            <div className="popup-header">
              <h2>
                {editingDate ? "Provider Availability" : "Add Availability"}
              </h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowPopup(false);
                  setFormData({
                    date: "",
                    is_available: true,
                    slot_interval: "30",
                    slots: [{ start_time: "09:00", end_time: "17:00" }],
                  });
                  setEditingDate(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input type="date" value={formData.date} readOnly />
            </div>

            <div className="form-group checkbox-group-available">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) =>
                  handleFieldChange("is_available", e.target.checked)
                }
              />
              <label style={{ marginLeft: "6px" }}>Is Available</label>
            </div>

            <div className="form-group">
              <label>Booking Slot Interval</label>
              <select
                value={formData.slot_interval}
                onChange={(e) =>
                  handleFieldChange("slot_interval", e.target.value)
                }
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
              </select>
            </div>

            <div className="form-group">
              <label>Slots</label>
              {formData.slots.map((slot, i) => (
                <div key={i} className="slot-row">
                  <input
                    type="time"
                    value={slot.start_time}
                    onChange={(e) =>
                      updateSlot(i, "start_time", e.target.value)
                    }
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={slot.end_time}
                    onChange={(e) => updateSlot(i, "end_time", e.target.value)}
                  />
                  {formData.slots.length > 1 && (
                    <button
                      className="remove-slot"
                      onClick={() => removeSlot(i)}
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button className="btn-sm add-slot" onClick={addSlot}>
                + Add Slot
              </button>
            </div>

            <div
              className="form-actions"
              style={{ justifyContent: "flex-end" }}
            >
              <button
                className="btn cancel"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button className="btn save" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
