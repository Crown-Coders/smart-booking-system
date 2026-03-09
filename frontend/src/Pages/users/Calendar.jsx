// src/components/Calendar.jsx
import React, { useState, useEffect } from "react";
import "./calendar.css";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [bookingData, setBookingData] = useState({
    therapistId: "",
    slotId: "",
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

  /** -------------------- STATIC TIME SLOTS -------------------- */
  const generateStaticSlots = () => {
    const slots = [];
    let hour = 8;
    let minute = 30;
    let idCounter = 1;

    while (hour < 16 || (hour === 16 && minute === 0)) {
      slots.push({
        id: idCounter++,
        time: `${String(hour).padStart(2, "0")}:${minute === 0 ? "00" : minute}`,
        isBooked: false,
      });
      minute += 30;
      if (minute === 60) {
        hour += 1;
        minute = 0;
      }
    }
    return slots;
  };

  /** -------------------- FETCH AVAILABLE SLOTS -------------------- */
  const fetchAvailableSlots = async (therapistId) => {
    if (!therapistId) return;
    setLoading(true);
    try {
      const allSlots = generateStaticSlots();

      const res = await fetch(
        `http://localhost:5000/api/bookings/available/${therapistId}`
      );
      if (res.ok) {
        const data = await res.json();
        const bookedSlotIds = data.bookedSlotIds || [];
        const slotsWithStatus = allSlots.map((slot) => ({
          ...slot,
          isBooked: bookedSlotIds.includes(slot.id),
        }));
        setAvailableSlots(slotsWithStatus);
      } else {
        setAvailableSlots(allSlots);
      }
    } catch (err) {
      console.error(err);
      setAvailableSlots(allSlots);
    } finally {
      setLoading(false);
    }
  };

  /** -------------------- BOOKING -------------------- */
  const calculatePrice = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    return hours * 800;
  };

const handleBooking = async () => {
  if (!user) return alert("Please log in to book an appointment");
  if (!bookingData.therapistId || (!bookingData.slotId && (!bookingData.startTime || !bookingData.endTime)))
    return alert("Select therapist and time slot");

  if (bookingData.slotId && (!bookingData.startTime || !bookingData.endTime)) {
    const slot = availableSlots.find((s) => s.id === bookingData.slotId);
    if (slot) {
      setBookingData((prev) => ({
        ...prev,
        startTime: slot.time,
        endTime: new Date(new Date(`2000-01-01T${slot.time}`).getTime() + 30 * 60 * 1000)
          .toTimeString()
          .slice(0, 5),
      }));
    }
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

      const payfastRes = await fetch(
        `http://localhost:5000/api/bookings/payfast/${data.booking.id}`,
        { method: "POST" }
      );

      const { url } = await payfastRes.json();

      window.location.href = url;
      ; // redirect to PayFast sandbox

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
      slotId: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
    });
    setAvailableSlots([]);
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
      slotId: "",
      startTime: "",
      endTime: "",
    }));
    fetchAvailableSlots(therapistId);
  };

  const handleSlotSelect = (slot) => {
    setBookingData((prev) => ({ ...prev, slotId: slot.id }));
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
              {new Date(selectedDate).toLocaleDateString("en-US", {weekday:"long", year:"numeric", month:"long", day:"numeric"})}
            </div>

            <div className="form-group">
              <label>Select Therapist</label>
              <select value={bookingData.therapistId} onChange={handleTherapistChange}>
                <option value="">Choose a therapist</option>
                {therapists.map(t => <option key={t.id} value={t.id}>{t.user?.name} - {t.specialization}</option>)}
              </select>
            </div>

            {bookingData.therapistId && (
              <>
                <div className="form-group">
                  <label>Available Slots</label>
                  {loading ? <div>Loading...</div> : (
                    <div className="time-slots">
                      {availableSlots.map(slot => (
                        <button key={slot.id} disabled={slot.isBooked}
                          className={`${slot.isBooked ? "booked" : ""} ${bookingData.slotId===slot.id?"selected":""}`}
                          onClick={() => handleSlotSelect(slot)}>
                          {new Date(`2000-01-01T${slot.time}`).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true})}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Start/End Time Dropdown */}
                <div className="form-group">
                  <label>Start Time</label>
                  <select value={bookingData.startTime} onChange={e=>setBookingData(prev=>({...prev,startTime:e.target.value}))}>
                    <option value="">Select start time</option>
                    {availableSlots.filter(s=>!s.isBooked).map(s=>(
                      <option key={s.id} value={s.time}>{s.time}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>End Time</label>
                  <select value={bookingData.endTime} onChange={e=>setBookingData(prev=>({...prev,endTime:e.target.value}))}>
                    <option value="">Select end time</option>
                    {availableSlots.filter(s=>!s.isBooked && s.time>bookingData.startTime).map(s=>(
                      <option key={s.id} value={s.time}>{s.time}</option>
                    ))}
                  </select>
                </div>

                {bookingData.startTime && bookingData.endTime && (
                  <div>Total Price: R{calculatePrice(bookingData.startTime, bookingData.endTime)}</div>
                )}
              </>
            )}

            <div className="form-group">
              <label>Description</label>
              <textarea value={bookingData.description} onChange={e=>setBookingData(prev=>({...prev,description:e.target.value}))}/>
            </div>

            <div>
              <button onClick={()=>{setShowBookingModal(false); resetBookingForm();}}>Cancel</button>
              <button onClick={handleBooking} disabled={!bookingData.therapistId || (!bookingData.slotId && (!bookingData.startTime || !bookingData.endTime)) || loading}>
                {loading?"Booking...":"Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Calendar;
