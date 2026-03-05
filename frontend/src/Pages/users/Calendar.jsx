// src/Pages/users/Calendar.jsx
import React, { useState } from 'react';

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState('March 2024');
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = 31;
  const firstDayOfMonth = 5; // Friday (0 = Sunday, 1 = Monday, etc.)
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const appointments = {
    5: ['10:00 AM - Dr. Smith'],
    12: ['2:00 PM - Dr. Johnson'],
    15: ['11:00 AM - Dr. Williams'],
    19: ['3:00 PM - Dr. Smith'],
  };

  return (
    <div className="calendar-page">
      <style>{`
        .calendar-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 2rem;
        }

        .calendar-header h1 {
          color: #002324;
          margin: 0;
        }

        .month-nav {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .month-nav button {
          background: none;
          border: 2px solid #002324;
          color: #002324;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .month-nav button:hover {
          background-color: #A1AD95;
          border-color: #A1AD95;
        }

        .month-nav span {
          font-size: 1.3rem;
          font-weight: 600;
          color: #002324;
          min-width: 150px;
          text-align: center;
        }

        .calendar-grid {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-weight: 600;
          color: #002324;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #E5DDDE;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }

        .calendar-day {
          min-height: 100px;
          padding: 0.5rem;
          border: 1px solid #E5DDDE;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .calendar-day:hover {
          background-color: #E5DDDE;
        }

        .calendar-day.selected {
          background-color: #A1AD95;
          border-color: #002324;
        }

        .day-number {
          font-weight: 600;
          color: #002324;
          margin-bottom: 0.5rem;
        }

        .appointment-indicator {
          font-size: 0.75rem;
          background-color: #002324;
          color: #E5DDDE;
          padding: 0.2rem 0.3rem;
          border-radius: 4px;
          margin-bottom: 0.2rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .appointment-details {
          margin-top: 2rem;
          background: #E5DDDE;
          border-radius: 10px;
          padding: 1.5rem;
        }

        .appointment-details h3 {
          color: #002324;
          margin: 0 0 1rem 0;
        }

        .appointment-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .appointment-list li {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .empty-day {
          color: #A1AD95;
          text-align: center;
          padding: 1rem;
        }

        .btn-book {
          background-color: #002324;
          color: #E5DDDE;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .btn-book:hover {
          background-color: #A1AD95;
          color: #002324;
        }
      `}</style>

      <div className="calendar-header">
        <h1>Calendar</h1>
        <div className="month-nav">
          <button>←</button>
          <span>{currentMonth}</span>
          <button>→</button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          {days.map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="days-grid">
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="calendar-day" style={{ border: 'none' }}></div>
          ))}
          
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const hasAppointments = appointments[day];
            
            return (
              <div 
                key={day} 
                className={`calendar-day ${selectedDate === day ? 'selected' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="day-number">{day}</div>
                {hasAppointments && hasAppointments.map((apt, idx) => (
                  <div key={idx} className="appointment-indicator">
                    {apt}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="appointment-details">
          <h3>Appointments for March {selectedDate}, 2024</h3>
          {appointments[selectedDate] ? (
            <ul className="appointment-list">
              {appointments[selectedDate].map((apt, idx) => (
                <li key={idx}>
                  <span>{apt}</span>
                  <button className="btn-book">View Details</button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-day">
              <p>No appointments scheduled for this day</p>
              <button className="btn-book">Book Appointment</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Calendar;