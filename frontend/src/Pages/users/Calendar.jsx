// src/components/Calendar.jsx
import React, { useState, useEffect } from "react";
import "./calendar.css";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [bookingData, setBookingData] = useState({
    therapistId: "",
    date: "",
    startTime: "",
    endTime: "",
    description: ""
  });

  /** -------------------- FETCH USER & THERAPISTS -------------------- */
  useEffect(() => {
    fetchCurrentUser();
    fetchTherapists();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTherapists = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/therapists");
      if (!res.ok) throw new Error("Failed to fetch therapists");
      const data = await res.json();
      setTherapists(data);
    } catch (err) {
      console.error(err);
    }
  };

  /** -------------------- GENERATE TIME SLOTS -------------------- */
  const generateTimeSlots = () => {
    const slots = [];
    let hour = 8;
    let minute = 0;

    while (hour < 17) {
      const timeString = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      slots.push({
        time: timeString,
        display: new Date(`2000-01-01T${timeString}`)
          .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      });
      minute += 30;
      if (minute === 60) {
        hour += 1;
        minute = 0;
      }
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  /** -------------------- FETCH BOOKED SLOTS -------------------- */
  const fetchBookedSlots = async (therapistId, date) => {
    if (!therapistId || !date) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/available/${therapistId}?date=${date}`
      );
      if (res.ok) {
        const data = await res.json();
        setBookedSlots(data.bookedSlots || []);
      }
    } catch (err) {
      console.error("Error fetching booked slots:", err);
    } finally {
      setLoading(false);
    }
  };

  /** -------------------- CHECK IF TIME SLOT IS AVAILABLE -------------------- */
  const isTimeSlotAvailable = (time) => {
    // Check if this time falls within any booked slot
    return !bookedSlots.some(slot => 
      time >= slot.startTime && time < slot.endTime
    );
  };

  /** -------------------- GET ALL AVAILABLE TIME SLOTS -------------------- */
  const getAvailableTimeSlots = () => {
    return allTimeSlots.filter(slot => isTimeSlotAvailable(slot.time));
  };

  /** -------------------- GET UNAVAILABLE TIME SLOTS -------------------- */
  const getUnavailableTimeSlots = () => {
    return allTimeSlots.filter(slot => !isTimeSlotAvailable(slot.time));
  };

  /** -------------------- BOOKING -------------------- */
  const calculatePrice = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    return hours * 800;
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    return hours;
  };

  const handleBooking = async () => {
    if (!user) return alert("Please log in to book an appointment");
    if (!bookingData.therapistId || !bookingData.date || !bookingData.startTime || !bookingData.endTime)
      return alert("Select therapist, date, start time and end time");

    if (bookingData.startTime >= bookingData.endTime) {
      return alert("End time must be after start time");
    }

    // Check if the selected time range is still available
    const isRangeAvailable = (() => {
      const times = allTimeSlots.map(s => s.time);
      const startIndex = times.indexOf(bookingData.startTime);
      const endIndex = times.indexOf(bookingData.endTime);
      
      for (let i = startIndex; i < endIndex; i++) {
        if (!isTimeSlotAvailable(times[i])) {
          return false;
        }
      }
      return true;
    })();

    if (!isRangeAvailable) {
      return alert("Sorry, some of the selected time slots are no longer available. Please choose a different time.");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const payload = {
        userId: user.id,
        therapistId: parseInt(bookingData.therapistId),
        bookingDate: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        description: bookingData.description || ""
      };

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Booking failed");
      }

      alert("Booking request submitted! Awaiting admin approval.");
      setShowBookingModal(false);
      resetBookingForm();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetBookingForm = () => {
    setBookingData({
      therapistId: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
    });
    setBookedSlots([]);
  };

  /** -------------------- HANDLERS -------------------- */
  const handleDayClick = (day) => {
    const dateKey = formatDateKey(day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(dateKey) < today) return alert("Cannot select past dates");
    setSelectedDate(dateKey);
    setBookingData((prev) => ({ ...prev, date: dateKey }));
    setShowBookingModal(true);
  };

  const handleTherapistChange = (e) => {
    const therapistId = e.target.value;
    setBookingData((prev) => ({
      ...prev,
      therapistId,
      startTime: "",
      endTime: "",
    }));
    if (therapistId && selectedDate) {
      fetchBookedSlots(therapistId, selectedDate);
    }
  };

  const handleStartTimeChange = (e) => {
    setBookingData((prev) => ({
      ...prev,
      startTime: e.target.value,
      endTime: "",
    }));
  };

  const handleEndTimeChange = (e) => {
    setBookingData((prev) => ({
      ...prev,
      endTime: e.target.value,
    }));
  };

  /** -------------------- CALENDAR -------------------- */
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    "January","February","March","April","May","June","July","August","September","October","November","December"
  ];
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const formatDateKey = (day) => `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  const todayKey = formatDateKey(new Date().getDate());

  const goToPreviousMonth = () => setCurrentDate(new Date(year, month-1,1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month+1,1));
  const goToToday = () => setCurrentDate(new Date());

  // Filter available end times (must be after start time and all slots in between must be available)
  const getAvailableEndTimes = () => {
    if (!bookingData.startTime) return [];
    
    const startIndex = allTimeSlots.findIndex(s => s.time === bookingData.startTime);
    const availableEndTimes = [];
    
    for (let i = startIndex + 1; i < allTimeSlots.length; i++) {
      const slot = allTimeSlots[i];
      // Check if this slot and all slots between start and this slot are available
      let isRangeAvailable = true;
      for (let j = startIndex; j <= i; j++) {
        if (!isTimeSlotAvailable(allTimeSlots[j].time)) {
          isRangeAvailable = false;
          break;
        }
      }
      if (isRangeAvailable) {
        availableEndTimes.push(slot);
      } else {
        // Once we hit an unavailable slot, stop (can't skip over booked slots)
        break;
      }
    }
    
    return availableEndTimes;
  };

  /** -------------------- JSX -------------------- */
  return (
    <>
      <div className="soft-calendar">
        <div className="calendar-header">
          <h1>Calendar</h1>
          <div className="calendar-nav">
            <button onClick={goToPreviousMonth}>←</button>
            <span>{monthNames[month]} {year}</span>
            <button onClick={goToNextMonth}>→</button>
            <button onClick={goToToday}>Today</button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="weekdays">{days.map(d => <div key={d}>{d}</div>)}</div>
          <div className="days-grid">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i+1;
              const dateKey = formatDateKey(day);
              const isToday = dateKey === todayKey;
              const isSelected = selectedDate === dateKey;
              const isPast = new Date(dateKey) < new Date(new Date().setHours(0,0,0,0));
              return (
                <div key={day} className={`calendar-day ${isSelected?'selected':''} ${isToday?'today':''} ${isPast?'past-date':''}`} 
                     onClick={() => !isPast && handleDayClick(day)}>
                  <div>{day}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* -------- BOOKING MODAL -------- */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => {setShowBookingModal(false); resetBookingForm();}}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Appointment</h2>
              <button onClick={() => {setShowBookingModal(false); resetBookingForm();}}>×</button>
            </div>

            <div className="date-display">
              <strong>Session Date:</strong> {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric"
              })}
            </div>

            <div className="form-group">
              <label>Select Therapist</label>
              <select value={bookingData.therapistId} onChange={handleTherapistChange}>
                <option value="">Choose a therapist</option>
                {therapists.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.user?.name} - {t.specialization}
                  </option>
                ))}
              </select>
            </div>

            {bookingData.therapistId && (
              <>
                {/* Available Time Slots Display */}
                {loading ? (
                  <div className="loading-spinner">Loading available slots...</div>
                ) : (
                  <>
                    <div className="slots-container">
                      <div className="slots-section">
                        <h4>Available Slots ({getAvailableTimeSlots().length})</h4>
                        <div className="time-slots available">
                          {getAvailableTimeSlots().map(slot => (
                            <button
                              key={slot.time}
                              className={`time-slot available-slot ${bookingData.startTime === slot.time ? 'selected' : ''}`}
                              onClick={() => handleStartTimeChange({ target: { value: slot.time } })}
                            >
                              {slot.display}
                            </button>
                          ))}
                        </div>
                      </div>

                      {getUnavailableTimeSlots().length > 0 && (
                        <div className="slots-section">
                          <h4>Unavailable Slots</h4>
                          <div className="time-slots unavailable">
                            {getUnavailableTimeSlots().map(slot => (
                              <button
                                key={slot.time}
                                className="time-slot unavailable-slot"
                                disabled
                              >
                                {slot.display}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Start Time Dropdown */}
                    <div className="form-group">
                      <label>Start Time</label>
                      <select 
                        value={bookingData.startTime} 
                        onChange={handleStartTimeChange}
                      >
                        <option value="">Select start time</option>
                        {getAvailableTimeSlots().map(slot => (
                          <option key={slot.time} value={slot.time}>
                            {slot.display}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* End Time Dropdown */}
                    {bookingData.startTime && (
                      <div className="form-group">
                        <label>End Time</label>
                        <select 
                          value={bookingData.endTime} 
                          onChange={handleEndTimeChange}
                        >
                          <option value="">Select end time</option>
                          {getAvailableEndTimes().map(slot => (
                            <option key={slot.time} value={slot.time}>
                              {slot.display}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}

                {/* Session Summary */}
                {bookingData.startTime && bookingData.endTime && (
                  <div className="session-summary">
                    <h4>Session Summary</h4>
                    <div className="summary-row">
                      <span>Date:</span>
                      <strong>{new Date(bookingData.date).toLocaleDateString("en-US", {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Time:</span>
                      <strong>
                        {new Date(`2000-01-01T${bookingData.startTime}`).toLocaleTimeString("en-US", {
                          hour: 'numeric', minute: '2-digit', hour12: true
                        })} - {new Date(`2000-01-01T${bookingData.endTime}`).toLocaleTimeString("en-US", {
                          hour: 'numeric', minute: '2-digit', hour12: true
                        })}
                      </strong>
                    </div>
                    <div className="summary-row">
                      <span>Duration:</span>
                      <strong>{calculateDuration(bookingData.startTime, bookingData.endTime)} hours</strong>
                    </div>
                    <div className="summary-total">
                      <span>Total:</span>
                      <strong>R{calculatePrice(bookingData.startTime, bookingData.endTime)}</strong>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea 
                value={bookingData.description} 
                onChange={e => setBookingData(prev => ({...prev, description: e.target.value}))}
                placeholder="Brief description of your appointment reason..."
                rows="3"
              />
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => {setShowBookingModal(false); resetBookingForm();}}>
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleBooking} 
                disabled={!bookingData.therapistId || !bookingData.startTime || !bookingData.endTime || loading}>
                {loading ? "Booking..." : "Request Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Calendar;