import { Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch therapists
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/therapists");
        const data = await response.json();
        setTherapists(data);
      } catch (error) {
        console.error("Failed to fetch therapists:", error);
      }
    };

    fetchTherapists();
  }, []);

  // Fetch user's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/bookings/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        console.log("Appointments:", data);
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleView = (apt) => {
    setSelectedAppointment(apt);
    setShowViewModal(true);
  };

  const handleBook = (therapist) => {
    setSelectedTherapist(therapist);
    setShowBookModal(true);
  };

  // Helper function to convert slotId to time
  const getTimeFromSlotId = (slotId) => {
    if (!slotId) return { start: "Unknown", end: "Unknown" };
    const startHour = 7 + parseInt(slotId);
    const endHour = startHour + 1;
    
    const formatHour = (hour) => {
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour;
      return `${displayHour}:00 ${ampm}`;
    };
    
    return {
      start: formatHour(startHour),
      end: formatHour(endHour)
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch(status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'badge-confirmed';
      case 'PENDING':
        return 'badge-pending';
      default:
        return 'badge-pending';
    }
  };

  const upcomingCount = appointments.filter(apt => 
    apt.status === 'PENDING' || apt.status === 'CONFIRMED'
  ).length;

  const totalCount = appointments.length;

  if (loading || appointmentsLoading) return <div className="p-5">Loading...</div>;

  return (
    <>
      <style>{`
        .dashboard {
          padding: 30px;
          background: #f9faf9;
          min-height: 100vh;
        }

        .header {
          margin-bottom: 30px;
        }

        .header h1 {
          color: #002324;
          font-weight: 600;
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }

        .header p {
          color: #a1ad95;
          font-size: 1.1rem;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
        }

        .stat-card p {
          color: #002324;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 600;
          color: #a1ad95;
        }

        .appointments {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          margin-bottom: 2.5rem;
        }

        .appointments h2 {
          color: #002324;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .appointment {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .appointment:last-child {
          border-bottom: none;
        }

        .appointment-info h4 {
          color: #002324;
          font-size: 1.1rem;
          margin: 0 0 0.25rem 0;
        }

        .appointment-info p {
          color: #666;
          font-size: 0.95rem;
          margin: 0;
        }

        .appointment-date {
          color: #a1ad95;
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .badge-confirmed {
          background-color: #a1ad95;
          color: #002324;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          display: inline-block;
          font-size: 0.9rem;
        }

        .badge-pending {
          background-color: #ebfacf;
          color: #002324;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          display: inline-block;
          font-size: 0.9rem;
        }

        .btn-view {
          background-color: #002324;
          color: #ebfacf;
          border: none;
          border-radius: 30px;
          padding: 0.4rem 1.2rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          cursor: pointer;
          margin-left: 1rem;
        }

        .btn-view:hover {
          background-color: #a1ad95;
          color: #002324;
        }

        .section-title {
          color: #002324;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 2rem 0 1.5rem 0;
        }

        .therapist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .therapist-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
        }

        .therapist-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .therapist-body {
          padding: 18px;
        }

        .therapist-body h5 {
          color: #002324;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .therapist-body p {
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
        }

        .therapist-body small {
          color: #a1ad95;
          font-size: 0.85rem;
        }

        .book-btn {
          background-color: #002324;
          color: white;
          border: none;
          border-radius: 30px;
          padding: 0.5rem 1.5rem;
          font-size: 0.95rem;
          margin-top: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .book-btn:hover {
          background-color: #a1ad95;
          color: #002324;
        }

        .no-bookings {
          text-align: center;
          padding: 2rem;
          color: #a1ad95;
          font-size: 1rem;
        }

        .appointment-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        /* Simple One-Card Modal */
        .modal-content {
          border-radius: 20px;
          border: none;
          box-shadow: 0 20px 40px rgba(0, 35, 36, 0.2);
        }

        .modal-header {
          background: #002324;
          color: white;
          border-bottom: none;
          padding: 1.2rem 1.5rem;
          border-radius: 20px 20px 0 0;
        }

        .modal-header .modal-title {
          font-size: 1.3rem;
          font-weight: 600;
        }

        .modal-header .btn-close {
          filter: brightness(0) invert(1);
        }

        .modal-body {
          padding: 1.5rem;
          background: white;
        }

        .detail-item {
          margin-bottom: 1rem;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid #eee;
        }

        .detail-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .detail-label {
          color: #a1ad95;
          font-size: 0.85rem;
          margin-bottom: 0.2rem;
        }

        .detail-value {
          color: #002324;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .notes-box {
          margin-top: 1rem;
          padding: 1rem;
          background: #ebfacf;
          border-radius: 10px;
        }

        .modal-footer {
          border-top: 1px solid #eee;
          padding: 1rem 1.5rem;
          justify-content: center;
        }

        .btn-close-modal {
          background: #002324;
          color: white;
          border: none;
          border-radius: 30px;
          padding: 0.6rem 2rem;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .btn-close-modal:hover {
          background: #a1ad95;
          color: #002324;
        }
      `}</style>

      <div className="dashboard">
        <div className="header">
          <h1>Welcome back, {user?.name || user?.email} 👋</h1>
          <p>Your wellness journey continues today.</p>
        </div>

        <div className="stats">
          <div className="stat-card">
            <p>Upcoming Appointments</p>
            <div className="stat-number">{upcomingCount}</div>
          </div>
          <div className="stat-card">
            <p>Total Sessions</p>
            <div className="stat-number">{totalCount}</div>
          </div>
          <div className="stat-card">
            <p>Completed Sessions</p>
            <div className="stat-number">0</div>
          </div>
        </div>

        <div className="appointments">
          <h2>My Appointments</h2>
          
          {appointments.length === 0 ? (
            <div className="no-bookings">
              <p>You don't have any appointments yet. Book a therapist below!</p>
            </div>
          ) : (
            appointments.map((apt) => {
              const times = getTimeFromSlotId(apt.availabilitySlotId);
              return (
                <div key={apt.id} className="appointment">
                  <div className="appointment-info">
                    <h4>Dr. {apt.therapist?.name || 'Therapist'}</h4>
                    <p>{apt.therapist?.specialization || 'Therapy Session'}</p>
                    <div className="appointment-date">
                      {formatDate(apt.createdAt)} • {times.start} - {times.end}
                    </div>
                  </div>
                  <div className="appointment-actions">
                    <span className={getStatusBadgeClass(apt.status)}>
                      {apt.status}
                    </span>
                    <button
                      className="btn-view"
                      onClick={() => handleView({...apt, times})}
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <h2 className="section-title">Book a Therapist</h2>
        <div className="therapist-grid">
          {therapists.map((therapist) => (
            <div key={therapist.id} className="therapist-card">
              <img 
                src={therapist.image || 'https://via.placeholder.com/300x200?text=Therapist'} 
                alt={therapist.user?.name} 
              />
              <div className="therapist-body">
                <h5>Dr. {therapist.user?.name}</h5>
                <p>{therapist.specialization}</p>
                <small>{therapist.yearsOfExperience} years experience</small>
                <button
                  className="book-btn"
                  onClick={() => handleBook(therapist)}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple One-Card View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Session Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <div className="detail-item">
                <div className="detail-label">Therapist</div>
                <div className="detail-value">Dr. {selectedAppointment.therapist?.name}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Specialization</div>
                <div className="detail-value">{selectedAppointment.therapist?.specialization || 'Therapy Session'}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Session Date</div>
                <div className="detail-value">{formatDate(selectedAppointment.createdAt)}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Session Time</div>
                <div className="detail-value">{selectedAppointment.times?.start} - {selectedAppointment.times?.end}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Booked On</div>
                <div className="detail-value">{formatDateTime(selectedAppointment.createdAt)}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Status</div>
                <div className="detail-value">
                  <span className={getStatusBadgeClass(selectedAppointment.status)}>
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>
              
              {selectedAppointment.notes && (
                <div className="notes-box">
                  <strong>Notes:</strong> {selectedAppointment.notes}
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-close-modal" onClick={() => setShowViewModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {/* Book Therapist Modal */}
      <Modal show={showBookModal} onHide={() => setShowBookModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTherapist && (
            <>
              <div className="detail-item">
                <div className="detail-label">Therapist</div>
                <div className="detail-value">Dr. {selectedTherapist.user?.name}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Specialization</div>
                <div className="detail-value">{selectedTherapist.specialization}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Experience</div>
                <div className="detail-value">{selectedTherapist.yearsOfExperience} years</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Session Fee</div>
                <div className="detail-value">R800 / hour</div>
              </div>
              <button
                className="book-btn"
                onClick={() => navigate("/calendar", { state: { therapist: selectedTherapist } })}
              >
                Proceed to Booking
              </button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UserDashboard;