// src/components/Calendar.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./calendar.css";

function Calendar() {
  const location = useLocation();
  const selectedTherapistFromState = location.state?.therapist;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectionStep, setSelectionStep] = useState('start'); // 'start' or 'end'

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

  /** -------------------- FETCH CURRENT USER -------------------- */
  useEffect(() => {
    fetchCurrentUser();
  }, []);

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

  /** -------------------- CHECK SLOT AVAILABILITY -------------------- */
  const isSlotAvailable = (time) => {
  // Block slot if **any slot (reserved or booked) covers this time**
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
      alert("This time slot is already booked");
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
          alert("Cannot select this range - some slots in between are already booked");
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
      };

      const bookingRes = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: "POST",
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

      // Redirect to payment
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
              <h2>
                {therapist ? `Book with Dr. ${therapist.user.name}` : "Select a Therapist"}
              </h2>
              <button onClick={() => {setShowBookingModal(false); resetBookingForm();}}>×</button>
            </div>

            <div className="date-display">
              {new Date(selectedDate).toLocaleDateString("en-US", {weekday:"long", year:"numeric", month:"long", day:"numeric"})}
            </div>

            {!therapist && (
              <div className="form-group">
                <label>Select a Therapist</label>
                <select
                  value={bookingData.therapistId}
                  onChange={(e) => {
                    const selected = therapists.find(t => t.id === Number(e.target.value)); // convert to number
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
              {loading ? <div>Loading...</div> : (
                <div className="time-slots" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
                  {allTimeSlots.map(slot => {
                    const isAvailable = isSlotAvailable(slot.time);
                    const isStart = bookingData.startTime === slot.time;
                    const isEnd = bookingData.endTime === slot.time;
                    const isInRange = bookingData.startTime && bookingData.endTime && 
                                     slot.time > bookingData.startTime && slot.time < bookingData.endTime;

                    return (
                      <button
                        key={slot.time}
                        disabled={!isAvailable || !bookingData.therapistId}
                        className={`time-slot 
                          ${!isAvailable ? "booked" : ""} 
                          ${isStart ? "start-selected" : ""}
                          ${isEnd ? "end-selected" : ""}
                          ${isInRange ? "in-range" : ""}
                        `}
                        onClick={() => handleSlotClick(slot)}
                        style={{
                          backgroundColor: !isAvailable ? '#f5f5f5' : (isStart ? '#002324' : (isEnd ? '#a1ad95' : (isInRange ? '#e5ddde' : 'white'))),
                          color: !isAvailable ? '#a1ad95' : (isStart ? 'white' : '#002324'),
                          border: !isAvailable ? '1px solid #e5ddde' : (isStart || isEnd ? '2px solid #002324' : '1px solid #e5ddde'),
                          cursor: !isAvailable ? 'not-allowed' : 'pointer',
                          textDecoration: !isAvailable ? 'line-through' : 'none'
                        }}
                      >
                        {slot.display}
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
                value={bookingData.description} 
                onChange={e => setBookingData(prev => ({...prev, description: e.target.value}))}
                placeholder="Brief description of your appointment reason..."
                rows="3"
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                style={{ flex: 1, padding: '0.5rem', background: 'transparent', border: '1px solid #002324', borderRadius: '5px', cursor: 'pointer', color: 'black' }}
                onClick={()=>{setShowBookingModal(false); resetBookingForm();}}
              >
                Cancel
              </button>
              <button 
                style={{ flex: 1, padding: '0.5rem', background: '#002324', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                onClick={handleBooking} 
                disabled={!bookingData.startTime || !bookingData.endTime || !bookingData.therapistId || loading}
              >
                {loading?"Processing...":"Book & Pay"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Calendar;