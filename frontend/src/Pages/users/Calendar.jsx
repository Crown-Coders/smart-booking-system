import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState({});

  // Mock appointments data (in real app, fetch from API)
  useEffect(() => {
    // Example: appointments keyed by "YYYY-MM-DD"
    const mockAppointments = {
      "2024-03-05": ["10:00 AM - Dr. Smith"],
      "2024-03-12": ["2:00 PM - Dr. Johnson"],
      "2024-03-15": ["11:00 AM - Dr. Williams"],
      "2024-03-19": ["3:00 PM - Dr. Smith"],
      "2024-03-25": ["9:00 AM - Dr. Brown", "4:00 PM - Dr. Davis"],
    };
    setAppointments(mockAppointments);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

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

  const today = new Date();
  const todayKey = formatDateKey(today.getDate());

  const handleDayClick = (day) => {
    const dateKey = formatDateKey(day);
    setSelectedDate(dateKey);
  };

  const selectedAppointments = selectedDate ? appointments[selectedDate] || [] : [];

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

        /* Calendar grid */
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

        .calendar-day:hover {
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

        .day-number {
          font-weight: 600;
          color: #002324;
          margin-bottom: 0.5rem;
        }

        .appointment-indicator {
          font-size: 0.7rem;
          background-color: #002324;
          color: #ebfacf;
          padding: 0.2rem 0.4rem;
          border-radius: 12px;
          margin-bottom: 0.2rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Details panel */
        .details-panel {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }

        .details-panel h3 {
          color: #002324;
          font-size: 1.3rem;
          margin: 0 0 1rem 0;
        }

        .appointment-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .appointment-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .appointment-item:last-child {
          border-bottom: none;
        }

        .appointment-time {
          font-weight: 600;
          color: #002324;
        }

        .appointment-therapist {
          color: #a1ad95;
        }

        .btn-soft-primary {
          background-color: #002324;
          color: #ebfacf;
          border: none;
          border-radius: 30px;
          padding: 0.4rem 1.2rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-soft-primary:hover {
          background-color: #a1ad95;
          color: #002324;
        }

        .btn-soft-outline {
          background: transparent;
          border: 2px solid #002324;
          color: #002324;
          border-radius: 30px;
          padding: 0.4rem 1.2rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-soft-outline:hover {
          background-color: #002324;
          color: white;
        }

        .empty-state {
          text-align: center;
          color: #a1ad95;
          padding: 2rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .soft-calendar {
            padding: 1rem;
          }
          .calendar-day {
            min-height: 70px;
            padding: 0.25rem;
          }
          .appointment-indicator {
            font-size: 0.6rem;
            padding: 0.1rem 0.2rem;
          }
          .weekdays {
            font-size: 0.8rem;
          }
          .month-year {
            font-size: 1.1rem;
            min-width: 140px;
          }
        }
      `}</style>

      <div className="soft-calendar">
        {/* Header */}
        <div className="calendar-header">
          <h1>Calendar</h1>
          <div className="calendar-nav">
            <button className="nav-btn" onClick={goToPreviousMonth} aria-label="Previous month">←</button>
            <span className="month-year">{monthNames[month]} {year}</span>
            <button className="nav-btn" onClick={goToNextMonth} aria-label="Next month">→</button>
            <button className="today-btn" onClick={goToToday}>Today</button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="calendar-grid">
          <div className="weekdays">
            {days.map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="days-grid">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="calendar-day" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }} />
            ))}

            {/* Actual days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateKey = formatDateKey(day);
              const dayAppointments = appointments[dateKey] || [];
              const isToday = dateKey === todayKey;
              const isSelected = selectedDate === dateKey;

              return (
                <div
                  key={day}
                  className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="day-number">{day}</div>
                  {dayAppointments.slice(0, 2).map((apt, idx) => (
                    <div key={idx} className="appointment-indicator" title={apt}>
                      {apt}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="appointment-indicator" style={{ backgroundColor: '#a1ad95', color: '#002324' }}>
                      +{dayAppointments.length - 2} more
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Details panel */}
        <div className="details-panel">
          <h3>
            {selectedDate
              ? `Appointments for ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
              : 'Select a day to view appointments'}
          </h3>
          {selectedDate ? (
            selectedAppointments.length > 0 ? (
              <ul className="appointment-list">
                {selectedAppointments.map((apt, idx) => {
                  const [time, therapist] = apt.split(" - ");
                  return (
                    <li key={idx} className="appointment-item">
                      <div>
                        <span className="appointment-time">{time}</span>
                        <span className="appointment-therapist"> - {therapist}</span>
                      </div>
                      <button className="btn-soft-primary" onClick={() => alert(`View details for ${apt}`)}>
                        View
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="empty-state">
                <p>No appointments scheduled for this day.</p>
                <button className="btn-soft-outline" onClick={() => alert('Navigate to booking')}>
                  Book Appointment
                </button>
              </div>
            )
          ) : (
            <div className="empty-state">
              <p>Click on a date to see your appointments.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Calendar;