import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./TherapistDashboard.css";

const TherapistDashboard = () => {
  const upcomingRef = useRef(null);
  const navigate = useNavigate();

  const [isAvailable, setIsAvailable] = useState(true);

  const upcomingSessions = [
    { id: 1, client: "John Doe", date: "2025-03-10", time: "10:00 AM" },
    { id: 2, client: "Jane Smith", date: "2025-03-11", time: "2:00 PM" },
  ];

  return (
    <div className="therapist-dashboard">
      <div className="therapist-dashboard__header">
        <div className="therapist-dashboard__intro-card">
          <h1>Therapist Dashboard</h1>
          <p>Welcome back! Here's an overview of your activity.</p>
        </div>

        <button onClick={() => navigate("/profile")} className="therapist-dashboard__profile-button">
          View Profile
        </button>
      </div>

      <div className="therapist-dashboard__cards">
        <div className="therapist-dashboard__card therapist-dashboard__card--clickable" onClick={() => navigate("/total-sessions")}>
          <h3>Total Sessions</h3>
          <p>24</p>
        </div>

        <div
          className="therapist-dashboard__card therapist-dashboard__card--clickable"
          onClick={() => navigate("/upcoming-sessions")}
        >
          <h3>Upcoming Sessions</h3>
          <p>{upcomingSessions.length}</p>
        </div>

        <div className="therapist-dashboard__card therapist-dashboard__card--clickable" onClick={() => navigate("/booking-history")}>
          <h3>Booking History</h3>
          <p>View all sessions</p>
        </div>

        <div className="therapist-dashboard__card">
          <h3>Status</h3>
          <p className={`therapist-dashboard__status-value ${isAvailable ? "therapist-dashboard__status-value--available" : "therapist-dashboard__status-value--unavailable"}`}>
            {isAvailable ? "Available" : "Not Available"}
          </p>

          <button onClick={() => setIsAvailable(!isAvailable)} className="therapist-dashboard__status-button">
            Toggle Status
          </button>
        </div>
      </div>

      <h2 ref={upcomingRef} className="therapist-dashboard__upcoming-title">
        Upcoming Sessions
      </h2>

      {upcomingSessions.map((session) => (
        <div key={session.id} className="therapist-dashboard__session">
          <p>
            <strong>Client:</strong> {session.client}
          </p>
          <p>
            <strong>Date:</strong> {session.date}
          </p>
          <p>
            <strong>Time:</strong> {session.time}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TherapistDashboard;
