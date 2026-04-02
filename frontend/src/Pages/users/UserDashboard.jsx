import { Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [therapists, setTherapists] = useState({}); // Store therapists by ID
  const [stats, setStats] = useState({
    upcoming: 0,
    totalSessions: 0,
    paidSessions: 0
  });

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const navigate = useNavigate();

  // Fetch all therapists and store them in a map
  const fetchTherapists = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/therapists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const therapistsData = await response.json();
        // Create a map of therapist profiles by ID for easy lookup
        const therapistMap = {};
        therapistsData.forEach(therapist => {
          therapistMap[therapist.id] = therapist;
        });
        setTherapists(therapistMap);
      }
    } catch (err) {
      console.error("Error fetching therapists:", err);
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data);
        
        // Fetch therapists first
        await fetchTherapists();
        
        // After getting user and therapists, fetch their appointments
        if (data?.id) {
          fetchUserAppointments(data.id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch user appointments
  const fetchUserAppointments = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
        calculateStats(data);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  // Calculate dashboard stats
  const calculateStats = (appointmentsData) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const upcoming = appointmentsData.filter(apt => 
      apt.bookingDate >= today && apt.status !== "CANCELLED"
    ).length;
    
    const totalSessions = appointmentsData.length;
    
    const paidSessions = appointmentsData.filter(apt => 
      apt.status === "CONFIRMED" || apt.status === "COMPLETED"
    ).length;
    
    setStats({
      upcoming,
      totalSessions,
      paidSessions
    });
  };

  // Get therapist full name from therapist ID
  const getTherapistName = (therapistId) => {
    const therapist = therapists[therapistId];
    if (therapist && therapist.user) {
      return therapist.user.name; // This should be full name (first + last)
    }
    return `Therapist #${therapistId}`; // Fallback
  };

  // Format time to display both start and end
  const formatTimeRange = (startTime, endTime) => {
    // Convert time strings to display format (remove seconds if present)
    const start = startTime?.substring(0, 5); // Gets HH:MM
    const end = endTime?.substring(0, 5); // Gets HH:MM
    return `${start} - ${end}`;
  };

  // Format date to more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleView = (apt) => {
    setSelectedAppointment(apt);
    setShowViewModal(true);
  };

  const handleBook = () => {
    navigate("/services");
  };

  if (loading) return <div className="p-5">Loading...</div>;

  return (
    <>
      <style>{`
        .dashboard{
          padding:30px;
          background:#f9faf9;
          min-height:100vh;
        }

        .header{
          margin-bottom:30px;
        }

        .header h1{
          color:#002324;
          font-weight:600;
        }

        .stats{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
          gap:20px;
          margin-bottom:30px;
        }

        .stat-card{
          background:white;
          border-radius:15px;
          padding:20px;
          box-shadow:0 6px 18px rgba(0,0,0,0.05);
        }

        .stat-number{
          font-size:28px;
          font-weight:600;
          color:#002324;
        }

        .appointments{
          background:white;
          padding:20px;
          border-radius:15px;
          margin-bottom:40px;
          box-shadow:0 6px 18px rgba(0,0,0,0.05);
        }

        .appointment{
          display:flex;
          justify-content:space-between;
          padding:12px 0;
          border-bottom:1px solid #eee;
        }

        .badge-confirmed{
          background:#a1ad95;
          padding:4px 12px;
          border-radius:20px;
          color: #002324;
          font-weight:500;
        }
        
        .badge-pending{
          background:#ebfacf;
          padding:4px 12px;
          border-radius:20px;
          color: #002324;
          font-weight:500;
        }
        
        .badge-cancelled{
          background:#dc3545;
          padding:4px 12px;
          border-radius:20px;
          color: white;
          font-weight:500;
        }
        
        .badge-confirmed{
          background:#a1ad95;
          padding:4px 12px;
          border-radius:20px;
          color: #002324;
          font-weight:500;
        }
        
        .badge-completed{
          background:#28a745;
          padding:4px 12px;
          border-radius:20px;
          color: white;
          font-weight:500;
        }

        .book-btn{
          background:#002324;
          color:white;
          border:none;
          padding:8px 16px;
          border-radius:20px;
          margin-top:10px;
          cursor:pointer;
        }

        .book-btn:hover{
          background:#a1ad95;
          color:#002324;
        }

        .services-prompt {
          background: white;
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 6px 18px rgba(0,0,0,0.05);
        }

        .services-prompt h3 {
          color: #002324;
          margin-bottom: 20px;
        }

        .services-prompt p {
          color: #666;
          margin-bottom: 30px;
        }

        .browse-services-btn {
          background: #002324;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 30px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .browse-services-btn:hover {
          background: #a1ad95;
          color: #002324;
        }
        
        .no-appointments {
          text-align: center;
          padding: 30px;
          color: #666;
        }
        
        .therapist-name {
          font-weight: 600;
          color: #002324;
        }
      `}</style>

      <div className="dashboard">
        {/* Header */}
        <div className="header">
          <h1>Welcome back, {user?.name || user?.email} 👋</h1>
          <p>Your wellness journey continues today.</p>
        </div>

        {/* Stats - Now with real data */}
        <div className="stats">
          <div className="stat-card">
            <p>Upcoming Appointments</p>
            <div className="stat-number">{stats.upcoming}</div>
          </div>

          <div className="stat-card">
            <p>Total Sessions</p>
            <div className="stat-number">{stats.totalSessions}</div>
          </div>

          <div className="stat-card">
            <p>Paid Sessions</p>
            <div className="stat-number">{stats.paidSessions}</div>
          </div>
        </div>

        {/* Appointments - Now with real data and therapist names */}
        <div className="appointments">
          <h3>My Appointments</h3>

          {appointments.length > 0 ? (
            appointments.map((apt) => (
              <div key={apt.id} className="appointment">
                <div>
                  <div className="therapist-name">{getTherapistName(apt.therapistId)}</div>
                  <div>
                    {formatDate(apt.bookingDate)} • {formatTimeRange(apt.startTime, apt.endTime)}
                  </div>
                  {apt.notes && <small style={{color: '#666'}}>Note: {apt.notes}</small>}
                </div>

                <div>
                  <span className={`badge-${apt.status?.toLowerCase() || 'pending'}`}>
                    {apt.status || 'PENDING'}
                  </span>
                  <button
                    className="book-btn ms-3"
                    onClick={() => handleView(apt)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-appointments">
              <p>You don't have any appointments yet.</p>
              <button className="browse-services-btn" onClick={handleBook}>
                Book Your First Session
              </button>
            </div>
          )}
        </div>

        {/* Browse Services Section - Show only if no appointments or always show */}
        {appointments.length > 0 && (
          <div className="services-prompt">
            <h3>Need Another Session?</h3>
            <p>Browse our services to find more therapists specialized in what you need</p>
            <button className="browse-services-btn" onClick={handleBook}>
              Browse Services
            </button>
          </div>
        )}
      </div>

      {/* View Appointment Modal - Now with real data and therapist name */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedAppointment && (
            <>
              <p><strong>Booking ID:</strong> #{selectedAppointment.id}</p>
              <p><strong>Therapist:</strong> {getTherapistName(selectedAppointment.therapistId)}</p>
              <p><strong>Date:</strong> {formatDate(selectedAppointment.bookingDate)}</p>
              <p><strong>Time:</strong> {formatTimeRange(selectedAppointment.startTime, selectedAppointment.endTime)}</p>
              <p><strong>Status:</strong> 
                <span className={`ms-2 badge-${selectedAppointment.status?.toLowerCase() || 'pending'}`}>
                  {selectedAppointment.status || 'PENDING'}
                </span>
              </p>
              {selectedAppointment.notes && (
                <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
              )}
              <p><strong>Booked on:</strong> {new Date(selectedAppointment.createdAt).toLocaleDateString()}</p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UserDashboard;