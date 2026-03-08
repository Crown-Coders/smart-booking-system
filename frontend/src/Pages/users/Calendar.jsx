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
      if (!token) return;
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

  /** -------------------- UTILS -------------------- */
  const isTimeSlotAvailable = (time) => {
    return !bookedSlots.some(slot => 
      time >= slot.startTime && time < slot.endTime
    );
  };

  const getAvailableTimeSlots = () => {
    return allTimeSlots.filter(slot => isTimeSlotAvailable(slot.time));
  };

  const getUnavailableTimeSlots = () => {
    return allTimeSlots.filter(slot => !isTimeSlotAvailable(slot.time));
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    return (end - start) / (1000 * 60 * 60);
  };

  const calculatePrice = (startTime, endTime) => {
    const hours = calculateDuration(startTime, endTime);
    return hours * 800;
  };

  /** -------------------- BOOKING -------------------- */
  const handleBooking = async () => {
    if (!user) return alert("Please log in to book an appointment");
    if (!bookingData.therapistId || !bookingData.startTime || !bookingData.endTime) {
        return alert("Select therapist and time slot");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        userId: user.id,
        therapistId: bookingData.therapistId,
        bookingDate: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        description: bookingData.description,
        price: calculatePrice(bookingData.startTime, bookingData.endTime),
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

      const data = await res.json();

      // Trigger PayFast Payment
      const payfastRes = await fetch(
        `http://localhost:5000/api/bookings/payfast/${data.booking.id}`,
        { method: "POST" }
      );

      const { url } = await payfastRes.json();
      
      if (url) {
        window.location.href = url; // Redirect to PayFast
      } else {
        alert("Booking request submitted! Awaiting admin approval.");
        setShowBookingModal(false);
        resetBookingForm();
      }

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

  /** -------------------- CALENDAR LOGIC -------------------- */
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

  const getAvailableEndTimes = () => {
    if (!bookingData.startTime) return [];
    
    const startIndex = allTimeSlots.findIndex(s => s.time === bookingData.startTime);
    const availableEndTimes = [];
    
    for (let i = startIndex + 1; i < allTimeSlots.length; i++) {
      const slot = allTimeSlots[i];
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
        break;
      }
    }
    return availableEndTimes;
  };

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

      {showBookingModal && (
        <div className="modal-overlay" onClick={() => {setShowBookingModal(false); resetBookingForm();}}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Appointment</h2>
              <button onClick={() => {setShowBookingModal(false); resetBookingForm();}}>×</button>
            </div>

            <div className="date-display">
              <strong>Session Date:</strong> {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
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
                    </div>

                    <div className="form-group">
                      <label>Start Time</label>
                      <select value={bookingData.startTime} onChange={handleStartTimeChange}>
                        <option value="">Select start time</option>
                        {getAvailableTimeSlots().map(slot => (
                          <option key={slot.time} value={slot.time}>{slot.display}</option>
                        ))}
                      </select>
                    </div>

                    {bookingData.startTime && (
                      <div className="form-group">
                        <label>End Time</label>
                        <select value={bookingData.endTime} onChange={handleEndTimeChange}>
                          <option value="">Select end time</option>
                          {getAvailableEndTimes().map(slot => (
                            <option key={slot.time} value={slot.time}>{slot.display}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}

                {bookingData.startTime && bookingData.endTime && (
                  <div className="session-summary">
                    <h4>Session Summary</h4>
                    <div className="summary-row">
                      <span>Time:</span>
                      <strong>{bookingData.startTime} - {bookingData.endTime}</strong>
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
                placeholder="Brief description..."
                rows="3"
              />
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => {setShowBookingModal(false); resetBookingForm();}}>Cancel</button>
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