import React, { useEffect, useState } from "react";
import "./Availability.css";

import Service from "../Service/Services";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import { useSelector } from "react-redux";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Availability() {
  const loggedInUserId = useSelector(
    (state) => state?.auth?.user?.userData?._id
  );
  // const [availableSlot, setAvailableSlot] = useState(null);
  const [weekAvailability, setWeekAvailability] = useState(
    weekdays.map((day) => ({
      day,
      checked: true,
      startTime: "09:00",
      endTime: "17:00",
    }))
  );
  useEffect(() => {
    if (loggedInUserId) fetchUserData(loggedInUserId);
  }, [loggedInUserId]);
  const formatAvailability = () => {
    return weekAvailability.map((day) => ({
      day: day.day.toLowerCase(),
      is_available: day.checked,
      start_time: day.checked ? day.startTime : "",
      end_time: day.checked ? day.endTime : "",
    }));
  };

  const [slotInterval, setSlotInterval] = useState("5");

  const handleWeekdayChange = (index, field, value) => {
    const newAvailability = [...weekAvailability];
    newAvailability[index][field] = value;
    // Clear start/end time when unchecked
    if (field === "checked" && !value) {
      newAvailability[index].startTime = "";
      newAvailability[index].endTime = "";
    }
    setWeekAvailability(newAvailability);
  };

  const handleSave = async () => {
    const formatted = formatAvailability();

    // Validation: end_time should not be smaller than start_time
    for (const day of formatted) {
      if (day.is_available && day.start_time && day.end_time) {
        // Case 1: End < Start
        if (day.end_time < day.start_time) {
          showToast(
            "error",
            `End time cannot be earlier than start time for ${day.day.toUpperCase()}`
          );
          return;
        }
        // Case 2: Any "00:00" start/end
        if (day.start_time === "00:00" || day.end_time === "00:00") {
          showToast(
            "error",
            `Start time and End time cannot be 00:00 for ${day.day.toUpperCase()}`
          );
          return;
        }
      }
    }
    const payload = {
      providerId: loggedInUserId, // ← Replace this dynamically
      slot_interval: slotInterval,
      week_days: formatted,
    };
    try {
      const response = await Service.saveProviderAvailability(payload);
      if (response?.status === 200) {
        showToast("success", response?.message || "Availability saved");
        fetchUserData(loggedInUserId);
        window.dispatchEvent(new CustomEvent("refreshMonthlyAvailability"));
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
  const fetchUserData = async (id) => {
    try {
      const response = await Service.getByIdProvider({ userId: id });
      if (response?.status === 200 && response.data) {
        const availableSlot__ = response?.data?.availableSlot;
        // setAvailableSlot(availableSlot__);
        if (availableSlot__) {
          // Map week_days to set in state
          const updatedWeekAvailability = weekdays.map((day) => {
            const lowerDay = day.toLowerCase();
            const matchedDay = availableSlot__?.week_days.find(
              (d) => d.day === lowerDay
            );
            return {
              day,
              checked: matchedDay?.is_available ?? false,
              startTime: matchedDay?.start_time || "",
              endTime: matchedDay?.end_time || "",
            };
          });
          setWeekAvailability(updatedWeekAvailability);
          setSlotInterval(availableSlot__?.slot_interval || "5");
        }
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message);
    }
  };
  return (
    <div className="availability-container">
      <div className="inner-availability-section">
        <h2>Weekly Default Hours</h2>
        <div className="weekdays  d-flex gap flex-wrap">
          {weekAvailability.map((day, index) => (
            <div className="weekday" key={day.day}>
              <label className="weekday-label">
                <input
                  type="checkbox"
                  checked={day.checked}
                  onChange={(e) =>
                    handleWeekdayChange(index, "checked", e.target.checked)
                  }
                />
                {day.day}
              </label>

              <input
                type="time"
                value={day.startTime}
                disabled={!day.checked}
                onChange={(e) =>
                  handleWeekdayChange(index, "startTime", e.target.value)
                }
              />
              <input
                type="time"
                value={day.endTime}
                disabled={!day.checked}
                onChange={(e) =>
                  handleWeekdayChange(index, "endTime", e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>
      <div className="form-actions">
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
