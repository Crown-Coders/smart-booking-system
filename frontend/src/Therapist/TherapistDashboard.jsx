import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS

const TherapistDashboard = () => {
  const navigate = useNavigate(); // ✅ ADD THIS

  // Dummy data (later this will come from backend)
  const upcomingSessions = [
    { id: 1, client: "John Doe", date: "2025-03-10", time: "10:00 AM" },
    { id: 2, client: "Jane Smith", date: "2025-03-11", time: "2:00 PM" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Therapist Dashboard</h1>
          <p>Welcome back! Here’s an overview of your activity.</p>
        </div>

        {/* ✅ PROFILE BUTTON — PUT IT HERE */}
        <button
          onClick={() => navigate("/profile")}
          style={profileButtonStyle}
        >
          View Profile
        </button>
      </div>

      {/* Stats Section */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h3>Total Sessions</h3>
          <p>24</p>
        </div>

        <div style={cardStyle}>
          <h3>Upcoming Sessions</h3>
          <p>{upcomingSessions.length}</p>
        </div>

        <div style={cardStyle}>
          <h3>Status</h3>
          <p>Available</p>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <h2 style={{ marginTop: "30px" }}>Upcoming Sessions</h2>

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

// Simple styles
const cardStyle = {
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "8px",
  width: "200px",
};

const sessionStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "6px",
};

// ✅ PROFILE BUTTON STYLE
const profileButtonStyle = {
  padding: "10px 16px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#4F46E5",
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
};

export default TherapistDashboard;