import React, { useState, useEffect } from "react";
import { Container, Table, Badge, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch user's appointments
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (!user?.id) return;

      const response = await fetch(`http://localhost:5000/api/bookings/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch appointments");

      const data = await response.json();
      console.log("Appointments:", data);
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (apt) => {
    setSelectedAppointment(apt);
    setShowViewModal(true);
  };

  const handleCancel = (apt) => {
    setSelectedAppointment(apt);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
  if (!selectedAppointment) return;
  
  setCancelLoading(true);
  try {
    const token = localStorage.getItem("token");
    
    // Use DELETE method with the correct endpoint
    const response = await fetch(`http://localhost:5000/api/bookings/${selectedAppointment.id}`, {
      method: "DELETE", // Changed from PATCH to DELETE
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
      // No body needed for DELETE
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to cancel appointment");
    }

    const data = await response.json();
    
    // Refresh appointments list
    await fetchAppointments();
    setShowCancelModal(false);
    alert(data.message || "Your appointment has been cancelled. No refund will be issued.");
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    alert(error.message || "Failed to cancel appointment. Please try again.");
  } finally {
    setCancelLoading(false);
  }
};

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString || timeString === "Unknown") return "Unknown";
    
    // Handle if time is already formatted with AM/PM
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    
    // Format from "09:00" to "9:00 AM"
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get therapist full name with surname
  const getTherapistFullName = (therapist) => {
    if (!therapist?.name) return "Unknown Therapist";
    
    // If name already includes Dr. prefix, use as is
    if (therapist.name.startsWith("Dr.")) return therapist.name;
    
    // Add Dr. prefix and ensure surname is included
    return `Dr. ${therapist.name}`;
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'badge-confirmed';
      case 'PENDING':
        return 'badge-pending';
      case 'CANCELLED':
        return 'badge-cancelled';
      default:
        return 'badge-pending';
    }
  };

  if (loading) {
    return (
      <Container fluid className="soft-appointments py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your appointments...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* Custom soft styles */}
      <style>{`
        .soft-appointments {
          background-color: #f9faf9;
          min-height: 100vh;
        }
        .soft-appointments .page-header {
          color: #002324;
          font-weight: 600;
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }
        /* Soften the table */
        .soft-appointments .table {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          border: none;
        }
        .soft-appointments .table thead th {
          background-color: #e5ddde;
          color: #002324;
          font-weight: 600;
          border-bottom: none;
          padding: 1rem;
        }
        .soft-appointments .table tbody td {
          background-color: white;
          padding: 1rem;
          vertical-align: middle;
          border-color: #f0f0f0;
        }
        .soft-appointments .table tbody tr:last-child td {
          border-bottom: none;
        }
        /* Custom badges */
        .soft-appointments .badge-confirmed {
          background-color: #a1ad95;
          color: #002324;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          display: inline-block;
        }
        .soft-appointments .badge-pending {
          background-color: #ebfacf;
          color: #002324;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          display: inline-block;
        }
        .soft-appointments .badge-cancelled {
          background-color: #f8d7da;
          color: #721c24;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          display: inline-block;
        }
        /* Soft buttons */
        .soft-appointments .btn-soft-primary {
          background-color: #002324;
          color: #ebfacf;
          border: none;
          border-radius: 30px;
          padding: 0.4rem 1.2rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .soft-appointments .btn-soft-primary:hover {
          background-color: #a1ad95;
          color: #002324;
        }
        .soft-appointments .btn-soft-outline {
          background: transparent;
          border: 2px solid #002324;
          color: #002324;
          border-radius: 30px;
          padding: 0.4rem 1.2rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .soft-appointments .btn-soft-outline:hover {
          background-color: #002324;
          color: white;
        }
        .soft-appointments .btn-soft-danger {
          background: transparent;
          border: 2px solid #dc3545;
          color: #dc3545;
          border-radius: 30px;
          padding: 0.4rem 1.2rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .soft-appointments .btn-soft-danger:hover {
          background-color: #dc3545;
          color: white;
        }
        .soft-appointments .btn-soft-danger:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        /* Book new appointment button */
        .soft-appointments .btn-book {
          background-color: #002324;
          color: #ebfacf;
          border: none;
          border-radius: 30px;
          padding: 0.8rem 2rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .soft-appointments .btn-book:hover {
          background-color: #a1ad95;
          color: #002324;
        }
        /* Modals */
        .soft-appointments .modal-content {
          border-radius: 20px;
          border: none;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .soft-appointments .modal-header {
          background: linear-gradient(135deg, #e5ddde, #a1ad95);
          color: #002324;
          border-bottom: none;
          border-radius: 20px 20px 0 0;
          padding: 1.5rem;
        }
        .soft-appointments .modal-header .btn-close {
          filter: brightness(0) invert(0.2);
        }
        .soft-appointments .modal-body {
          padding: 2rem;
        }
        .soft-appointments .modal-footer {
          border-top: none;
          padding: 1.5rem;
        }
        .soft-appointments .refund-notice {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          font-size: 0.95rem;
        }
        .soft-appointments .refund-notice strong {
          color: #856404;
        }
        /* Empty state */
        .soft-appointments .empty-state {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }
        .soft-appointments .empty-state p {
          color: #a1ad95;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }
        /* Responsive tweaks */
        @media (max-width: 768px) {
          .soft-appointments .table thead {
            display: none;
          }
          .soft-appointments .table tbody tr {
            display: block;
            margin-bottom: 1.5rem;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          .soft-appointments .table tbody td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #f0f0f0;
          }
          .soft-appointments .table tbody td:last-child {
            border-bottom: none;
          }
          .soft-appointments .table tbody td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #002324;
            margin-right: 1rem;
          }
        }
      `}</style>

      <Container fluid className="soft-appointments py-4">
        <h1 className="page-header">My Appointments</h1>

        {appointments.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any appointments yet.</p>
            <button className="btn-book" onClick={() => navigate("/calendar")}>
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <Table className="align-middle">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Therapist</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => {
                    const sessionDate = apt.displayDate || formatDate(apt.bookingDate);
                    const startTime = apt.displayStartTime || formatTime(apt.startTime);
                    const endTime = apt.displayEndTime || formatTime(apt.endTime);
                    const therapistName = getTherapistFullName(apt.therapist);
                    
                    return (
                      <tr key={apt.id}>
                        <td data-label="Date">{sessionDate}</td>
                        <td data-label="Time">{startTime} - {endTime}</td>
                        <td data-label="Therapist">{therapistName}</td>
                        <td data-label="Status">
                          <span className={getStatusBadgeClass(apt.status)}>
                            {apt.status}
                          </span>
                        </td>
                        <td data-label="Actions">
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button className="btn-soft-primary" onClick={() => handleView(apt)}>
                              View
                            </button>
                            {apt.status !== 'CANCELLED' && (
                              <button className="btn-soft-danger" onClick={() => handleCancel(apt)}>
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

            <button className="btn-book mt-3" onClick={() => navigate("/calendar")}>
              Book New Appointment
            </button>
          </>
        )}

        {/* View Modal */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Appointment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && (
              <div>
                <p><strong>Therapist:</strong> {getTherapistFullName(selectedAppointment.therapist)}</p>
                <p><strong>Specialization:</strong> {selectedAppointment.therapist?.specialization || 'Therapy Session'}</p>
                <p><strong>Session Date:</strong> {selectedAppointment.displayDate || formatDate(selectedAppointment.bookingDate)}</p>
                <p><strong>Session Time:</strong> {selectedAppointment.displayStartTime || formatTime(selectedAppointment.startTime)} - {selectedAppointment.displayEndTime || formatTime(selectedAppointment.endTime)}</p>
                <p><strong>Booked On:</strong> {formatDate(selectedAppointment.createdAt)}</p>
                <p><strong>Status:</strong> <span className={getStatusBadgeClass(selectedAppointment.status)}>{selectedAppointment.status}</span></p>
                {selectedAppointment.notes && (
                  <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn-soft-outline" onClick={() => setShowViewModal(false)}>
              Close
            </button>
          </Modal.Footer>
        </Modal>

        {/* Cancel Modal with Refund Notice */}
        <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Cancellation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && (
              <>
                <p>
                  Are you sure you want to cancel your appointment with{" "}
                  <strong>{getTherapistFullName(selectedAppointment.therapist)}</strong> on{" "}
                  <strong>{selectedAppointment.displayDate || formatDate(selectedAppointment.bookingDate)}</strong> at{" "}
                  <strong>{selectedAppointment.displayStartTime || formatTime(selectedAppointment.startTime)}</strong>?
                </p>
                <div className="refund-notice">
                  <strong>⚠️ No Refund Policy</strong>
                  <p className="mb-0 mt-2">
                    Please note that cancellations are non-refundable. The full session fee will still be charged.
                  </p>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn-soft-outline" onClick={() => setShowCancelModal(false)}>
              No, Keep It
            </button>
            <button 
              className="btn-soft-danger" 
              onClick={confirmCancel}
              disabled={cancelLoading}
            >
              {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
            </button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default MyAppointments;