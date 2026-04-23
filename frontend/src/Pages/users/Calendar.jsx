// src/components/Calendar.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./calendar.css";

function Calendar() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedTherapistFromState = location.state?.therapist;
  const rescheduleAppointment = location.state?.appointment;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectionStep, setSelectionStep] = useState('start'); // 'start' or 'end'
  const [bookingType, setBookingType] = useState(null); // 'pay_now' only now

  // Therapist selection
  const [therapist, setTherapist] = useState(selectedTherapistFromState || null);
  const [therapists, setTherapists] = useState([]);

  const [bookingData, setBookingData] = useState({
    therapistId: selectedTherapistFromState?.id || "",
    date: "",
    startTime: "",
    endTime: "",
    description: ""
  });

  /** -------------------- FETCH CURRENT USER ------------------------- */
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  
  useEffect(() => {
    if (rescheduleAppointment?.bookingDate) {
      setSelectedDate(rescheduleAppointment.bookingDate);
      setBookingData(prev => ({
        ...prev,
        date: rescheduleAppointment.bookingDate,
        startTime: "",
        endTime: "",
        description: rescheduleAppointment.description || "",
      }));
    }
  }, [rescheduleAppointment]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  /** -------------------- FETCH ALL THERAPISTS IF NONE SELECTED -------------------- */
  useEffect(() => {
    if (!therapist) {
      fetch(`${import.meta.env.VITE_API_URL}/api/therapists`)
        .then(res => res.json())
        .then(data => setTherapists(data))
        .catch(err => console.error(err));
    }
  }, [therapist]);

  /** -------------------- FETCH BOOKED SLOTS -------------------- */
  useEffect(() => {
    if (therapist && selectedDate) {
      fetchBookedSlots();
    }
  }, [therapist, selectedDate]);

  const fetchBookedSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/availability-slots?therapistId=${therapist.id}&date=${selectedDate}`
      );
      if (res.ok) {
        const data = await res.json();
        setBookedSlots(data.slots || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /** -------------------- TIME SLOTS -------------------- */
  const generateTimeSlots = () => {
    const slots = [];
    let hour = 8;
    let minute = 0;

    while (hour < 17) {
      const timeString = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      slots.push({
        time: timeString,
        display: new Date(`2000-01-01T${timeString}`)
          .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
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

  /** -------------------- CHECK IF TIME SLOT HAS PASSED -------------------- */
  const isTimeSlotPassed = (time) => {
    if (!selectedDate) return false;
    
    const today = new Date();
    const selectedDateObj = new Date(selectedDate);
    const isToday = selectedDateObj.toDateString() === today.toDateString();
    
    if (isToday) {
      const [hours, minutes] = time.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      const currentTime = new Date();
      currentTime.setSeconds(0, 0);
      
      return slotTime <= currentTime;
    }
    
    return false;
  };

  /** -------------------- CHECK SLOT AVAILABILITY -------------------- */
  const isSlotAvailable = (time) => {
    // Check if time slot has passed
    if (isTimeSlotPassed(time)) {
      return false;
    }
    
    // Block slot if any slot (reserved or booked) covers this time
    return !bookedSlots.some(slot =>
      time >= slot.startTime && time < slot.endTime
    );
  };

  /** -------------------- BOOKING -------------------- */
  const calculatePrice = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    return hours * 800;
  };

  const handleSlotClick = (slot) => {
    if (!isSlotAvailable(slot.time)) {
      alert("This time slot is not available (either booked or already passed)");
      return;
    }

    if (!bookingData.therapistId) {
      return alert("Please select a therapist first");
    }

    if (selectionStep === 'start') {
      setBookingData(prev => ({
        ...prev,
        startTime: slot.time,
        endTime: ""
      }));
      setSelectionStep('end');
    } else {
      if (slot.time <= bookingData.startTime) {
        alert("End time must be after start time");
        return;
      }

      // Check all slots in range
      const startIndex = allTimeSlots.findIndex(s => s.time === bookingData.startTime);
      const endIndex = allTimeSlots.findIndex(s => s.time === slot.time);
      for (let i = startIndex; i <= endIndex; i++) {
        if (!isSlotAvailable(allTimeSlots[i].time)) {
          alert("Cannot select this range - some slots in between are already booked or have passed");
          return;
        }
      }

      setBookingData(prev => ({
        ...prev,
        endTime: slot.time
      }));
      setSelectionStep('start');
    }
  };

  const handleBooking = async () => {
    if (!user || !bookingData.therapistId || !bookingData.startTime || !bookingData.endTime) {
      return alert("Please complete all booking details.");
    }

    // Additional validation to prevent booking past time slots
    if (isTimeSlotPassed(bookingData.startTime)) {
      alert("Cannot book a time slot that has already passed.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const bookingPayload = {
        userId: user.id,
        therapistId: therapist.id,
        bookingDate: selectedDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        description: bookingData.description,
        price: calculatePrice(bookingData.startTime, bookingData.endTime),
        status: 'pending_payment',
      };

      const endpoint = rescheduleAppointment
        ? `${import.meta.env.VITE_API_URL}/api/bookings/${rescheduleAppointment.id}/reschedule`
        : `${import.meta.env.VITE_API_URL}/api/bookings`;

      const bookingRes = await fetch(endpoint, {
        method: rescheduleAppointment ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!bookingRes.ok) {
        const errorData = await bookingRes.json();
        throw new Error(errorData.error || "Booking failed");
      }

      const data = await bookingRes.json();

      console.log("Booking successful:", data);

      if (rescheduleAppointment) {
        alert("Your session has been rescheduled successfully.");
        navigate("/appointments");
        return;
      }

      // Redirect to payment immediately
      const payfastRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/payfast/${data.booking.id}`,
        { method: "POST" }
      );

      const { url } = await payfastRes.json();
      window.location.href = url;

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetBookingForm = () => {
    setBookingData({
      therapistId: therapist?.id || "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
    });
    setSelectionStep('start');
    setBookingType(null);
  };

  /** -------------------- HANDLERS -------------------- */
  const handleDayClick = (day) => {
    const dateKey = formatDateKey(day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(dateKey) < today) return alert("Cannot select past dates");
    setSelectedDate(dateKey);
    setBookingData(prev => ({ ...prev, date: dateKey }));
    setShowBookingModal(true);
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

  return (
    <>
      <div className="soft-calendar">
        <div className="calendar-header">
          <h1>{rescheduleAppointment ? "Reschedule Session" : "Calendar"}</h1>
          <div className="calendar-nav">
            <button className="nav-btn" onClick={goToPreviousMonth}>←</button>
            <span className="month-year">{monthNames[month]} {year}</span>
            <button className="nav-btn" onClick={goToNextMonth}>→</button>
            <button className="today-btn" onClick={goToToday}>Today</button>
          </div>
        </div>

        {rescheduleAppointment && (
          <div style={{ marginBottom: "1rem", padding: "1rem", background: "#FFF8E8", borderRadius: "12px", border: "1px solid #F6D28B", color: "#8A5A00" }}>
            Rescheduling is only allowed at least 24 hours before the session. Your existing payment stays attached to this booking.
          </div>
        )}

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
                  <div className="day-number">{day}</div>
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
              <h2>
                {therapist ? `Book with Dr. ${therapist.user.name}` : "Select a Therapist"}
              </h2>
              <button className="modal-close" onClick={() => {setShowBookingModal(false); resetBookingForm();}}>×</button>
            </div>

            <div className="date-display">
              {new Date(selectedDate).toLocaleDateString("en-US", {weekday:"long", year:"numeric", month:"long", day:"numeric"})}
            </div>

            {!therapist && (
              <div className="form-group">
                <label>Select a Therapist</label>
                <select
                  className="form-select"
                  value={bookingData.therapistId}
                  onChange={(e) => {
                    const selected = therapists.find(t => t.id === Number(e.target.value));
                    setTherapist(selected);
                    setBookingData(prev => ({ ...prev, therapistId: selected?.id || "" }));
                  }}
                >
                  <option value="">-- Choose a Therapist --</option>
                  {therapists.map(t => (
                    <option key={t.id} value={t.id}>
                      Dr. {t.user.name} - {t.specialization}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {therapist && (
              <div className="therapist-info" style={{ marginBottom: '1rem', padding: '0.5rem', background: '#f0f2f0', borderRadius: '8px' }}>
                <strong>{therapist.specialization}</strong> • {therapist.yearsOfExperience} years experience
              </div>
            )}

            {/* Time Slots */}
            <div className="form-group">
              <label>Select Time Slots</label>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                {selectionStep === 'start' ? 'Click to select start time' : 'Click to select end time'}
              </p>
              {loading ? <div className="loading-spinner">Loading...</div> : (
                <div className="time-slots">
                  {allTimeSlots.map(slot => {
                    const isAvailable = isSlotAvailable(slot.time);
                    const isStart = bookingData.startTime === slot.time;
                    const isEnd = bookingData.endTime === slot.time;
                    const isPassed = isTimeSlotPassed(slot.time);

                    return (
                      <button
                        key={slot.time}
                        disabled={!isAvailable || !bookingData.therapistId}
                        className={`time-slot 
                          ${!isAvailable ? "booked" : ""} 
                          ${isStart ? "selected" : ""}
                          ${isEnd ? "selected" : ""}
                          ${isPassed ? "passed" : ""}
                        `}
                        onClick={() => handleSlotClick(slot)}
                        title={isPassed ? "This time slot has already passed" : ""}
                      >
                        {slot.display}
                        {isPassed && " (Passed)"}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Times */}
            {bookingData.startTime && (
              <div style={{ margin: '1rem 0', padding: '0.5rem', background: '#f0f2f0', borderRadius: '8px' }}>
                <strong>Start:</strong> {new Date(`2000-01-01T${bookingData.startTime}`).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true})}
              </div>
            )}
            {bookingData.endTime && (
              <div style={{ margin: '1rem 0', padding: '0.5rem', background: '#f0f2f0', borderRadius: '8px' }}>
                <strong>End:</strong> {new Date(`2000-01-01T${bookingData.endTime}`).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true})}
              </div>
            )}

            {bookingData.startTime && bookingData.endTime && (
              <div style={{ margin: '1rem 0', padding: '0.5rem', background: '#002324', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
                <strong>Total: R{calculatePrice(bookingData.startTime, bookingData.endTime)}</strong>
              </div>
            )}

            {/* Description */}
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea 
                className="form-textarea"
                value={bookingData.description} 
                onChange={e => setBookingData(prev => ({...prev, description: e.target.value}))}
                placeholder="Brief description of your appointment reason..."
                rows="3"
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="btn-secondary"
                onClick={()=>{setShowBookingModal(false); resetBookingForm();}}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleBooking} 
                disabled={!bookingData.startTime || !bookingData.endTime || !bookingData.therapistId || loading}
                style={{ backgroundColor: '#a1ad95' }}
              >
                {loading ? "Processing..." : rescheduleAppointment ? "Save New Time" : "Book & Pay Now"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Calendar;
