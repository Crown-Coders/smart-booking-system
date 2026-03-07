import React, { useState, useEffect } from "react";

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
    description: "",
    date: "",
    time: ""
  });

  // Get logged in user & therapists
  useEffect(() => {
    fetchCurrentUser();
    fetchTherapists();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchTherapists = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/therapists');
      
      if (!response.ok) {
        throw new Error('Failed to fetch therapists');
      }
      
      const data = await response.json();
      console.log('Therapists fetched:', data);
      setTherapists(data);
    } catch (error) {
      console.error('Error fetching therapists:', error);
    }
  };

  // ✅ Helper: Generate static time slots (30-min intervals 8:30–16:00)
  // TODO: Replace this with fetching real slots from database when admin adds them
  const generateStaticSlots = () => {
    const slots = [];
    let hour = 8;
    let minute = 30;
    let idCounter = 1;

    while (hour < 16 || (hour === 16 && minute === 0)) {
      slots.push({
        id: idCounter++,
        time: `${String(hour).padStart(2, "0")}:${minute === 0 ? "00" : minute}`,
        isBooked: false // Will be updated based on database
      });
      minute += 30;
      if (minute === 60) { 
        hour += 1; 
        minute = 0; 
      }
    }

    return slots;
  };

  // Fetch available slots for selected therapist
  // TODO: When real slots are in DB, modify this to fetch from availability route
  const fetchAvailableSlots = async (therapistId) => {
    if (!therapistId) return;
    setLoading(true);
    try {
      // Generate static slots
      const allSlots = generateStaticSlots();
      
      // Fetch booked slots for this therapist from database
      const response = await fetch(`http://localhost:5000/api/bookings/available/${therapistId}`);
      
      if (response.ok) {
        const data = await response.json();
        const bookedSlotIds = data.bookedSlotIds || [];
        
        // Mark slots as booked if their ID is in bookedSlotIds
        const slotsWithStatus = allSlots.map(slot => ({
          ...slot,
          isBooked: bookedSlotIds.includes(slot.id)
        }));
        
        setAvailableSlots(slotsWithStatus);
      } else {
        // If fetch fails, show all slots as available
        setAvailableSlots(allSlots.map(slot => ({ ...slot, isBooked: false })));
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots(generateStaticSlots().map(slot => ({ ...slot, isBooked: false })));
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) return alert('Please log in to book an appointment');
    if (!bookingData.therapistId || !bookingData.slotId) return alert('Please select therapist and time slot');

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const bookingPayload = {
        userId: user.id,
        therapistId: parseInt(bookingData.therapistId),
        slotId: parseInt(bookingData.slotId),
        description: bookingData.description
      };

      console.log('Booking payload:', bookingPayload);

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const data = await response.json();
      console.log('Booking response:', data);
      
      alert('Booking confirmed successfully!');
      setShowBookingModal(false);
      resetBookingForm();
      
      // Refresh available slots for this therapist
      if (bookingData.therapistId) {
        fetchAvailableSlots(bookingData.therapistId);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const resetBookingForm = () => {
    setBookingData({
      therapistId: "",
      slotId: "",
      description: "",
      date: "",
      time: ""
    });
    setAvailableSlots([]);
  };

  // Day click opens modal
  const handleDayClick = (day) => {
    const dateKey = formatDateKey(day);
    const selectedDateObj = new Date(dateKey);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDateObj < today) {
      alert("Cannot select past dates");
      return;
    }
    
    setSelectedDate(dateKey);
    setBookingData(prev => ({ ...prev, date: dateKey }));
    setShowBookingModal(true);
  };

  const handleTherapistChange = (e) => {
    const therapistId = e.target.value;
    setBookingData(prev => ({ ...prev, therapistId, slotId: "", time: "" }));
    if (therapistId) {
      fetchAvailableSlots(therapistId);
    }
  };

  const handleSlotSelect = (slot) => {
    setBookingData(prev => ({ ...prev, slotId: slot.id, time: slot.time }));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  const formatDateKey = (day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };
  
  const todayKey = formatDateKey(new Date().getDate());

  return (
    <>
      <style>{`
        .soft-calendar {
          background-color: #f9faf9;
          padding: 2rem;
          min-height: 100%;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .calendar-header h1 {
          color: #002324;
          font-weight: 600;
          font-size: 2rem;
          margin: 0;
        }

        .calendar-nav {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .nav-btn {
          background: transparent;
          border: 2px solid #002324;
          color: #002324;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .nav-btn:hover {
          background-color: #a1ad95;
          border-color: #a1ad95;
          color: #002324;
        }

        .today-btn {
          background-color: #002324;
          color: #ebfacf;
          border: none;
          border-radius: 30px;
          padding: 0.5rem 1.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .today-btn:hover {
          background-color: #a1ad95;
          color: #002324;
        }

        .month-year {
          font-size: 1.3rem;
          font-weight: 600;
          color: #002324;
          min-width: 180px;
          text-align: center;
        }

        .calendar-grid {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }

        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-weight: 600;
          color: #002324;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5ddde;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }

        .calendar-day {
          min-height: 100px;
          padding: 0.5rem;
          border: 1px solid #e5ddde;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          display: flex;
          flex-direction: column;
        }

        .calendar-day:hover:not(.past-date) {
          background-color: #e5ddde;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }

        .calendar-day.selected {
          background-color: #a1ad95;
          border-color: #002324;
        }

        .calendar-day.today {
          border: 2px solid #002324;
          background-color: #ebfacf;
        }

        .calendar-day.past-date {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: #f5f5f5;
        }

        .day-number {
          font-weight: 600;
          color: #002324;
          margin-bottom: 0.5rem;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h2 {
          color: #002324;
          margin: 0;
          font-size: 1.5rem;
        }

        .modal-close {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #002324;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background-color: #f0f0f0;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #002324;
          font-weight: 500;
        }

        .form-select, .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5ddde;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #002324;
        }

        .form-select:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .time-slots {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 0.5rem;
          max-height: 300px;
          overflow-y: auto;
          padding: 0.5rem;
          border: 2px solid #e5ddde;
          border-radius: 10px;
        }

        .time-slot {
          padding: 0.5rem;
          border: 2px solid #e5ddde;
          border-radius: 8px;
          background: white;
          color: #002324;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          text-align: center;
        }

        .time-slot:hover:not(.booked):not(.selected) {
          background-color: #a1ad95;
          border-color: #002324;
        }

        .time-slot.selected {
          background-color: #002324;
          border-color: #002324;
          color: #ebfacf;
        }

        .time-slot.booked {
          background-color: #f5f5f5;
          border-color: #e5ddde;
          color: #a1ad95;
          cursor: not-allowed;
          text-decoration: line-through;
          opacity: 0.7;
        }

        .time-slot.booked:hover {
          background-color: #f5f5f5;
          border-color: #e5ddde;
          transform: none;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-primary, .btn-secondary {
          flex: 1;
          padding: 0.75rem;
          border-radius: 30px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 1rem;
        }

        .btn-primary {
          background-color: #002324;
          color: #ebfacf;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #a1ad95;
          color: #002324;
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background-color: transparent;
          border: 2px solid #002324;
          color: #002324;
        }

        .btn-secondary:hover {
          background-color: #002324;
          color: #ebfacf;
        }

        .loading-spinner {
          text-align: center;
          padding: 2rem;
          color: #a1ad95;
        }

        .date-display {
          background-color: #f9faf9;
          padding: 0.75rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 500;
          color: #002324;
          border: 2px solid #e5ddde;
        }

        .no-slots {
          text-align: center;
          padding: 2rem;
          color: #a1ad95;
          border: 2px dashed #e5ddde;
          border-radius: 10px;
        }
      `}</style>

      <div className="soft-calendar">
        <div className="calendar-header">
          <h1>Calendar</h1>
          <div className="calendar-nav">
            <button className="nav-btn" onClick={goToPreviousMonth}>←</button>
            <span className="month-year">{monthNames[month]} {year}</span>
            <button className="nav-btn" onClick={goToNextMonth}>→</button>
            <button className="today-btn" onClick={goToToday}>Today</button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="weekdays">
            {days.map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="days-grid">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="calendar-day" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }} />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateKey = formatDateKey(day);
              const isToday = dateKey === todayKey;
              const isSelected = selectedDate === dateKey;
              
              const dateObj = new Date(dateKey);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isPastDate = dateObj < today;

              return (
                <div
                  key={day}
                  className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isPastDate ? 'past-date' : ''}`}
                  onClick={() => !isPastDate && handleDayClick(day)}
                >
                  <div className="day-number">{day}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Appointment</h2>
              <button className="modal-close" onClick={() => {
                setShowBookingModal(false);
                resetBookingForm();
              }}>×</button>
            </div>

            <div className="date-display">
              Selected Date: {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>

            <div className="form-group">
              <label htmlFor="therapist">Select Therapist</label>
              <select
                id="therapist"
                className="form-select"
                value={bookingData.therapistId}
                onChange={handleTherapistChange}
              >
                <option value="">Choose a therapist</option>
                {therapists.map(therapist => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.user?.name} - {therapist.specialization}
                  </option>
                ))}
              </select>
            </div>

            {bookingData.therapistId && (
              <div className="form-group">
                <label>Available Time Slots</label>
                {loading ? (
                  <div className="loading-spinner">Loading available slots...</div>
                ) : availableSlots.length > 0 ? (
                  <div className="time-slots">
                    {availableSlots.map(slot => (
                      <button
                        key={slot.id}
                        className={`time-slot ${slot.isBooked ? 'booked' : ''} ${bookingData.slotId === slot.id ? 'selected' : ''}`}
                        onClick={() => !slot.isBooked && handleSlotSelect(slot)}
                        disabled={slot.isBooked}
                      >
                        {new Date(`2000-01-01T${slot.time}`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="no-slots">
                    No available slots for this therapist
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                className="form-textarea"
                rows="3"
                value={bookingData.description}
                onChange={(e) => setBookingData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your appointment reason..."
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowBookingModal(false);
                  resetBookingForm();
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleBooking}
                disabled={!bookingData.therapistId || !bookingData.slotId || loading}
              >
                {loading ? 'Booking...' : 'Continue Book'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Calendar;