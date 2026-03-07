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
    { id: 1, date: "2024-03-15", time: "10:00 AM", therapist: "Dr. Smith", status: "confirmed", notes: "Follow-up session" },
    { id: 2, date: "2024-03-18", time: "2:00 PM", therapist: "Dr. Johnson", status: "pending", notes: "Initial consultation" },
  ];

  const unreadMessages = 3;
  const totalSessions = 12;

  // Simulate fetching user name from auth
  useEffect(() => {
    // In real app, get from context or localStorage
    // For now, we'll keep "John" but you can set from token
    const token = localStorage.getItem("token");
    if (token) {
      // Decode token or fetch user data
      // setUserName(decoded.name);
    }
  }, []);

  const handleView = (apt) => {
    setSelectedAppointment(apt);
    setShowViewModal(true);
  };

  // Add loading check
  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <>
      <style>{`
        .soft-dashboard {
          background-color: #f9faf9;
          min-height: 100%;
          padding: 2rem;
        }

        /* Welcome header */
        .welcome-header {
          margin-bottom: 2rem;
        }
        .welcome-header h1 {
          color: #002324;
          font-weight: 600;
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }
        .welcome-header p {
          color: #a1ad95;
          font-size: 1.1rem;
        }

        /* Stats cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
        }
        .stat-card h3 {
          color: #002324;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }
        .stat-number {
          font-size: 2.5rem;
          font-weight: 600;
          color: #a1ad95;
        }

        /* Appointments section */
        .appointments-section {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }
        .appointments-section h2 {
          color: #002324;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        /* Soft table (same as MyAppointments) */
        .soft-table {
          width: 100%;
          border-collapse: collapse;
        }
        .soft-table thead th {
          background-color: #e5ddde;
          color: #002324;
          font-weight: 600;
          padding: 1rem;
          text-align: left;
        }
        .soft-table tbody td {
          background-color: white;
          padding: 1rem;
          border-bottom: 1px solid #f0f0f0;
          color: #002324;
        }
        .soft-table tbody tr:last-child td {
          border-bottom: none;
        }

        /* Badges */
        .badge-confirmed {
          background-color: #a1ad95;
          color: #002324;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          display: inline-block;
        }
        .badge-pending {
          background-color: #ebfacf;
          color: #002324;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          display: inline-block;
        }

        /* Buttons */
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

        /* Responsive table (mobile) */
        @media (max-width: 768px) {
          .soft-dashboard {
            padding: 1rem;
          }
          .soft-table thead {
            display: none;
          }
          .soft-table tbody tr {
            display: block;
            margin-bottom: 1.5rem;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          .soft-table tbody td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #f0f0f0;
          }
          .soft-table tbody td:last-child {
            border-bottom: none;
          }
          .soft-table tbody td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #002324;
            margin-right: 1rem;
          }
        }

        /* Modal styling (same as MyAppointments) */
        .modal-content {
          border-radius: 20px;
          border: none;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .modal-header {
          background: linear-gradient(135deg, #e5ddde, #a1ad95);
          color: #002324;
          border-bottom: none;
          border-radius: 20px 20px 0 0;
          padding: 1.5rem;
        }
        .modal-header .btn-close {
          filter: brightness(0) invert(0.2);
        }
        .modal-body {
          padding: 2rem;
        }
        .modal-footer {
          border-top: none;
          padding: 1.5rem;
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
      `}</style>

      <div className="welcome-section">
        <h1>Welcome back, {user?.name || user?.email || "User"}! 👋</h1>
        <p>Here's what's happening with your appointments today.</p>
      </div>

        {/* Stats cards */}
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
            <div className="stat-number">{totalSessions}</div>
          </div>
        </div>

        {/* Appointments table */}
        <div className="appointments-section">
          <h2>Upcoming Appointments</h2>
          <div className="table-responsive">
            <table className="soft-table">
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
                {upcomingAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td data-label="Date">{apt.date}</td>
                    <td data-label="Time">{apt.time}</td>
                    <td data-label="Therapist">{apt.therapist}</td>
                    <td data-label="Status">
                      <span className={apt.status === "confirmed" ? "badge-confirmed" : "badge-pending"}>
                        {apt.status}
                      </span>
                    </td>
                    <td data-label="Action">
                      <button className="btn-soft-primary" onClick={() => handleView(apt)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      

      {/* View Details Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <p><strong>Therapist:</strong> {selectedAppointment.therapist}</p>
              <p><strong>Date:</strong> {selectedAppointment.date}</p>
              <p><strong>Time:</strong> {selectedAppointment.time}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={selectedAppointment.status === "confirmed" ? "badge-confirmed" : "badge-pending"}>
                  {selectedAppointment.status}
                </span>
              </p>
              <p><strong>Notes:</strong> {selectedAppointment.notes || "No additional notes"}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-soft-outline" onClick={() => setShowViewModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


export default UserDashboard;