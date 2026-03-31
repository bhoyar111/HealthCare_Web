import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './CalendarScheduler.css';
import Service from "../Services";

const CalendarScheduler = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('Week');
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const calendarContentRef = useRef(null);
  const scrollToCurrentTime = () => {
    if (!calendarContentRef.current) return;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const minutesSinceMidnight = currentHour * 60 + currentMinutes;
    // 1 minute = 1px (since your slot height is based on minutes in getEventStyle)
    const scrollPosition = minutesSinceMidnight;
    calendarContentRef.current.scrollTop = scrollPosition - 100; // offset so it's not at the very top
  };
  const [stats, setStats] = useState({
    totalAppointment: 0,
    totalApproved: 0,
    totalCancelled: 0,
    totalCompleted: 0,
    totalMissed: 0,
    totalPending: 0
  });

  const appointmentListing = async () => {
    try {
      setLoading(true);
      const reqData = {
        limit: 100, // Get more appointments for calendar view
        page: 1,
        patientName: "",
        providerName: "",
        status: "ALL",
        fromDate: "",
        toDate: ""
      };
      const response = await Service.getAllAppointmentList(reqData);
      if (response?.status === 200 && response?.data) {
        const {
          result = [],
          totalAppointment = 0,
          totalApproved = 0,
          totalCancelled = 0,
          totalCompleted = 0,
          totalMissed = 0,
          totalPending = 0
        } = response.data;

        setAppointments(result);
        setStats({
          totalAppointment,
          totalApproved,
          totalCancelled,
          totalCompleted,
          totalMissed,
          totalPending
        });
      }
    } catch (err) {
      // console.error("Error fetching appointments:", err);
      // showToast("error", err?.response?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    appointmentListing();
  }, []);
  useEffect(() => {
    if (appointments.length > 0) {
      scrollToCurrentTime();
    }
  }, [appointments]);

  // Transform API appointments to calendar events
  const transformAppointmentsToEvents = () => {
    return appointments.map(appointment => {
      const [startTime, endTime] = appointment.consultationTime.split('-');
      const appointmentDate = new Date(appointment.consultationDate);
      // Get status color
      const getStatusColor = (status) => {
        switch (status) {
          case 'APPROVED': return '#6832C4';
          case 'COMPLETED': return '#28a745';
          case 'CANCELLED': return '#e57777';
          case 'PENDING': return '#d97706';
          case 'MISSED': return '#7c2d12';
          default: return '#6b7280';
        }
      };

      return {
        id: appointment?._id,
        appointmentId: appointment?.appointment_id,
        title: `${appointment?.patient?.fullName}`,
        startTime: startTime,
        endTime: endTime,
        date: appointmentDate,
        color: getStatusColor(appointment?.status),
        status: appointment?.status,
        patient: appointment?.patient,
        provider: appointment?.provider,
        originalData: appointment
      };
    });
  };
  const events = transformAppointmentsToEvents();
  // Time slots for the calendar
  // Generate full 24-hour slots
  const generate24HrTimeSlots = (interval = 60) => {
    const slots = [];
    const formatTime = (hour, minute) => {
      return `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
    };

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        slots.push(formatTime(hour, minute));
      }
    }

    return slots;
  };
 // Show full day with hourly slots
  const timeSlots = generate24HrTimeSlots(60);
  // Get week dates
  const getWeekDates = (date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(diff + i);
      week.push(new Date(currentDate));
    }
    return week;
  };
  const weekDates = getWeekDates(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Navigation functions
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'Week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else if (viewMode === 'Day') {
      newDate.setDate(currentDate.getDate() - 1);
    } else { // Month
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'Week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else if (viewMode === 'Day') {
      newDate.setDate(currentDate.getDate() + 1);
    } else { // Month
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event =>
      event.date.toDateString() === date.toDateString()
    );
  };
  // Format date range
  const getDateRangeText = () => {
    if (viewMode === 'Week') {
      const startDate = weekDates[0];
      const endDate = weekDates[6];
      return `Week of ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else if (viewMode === 'Day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      return currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    }
  };
  // Calculate event position and height
  const getEventStyle = (event) => {
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours + minutes / 60;
    };
    const startTime = parseTime(event.startTime);
    const endTime = parseTime(event.endTime);
    const duration = endTime - startTime;
    // Adjust for 8 AM start
    return {
      top: `${startTime * 60}px`,
      height: `${duration * 90}px`,
      backgroundColor: event.color,
      left: '4px',
      right: '4px'
    };
  };
  // Get events count for a date
  const getEventCountForDate = (date) => {
    return getEventsForDate(date).length;
  };
  const renderWeekView = () => (
    <div className="calendar-grid">
      <div className="time-column">
        <div className="time-header"></div>
        {timeSlots.map((time, index) => (
          <div key={index} className="time-slot">
            <span className="time-label">{time}</span>
          </div>
        ))}
      </div>
      {weekDates.map((date, dayIndex) => (
        <div key={dayIndex} className="day-column">
          <div className="day-header">
            <div className="day-name mt-2">{dayNames[dayIndex]}</div>
            <div className="day-number">{date.getDate()}</div>
            <div className="event-count mb-2">({getEventCountForDate(date)} appointments)</div>
          </div>
          <div className="day-events-container">
            {timeSlots.map((time, timeIndex) => (
              <div key={timeIndex} className="time-slot-container">
                <div className="time-slot-line"></div>
              </div>
            ))}
            {getEventsForDate(date).map(event => (
              <Link key={event.id} to={`/appointment/details/${event.id}`}>
                <div
                  className="calendar-event"
                  style={getEventStyle(event)}
                  title={`${event.appointmentId} - ${event.status}`}
                >
                  <div className="event-time">
                    {event.startTime} - {event.endTime}
                  </div>
                  <div className="event-title">{event.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  const renderDayView = () => (
    <div className="calendar-grid day-view">
      <div className="time-column">
        <div className="time-header"></div>
        {timeSlots.map((time, index) => (
          <div key={index} className="time-slot">
            <span className="time-label">{time}</span>
          </div>
        ))}
      </div>
      <div className="day-column single-day">
        <div className="day-header">
          <div className="day-name">{dayNames[currentDate.getDay()]}</div>
          <div className="day-number">{currentDate.getDate()}</div>
          <div className="event-count">({getEventCountForDate(currentDate)} appointments)</div>
        </div>
        <div className="day-events-container">
          {timeSlots.map((time, timeIndex) => (
            <div key={timeIndex} className="time-slot-container">
              <div className="time-slot-line"></div>
            </div>
          ))}
          {getEventsForDate(currentDate).map(event => (
            <Link key={event.id} to={`/appointment/details/${event.id}`}>
              <div
                className="calendar-event"
                style={getEventStyle(event)}
                title={`${event.appointmentId} - ${event.status}`}
              >
                <div className="event-time">
                  {event.startTime} - {event.endTime}
                </div>
                <div className="event-title">{event.title} | {event.status}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
  // Get calendar days for month view
  const getMonthCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    const days = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };
  const monthDays = getMonthCalendarDays(currentDate);
  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  // Check if date is in current month
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };
  const renderMonthView = () => {
    const weeks = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      weeks.push(monthDays.slice(i, i + 7));
    }
    return (
      <div className="month-view">
        <div className="month-calendar">
          <div className="month-header">
            {dayNames.map(day => (
              <div key={day} className="month-day-name">
                {day}
              </div>
            ))}
          </div>
          <div className="month-body">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="month-week">
                {week.map((day, dayIndex) => {
                  const dayEvents = getEventsForDate(day);
                  const isCurrentMonthDay = isCurrentMonth(day);
                  const isTodayDate = isToday(day);
                  return (
                    <div
                      key={dayIndex}
                      className={`month-day ${!isCurrentMonthDay ? 'other-month' : ''} 
                        ${isTodayDate ? 'today' : ''} 
                        ${dayEvents.length > 0 ? 'has-events' : ''} 
                        ${selectedDate?.toDateString() === day.toDateString() ? 'selected-day' : ''}`}
                      onClick={() => {
                        setSelectedDate(day);
                        setCurrentDate(day);
                        setViewMode('Day');
                      }}
                    >
                      <div className="month-day-number">
                        {day.getDate()}
                      </div>
                      {dayEvents.length > 0 && (
                        <div className="month-events">
                          {dayEvents.slice(0, 2).map((event) => (
                            <Link key={event.id} to={`/appointment/details/${event.id}`}
                              className="fw-semibold text-decoration-none">
                              <div
                                className="month-event"
                                style={{ backgroundColor: event.color }}
                                title={`${event.appointmentId} - ${event.patient?.fullName} - ${event.status}`}
                              >
                                <span className="month-event-title">
                                  {event.startTime} - {event.patient?.fullName}
                                </span>
                              </div>
                            </Link>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="month-event-more">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                      {dayEvents.length > 0 && (
                        <div className="event-count-badge">
                          {dayEvents.length}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  if (loading) {
    return (
      <div className="calendar-scheduler">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading appointments...</span>
          </div>
          <p className="mt-3 text-muted">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-scheduler">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="card-title mb-0">Calendar</h5>
        <div className="d-flex align-items-center">
          {/* Stats summary */}
          <div className="me-3 text-muted" style={{fontSize: '14px'}}>
            Total: {stats.totalAppointment} | Booked: {stats.totalApproved} | Cancelled: {stats.totalCancelled} | Completed: {stats.totalCompleted}
          </div>
          <button className="btn btn-primary new-appointment-btn" title="List View"
            onClick={() => navigate(`/appointment`)}>
            <i className="fas fa-list"></i>
          </button>
        </div>
      </div>
      {/* Header */}
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button className="nav-btn" onClick={navigatePrevious}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h2 className="calendar-title">{getDateRangeText()}</h2>
          <button className="nav-btn" onClick={navigateNext}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="calendar-controls">
          <button className="today-btn" onClick={goToToday}>
            Today
          </button>
          <div className="view-tabs">
            {['Month', 'Week', 'Day'].map(mode => (
              <button
                key={mode}
                className={`view-tab ${viewMode === mode ? 'active' : ''}`}
                onClick={() => setViewMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Calendar Content */}
      <div className="calendar-content">
        {appointments.length === 0 ? (
          <div className="text-center p-5">
            <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
            <p className="text-muted">No appointments found</p>
          </div>
        ) : (
          <>
            {viewMode === 'Week' && renderWeekView()}
            {viewMode === 'Day' && renderDayView()}
            {viewMode === 'Month' && renderMonthView()}
          </>
        )}
      </div>
      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-track">
          <div className="scroll-thumb"></div>
        </div>
      </div>
    </div>
  );
};

export default CalendarScheduler;
