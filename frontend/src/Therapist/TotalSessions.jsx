import React from "react";

const TotalSessions = () => {
  // Dummy past sessions (later from backend)
  const pastSessions = [
    { id: 1, client: "John Doe", date: "2025-02-20", time: "09:00 AM" },
    { id: 2, client: "Jane Smith", date: "2025-02-22", time: "01:00 PM" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Total Sessions</h1>
      <p>Completed therapy sessions</p>

      {pastSessions.map((session) => (
        <div
          key={session.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "6px",
          }}
        >
          <p><strong>Client:</strong> {session.client}</p>
          <p><strong>Date:</strong> {session.date}</p>
          <p><strong>Time:</strong> {session.time}</p>
        </div>
      ))}
    </div>
  );
};

export default TotalSessions;