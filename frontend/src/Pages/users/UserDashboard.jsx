import { Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const navigate = useNavigate();


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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* Example therapists (replace later with API) */
  const [therapists, setTherapists] = useState([]);
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/therapists`);
        const data = await response.json();

        setTherapists(data);
      } catch (error) {
        console.error("Failed to fetch therapists:", error);
      }
    };

  fetchTherapists();
}, []);


  const upcomingAppointments = [
    {
      id: 1,
      date: "2024-03-15",
      time: "10:00 AM",
      therapist: "Dr. Smith",
      status: "confirmed",
      notes: "Follow-up session",
    },
  ];

  const handleView = (apt) => {
    setSelectedAppointment(apt);
    setShowViewModal(true);
  };

  const handleBook = (therapist) => {
    setSelectedTherapist(therapist);
    setShowBookModal(true);
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

      .therapist-grid{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
        gap:20px;
      }

      .therapist-card{
        background:white;
        border-radius:16px;
        overflow:hidden;
        box-shadow:0 6px 18px rgba(0,0,0,0.05);
      }

      .therapist-card img{
        width:100%;
        height:200px;
        object-fit:cover;
      }

      .therapist-body{
        padding:18px;
      }

      .book-btn{
        background:#002324;
        color:white;
        border:none;
        padding:8px 16px;
        border-radius:20px;
        margin-top:10px;
      }

      .book-btn:hover{
        background:#a1ad95;
        color:#002324;
      }

      .badge-confirmed{
        background:#a1ad95;
        padding:4px 12px;
        border-radius:20px;
      }

      `}</style>

      <div className="dashboard">

        {/* Header */}
        <div className="header">
          <h1>Welcome back, {user?.name || user?.email} 👋</h1>
          <p>Your wellness journey continues today.</p>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <p>Upcoming Appointments</p>
            <div className="stat-number">{upcomingAppointments.length}</div>
          </div>

          <div className="stat-card">
            <p>Total Sessions</p>
            <div className="stat-number">12</div>
          </div>

          <div className="stat-card">
            <p>Unread Messages</p>
            <div className="stat-number">3</div>
          </div>
        </div>

        {/* Appointments */}
        <div className="appointments">
          <h3>My Appointments</h3>

          {upcomingAppointments.map((apt) => (
            <div key={apt.id} className="appointment">

              <div>
                <strong>{apt.therapist}</strong>
                <div>{apt.date} • {apt.time}</div>
              </div>

              <div>
                <span className="badge-confirmed">{apt.status}</span>

                <button
                  className="book-btn ms-3"
                  onClick={() => handleView(apt)}
                >
                  View
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Therapist Booking Section */}
        <h2 className="mb-3">Book a Therapist</h2>

        <div className="therapist-grid">

          {therapists.map((therapist) => (

            <div key={therapist.id} className="therapist-card">

            <img
  src={therapist.image ? therapist.image : "https://i.pravatar.cc/150?img=12"}
  alt={therapist.user?.name}
  onError={(e) => {
    e.target.src = "https://i.pravatar.cc/150?img=12";
  }}
/>

              <div className="therapist-body">

                <h5>Dr. {therapist.user?.name}</h5>

                <p>{therapist.specialization}</p>

                <small>{therapist.yearsOfExperience} experience</small>

                <br />

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

      {/* View Appointment Modal */}
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
              <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
            </>
          )}

        </Modal.Body>

      </Modal>

      {/* Book Therapist Modal */}
      <Modal show={showBookModal} onHide={() => setShowBookModal(false)} centered>

        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {selectedTherapist && (
            <>
              <h5>{selectedTherapist.user?.name}</h5>

              <p>{selectedTherapist.specialization}</p>

              <p>Session Fee: <strong>R800</strong></p>

            <button
              className="book-btn"
              onClick={() =>
                navigate("/calendar", {
                  state: { therapist: selectedTherapist }
                })
              }
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
