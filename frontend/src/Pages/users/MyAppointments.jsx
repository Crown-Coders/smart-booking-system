import React, { useState, useEffect } from "react";
import { Container, Table, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function MyAppointments() {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [therapists, setTherapists] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const navigate = useNavigate();

  // Fetch all therapists
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

  // Fetch user and their appointments
  useEffect(() => {
    const fetchUserAndAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // First get the logged in user
        const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          
          // Fetch therapists
          await fetchTherapists();
          
          // Then fetch their appointments
          const appointmentsResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/bookings/user/${userData.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (appointmentsResponse.ok) {
            const appointmentsData = await appointmentsResponse.json();
            setAppointments(appointmentsData);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndAppointments();
  }, []);

  // Get therapist display name (Dr. Lastname or full name, NO EMAIL)
  const getTherapistDisplayName = (therapistId) => {
    const therapist = therapists[therapistId];
    
    if (!therapist || !therapist.user) {
      return `Therapist #${therapistId}`;
    }

    const fullName = therapist.user.name || "";
    
    // Clean the name - remove any email-looking parts
    const cleanName = fullName.split('@')[0].trim();
    
    // Try to extract last name
    const nameParts = cleanName.split(" ").filter(part => part.length > 0);
    
    if (nameParts.length > 1) {
      // Has multiple parts - use last part as last name
      const lastName = nameParts[nameParts.length - 1];
      // Make sure last name isn't an email or empty
      if (lastName && !lastName.includes('@') && !lastName.includes('.')) {
        return `Dr. ${lastName}`;
      }
    }
    
    // If we can't get a proper last name, return the clean full name
    return cleanName;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time (remove seconds)
  const formatTime = (timeString) => {
    return timeString?.substring(0, 5); // Returns HH:MM
  };

  // Format time range
  const formatTimeRange = (startTime, endTime) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const handleView = (apt) => {
    setSelectedAppointment(apt);
    setShowViewModal(true);
  };

  const handlePay = (apt) => {
    setSelectedAppointment(apt);
    setShowPaymentModal(true);
  };

  const handleReschedule = (apt) => {
    navigate("/calendar", {
      state: {
        appointment: apt,
        therapist: therapists[apt.therapistId],
      },
    });
  };

  const confirmPayment = async () => {
    setProcessingPayment(true);
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/payfast/${selectedAppointment.id}`,
        { method: "POST" }
      );

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to initiate payment. Please try again.");
      }
    } catch (err) {
      console.error("Error initiating payment:", err);
      alert("An error occurred while processing payment. Please try again.");
    } finally {
      setProcessingPayment(false);
      setShowPaymentModal(false);
    }
  };

  const handleBookNew = () => {
    navigate("/calendar");
  };

  // Check if appointment needs payment (pay later option)
  const needsPayment = (status) => {
    return status === 'pending_payment' || status === 'PENDING_PAYMENT';
  };

  // Check if appointment is pending admin approval (paid but not confirmed)
  const isPendingApproval = (status) => {
    return status === 'pending' || status === 'PENDING';
  };

  // Check if appointment is confirmed (admin approved)
  const isConfirmed = (status) => {
    return status === 'confirmed' || status === 'CONFIRMED' || status === 'completed' || status === 'COMPLETED';
  };

  const canReschedule = (apt) => {
    if (!apt) return false;
    if (['COMPLETED', 'CANCELLED', 'completed', 'cancelled'].includes(apt.status)) return false;
    const sessionStart = new Date(`${apt.bookingDate}T${apt.startTime}`);
    return sessionStart.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
  };

  // Get badge class based on status
  const getBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
        return 'badge-confirmed';
      case 'pending':
        return 'badge-pending';
      case 'pending_payment':
        return 'badge-pending-payment';
      case 'cancelled':
        return 'badge-cancelled';
      case 'completed':
        return 'badge-completed';
      default:
        return 'badge-pending';
    }
  };

  // Get status display text
  const getStatusDisplay = (status) => {
    if (status === 'pending_payment' || status === 'PENDING_PAYMENT') return 'Awaiting Payment';
    if (status === 'pending' || status === 'PENDING') return 'Pending Approval';
    if (status === 'confirmed' || status === 'CONFIRMED') return 'Confirmed';
    if (status === 'completed' || status === 'COMPLETED') return 'Completed';
    if (status === 'cancelled' || status === 'CANCELLED') return 'Cancelled';
    return status || 'PENDING';
  };

  if (loading) {
    return (
      <Container fluid className="soft-appointments py-4">
        <div className="text-center p-5">Loading your appointments...</div>
      </Container>
    );
  }

  return (
    <>
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
        /* Custom badges - keeping original colors */
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
        .soft-appointments .badge-pending-payment {
          background-color: #ebfacf;
          color: #002324;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          display: inline-block;
        }
        .soft-appointments .badge-cancelled {
          background-color: #dc3545;
          color: white;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          display: inline-block;
        }
        .soft-appointments .badge-completed {
          background-color: #28a745;
          color: white;
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
        .soft-appointments .btn-soft-pay {
          background-color: #002324;
          color: #ebfacf;
          border: none;
          border-radius: 30px;
          padding: 0.4rem 1.2rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        .soft-appointments .btn-soft-pay:hover:not(:disabled) {
          background-color: #a1ad95;
          color: #002324;
        }
        .soft-appointments .btn-soft-pay:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: #002324;
          color: #ebfacf;
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
        /* Empty state */
        .soft-appointments .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }
        .soft-appointments .empty-state h3 {
          color: #002324;
          margin-bottom: 20px;
        }
        .soft-appointments .empty-state p {
          color: #666;
          margin-bottom: 30px;
        }
        /* Loading spinner */
        .spinner-small {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
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

        {appointments.length > 0 ? (
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
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td data-label="Date">{formatDate(apt.bookingDate)}</td>
                    <td data-label="Time">{formatTimeRange(apt.startTime, apt.endTime)}</td>
                    <td data-label="Therapist">{getTherapistDisplayName(apt.therapistId)}</td>
                    <td data-label="Status">
                      <span className={getBadgeClass(apt.status)}>
                        {getStatusDisplay(apt.status)}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button className="btn-soft-primary" onClick={() => handleView(apt)}>
                          View
                        </button>
                        {needsPayment(apt.status) && (
                          <button 
                            className="btn-soft-pay" 
                            onClick={() => handlePay(apt)}
                          >
                            Pay Now
                          </button>
                        )}
                        {canReschedule(apt) && (
                          <button
                            className="btn-soft-outline"
                            onClick={() => handleReschedule(apt)}
                          >
                            Reschedule
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Appointments Found</h3>
            <p>You haven't booked any appointments yet. Start your wellness journey today!</p>
            <button className="btn-book" onClick={handleBookNew}>
              Book Your First Appointment
            </button>
          </div>
        )}

        {appointments.length > 0 && (
          <button className="btn-book mt-3" onClick={handleBookNew}>
            Book New Appointment
          </button>
        )}

        {/* View Modal */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Appointment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && (
              <div>
                <p><strong>Booking ID:</strong> #{selectedAppointment.id}</p>
                <p><strong>Therapist:</strong> {getTherapistDisplayName(selectedAppointment.therapistId)}</p>
                <p><strong>Date:</strong> {formatDate(selectedAppointment.bookingDate)}</p>
                <p><strong>Time:</strong> {formatTimeRange(selectedAppointment.startTime, selectedAppointment.endTime)}</p>
                <p><strong>Price:</strong> R{selectedAppointment.price || 0}</p>
                <p><strong>Status:</strong> 
                  <span className={getBadgeClass(selectedAppointment.status)} style={{ marginLeft: '0.5rem' }}>
                    {getStatusDisplay(selectedAppointment.status)}
                  </span>
                </p>
                {selectedAppointment.description && (
                  <p><strong>Description:</strong> {selectedAppointment.description}</p>
                )}
                <p><strong>Booked on:</strong> {new Date(selectedAppointment.createdAt).toLocaleDateString()}</p>
                <p style={{ color: '#8A5A00' }}>
                  Rescheduling is only allowed at least 24 hours before the session. Cancellations and refunds are not allowed.
                </p>
                
                {/* Status-specific messages */}
                {needsPayment(selectedAppointment.status) && (
                  <div style={{ 
                    marginTop: '1.5rem', 
                    padding: '1rem', 
                    background: '#ebfacf', 
                    borderLeft: '4px solid #a1ad95',
                    borderRadius: '8px'
                  }}>
                    <strong style={{ color: '#002324' }}>💳 Payment Required</strong>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#002324' }}>
                      This appointment has not been paid for. Please complete payment to confirm your booking.
                    </p>
                  </div>
                )}
                
                {isPendingApproval(selectedAppointment.status) && (
                  <div style={{ 
                    marginTop: '1.5rem', 
                    padding: '1rem', 
                    background: '#ebfacf', 
                    borderLeft: '4px solid #a1ad95',
                    borderRadius: '8px'
                  }}>
                    <strong style={{ color: '#002324' }}>⏳ Pending Admin Approval</strong>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#002324' }}>
                      Your payment has been received. An administrator will confirm your appointment shortly.
                    </p>
                  </div>
                )}
                
                {isConfirmed(selectedAppointment.status) && (
                  <div style={{ 
                    marginTop: '1.5rem', 
                    padding: '1rem', 
                    background: '#ebfacf', 
                    borderLeft: '4px solid #a1ad95',
                    borderRadius: '8px'
                  }}>
                    <strong style={{ color: '#002324' }}>✓ Appointment Confirmed</strong>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#002324' }}>
                      Your appointment has been confirmed. Please arrive on time.
                    </p>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {/* Pay button only shows for pending_payment status */}
            {selectedAppointment && needsPayment(selectedAppointment.status) && (
              <button 
                className="btn-soft-pay" 
                onClick={() => {
                  setShowViewModal(false);
                  handlePay(selectedAppointment);
                }}
                style={{ marginRight: 'auto' }}
              >
                Pay Now
              </button>
            )}
            <button className="btn-soft-outline" onClick={() => setShowViewModal(false)}>
              Close
            </button>
          </Modal.Footer>
        </Modal>

        {/* Payment Modal */}
        <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Complete Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && (
              <div>
                <p>You are about to pay for your appointment:</p>
                <div style={{ background: '#f0f2f0', padding: '1rem', borderRadius: '10px', margin: '1rem 0' }}>
                  <p><strong>Therapist:</strong> {getTherapistDisplayName(selectedAppointment.therapistId)}</p>
                  <p><strong>Date:</strong> {formatDate(selectedAppointment.bookingDate)}</p>
                  <p><strong>Time:</strong> {formatTimeRange(selectedAppointment.startTime, selectedAppointment.endTime)}</p>
                  <p><strong>Amount:</strong> <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#002324' }}>R{selectedAppointment.price || 0}</span></p>
                </div>
                <p>You will be redirected to PayFast to complete the payment securely.</p>
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
                  After payment, your appointment will be pending admin approval.
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button 
              className="btn-soft-outline" 
              onClick={() => setShowPaymentModal(false)}
              disabled={processingPayment}
            >
              Cancel
            </button>
            <button 
              className="btn-soft-pay" 
              onClick={confirmPayment}
              disabled={processingPayment}
            >
              {processingPayment ? (
                <>
                  <span className="spinner-small"></span>
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default MyAppointments;
