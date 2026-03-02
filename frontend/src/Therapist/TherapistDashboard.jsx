import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";


const TherapistDashboard = () => {
  const upcomingRef = useRef(null);
  const navigate = useNavigate();

  // Availability state
  const [isAvailable, setIsAvailable] = useState(true);

  // Dummy data (later from backend)
  const upcomingSessions = [
    { id: 1, client: "John Doe", date: "2025-03-10", time: "10:00 AM" },
    { id: 2, client: "Jane Smith", date: "2025-03-11", time: "2:00 PM" },
  ];

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1>Therapist Dashboard</h1>
          <p>Welcome back! Here's an overview of your activity.</p>
        </div>

        <button
          onClick={() => navigate("/profile")}
          style={profileButtonStyle}
        >
          View Profile
        </button>
      </div>

      {/* Cards */}
      <div style={cardsWrapper}>
  {/* Total Sessions */}
  <div
    style={clickableCard}
    onClick={() => navigate("/total-sessions")}
  >
    <h3>Total Sessions</h3>
    <p>24</p>
  </div>

  {/* Upcoming Sessions */}
  <div
    style={clickableCard}
   onClick={() => {
  upcomingRef.current?.scrollIntoView({ behavior: "smooth" });
}}
  >
    <h3>Upcoming Sessions</h3>
    <p>{upcomingSessions.length}</p>
  </div>

  {/* âœ… BOOKING HISTORY CARD â€” ADD THIS */}
  <div
    style={clickableCard}
    onClick={() => navigate("/booking-history")}
  >
    <h3>Booking History</h3>
    <p>View all sessions</p>
  </div>

  {/* Availability */}
  <div style={cardStyle}>
    <h3>Status</h3>
    <p style={{ fontWeight: "bold", color: isAvailable ? "green" : "red" }}>
      {isAvailable ? "Available" : "Not Available"}
    </p>

    <button
      onClick={() => setIsAvailable(!isAvailable)}
      style={statusButton}
    >
      Toggle Status
    </button>
  </div>
</div>
      {/* Upcoming Sessions List */}
     <h2 ref={upcomingRef} style={{ marginTop: "30px" }}>
  Upcoming Sessions
</h2>

      {upcomingSessions.map((session) => (
        <div key={session.id} style={sessionStyle}>
          <p><strong>Client:</strong> {session.client}</p>
          <p><strong>Date:</strong> {session.date}</p>
          <p><strong>Time:</strong> {session.time}</p>
        </div>
      ))}
    </div>
  );
};

/* ===== Styles ===== */

const pageStyle = {
  padding: "20px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "15px",
};

const cardsWrapper = {
  display: "flex",
  gap: "20px",
  marginTop: "30px",
  flexWrap: "wrap",
};

const cardStyle = {
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "8px",
  minWidth: "220px",
  flex: "1",
};

const clickableCard = {
  ...cardStyle,
  cursor: "pointer",
  backgroundColor: "#f9fafb",
};

const sessionStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "6px",
};

const profileButtonStyle = {
  padding: "10px 16px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#4F46E5",
  color: "#fff",
  cursor: "pointer",
};

const statusButton = {
  marginTop: "10px",
  padding: "6px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#111827",
  color: "white",
};

export default TherapistDashboard;
