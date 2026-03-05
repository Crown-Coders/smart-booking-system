// src/Pages/users/UserDashboard.jsx
import React, { useState, useEffect } from 'react';  // Add this line

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        console.log("User data:", data);
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Rest of your component remains the same...
  const upcomingAppointments = [
    { id: 1, date: '2024-03-15', time: '10:00 AM', therapist: 'Dr. Smith', status: 'Confirmed' },
    { id: 2, date: '2024-03-18', time: '2:00 PM', therapist: 'Dr. Johnson', status: 'Pending' },
  ];

  const unreadMessages = 3;

  // Add loading check
  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container {
          padding: 5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome-section {
          margin-bottom: 2rem;
        }

        .welcome-section h1 {
          color: #002324;
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }

        .welcome-section p {
          color: #A1AD95;
          font-size: 1.1rem;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border-left: 4px solid #002324;
        }

        .stat-card h3 {
          color: #002324;
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 600;
          color: #A1AD95;
        }

        .appointments-table {
          background: white;
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .appointments-table h2 {
          color: #002324;
          margin: 0 0 1.5rem 0;
          font-size: 1.3rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 1rem 0.5rem;
          color: #A1AD95;
          font-weight: 600;
          border-bottom: 2px solid #E5DDDE;
        }

        td {
          padding: 1rem 0.5rem;
          border-bottom: 1px solid #E5DDDE;
          color: #002324;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .status-confirmed {
          background-color: #d4edda;
          color: #155724;
        }

        .status-pending {
          background-color: #fff3cd;
          color: #856404;
        }

        .btn-view {
          background-color: #002324;
          color: #E5DDDE;
          border: none;
          padding: 0.4rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .btn-view:hover {
          background-color: #A1AD95;
          color: #002324;
        }
      `}</style>

      <div className="welcome-section">
        <h1>Welcome back, {user?.name || user?.email || "User"}! 👋</h1>
        <p>Here's what's happening with your appointments today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Upcoming Appointments</h3>
          <div className="stat-number">{upcomingAppointments.length}</div>
        </div>
        <div className="stat-card">
          <h3>Unread Messages</h3>
          <div className="stat-number">{unreadMessages}</div>
        </div>
        <div className="stat-card">
          <h3>Total Sessions</h3>
          <div className="stat-number">12</div>
        </div>
      </div>

      <div className="appointments-table">
        <h2>Upcoming Appointments</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Therapist</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {upcomingAppointments.map(apt => (
              <tr key={apt.id}>
                <td>{apt.date}</td>
                <td>{apt.time}</td>
                <td>{apt.therapist}</td>
                <td>
                  <span className={`status-badge status-${apt.status.toLowerCase()}`}>
                    {apt.status}
                  </span>
                </td>
                <td>
                  <button className="btn-view">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDashboard;