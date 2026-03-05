import React, { useState } from "react";
import { Container, Table, Badge, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function MyAppointments() {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const appointments = [
    { id: 1, date: "2024-03-10", time: "10:00 AM", therapist: "Dr. Smith", status: "confirmed", notes: "Follow-up session" },
    { id: 2, date: "2024-03-15", time: "2:00 PM", therapist: "Dr. Johnson", status: "pending", notes: "Initial consultation" },
    { id: 3, date: "2024-03-20", time: "11:00 AM", therapist: "Dr. Williams", status: "confirmed", notes: "Therapy session" },
  ];

  const handleView = (apt) => {
    setSelectedAppointment(apt);
    setShowViewModal(true);
  };

  const handleCancel = (apt) => {
    setSelectedAppointment(apt);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    console.log("Cancelled:", selectedAppointment.id);
    setShowCancelModal(false);
  };

  return (
    <>
      {/* Custom soft styles */}
      <style>{`
        .soft-appointments {
          background-color: #f9faf9;
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
          background-color: #e5ddde;  /* soft neutral */
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
        }
        .soft-appointments .badge-pending {
          background-color: #ebfacf;
          color: #002324;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 30px;
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
                  <td data-label="Date">{apt.date}</td>
                  <td data-label="Time">{apt.time}</td>
                  <td data-label="Therapist">{apt.therapist}</td>
                  <td data-label="Status">
                    <span className={apt.status === "confirmed" ? "badge-confirmed" : "badge-pending"}>
                      {apt.status}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className="btn-soft-primary" onClick={() => handleView(apt)}>View</button>
                      <button className="btn-soft-danger" onClick={() => handleCancel(apt)}>Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <button className="btn-book mt-3" onClick={() => console.log("Navigate to booking")}>
          Book New Appointment
        </button>


        {/* View Modal */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Appointment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && (
              <div>
                <p><strong>Therapist:</strong> {selectedAppointment.therapist}</p>
                <p><strong>Date:</strong> {selectedAppointment.date}</p>
                <p><strong>Time:</strong> {selectedAppointment.time}</p>
                <p><strong>Status:</strong> <span className={selectedAppointment.status === "confirmed" ? "badge-confirmed" : "badge-pending"}>{selectedAppointment.status}</span></p>
                <p><strong>Notes:</strong> {selectedAppointment.notes || "No additional notes"}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn-soft-outline" onClick={() => setShowViewModal(false)}>
              Close
            </button>
          </Modal.Footer>
        </Modal>

        {/* Cancel Modal */}
        <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Cancellation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && (
              <p>
                Are you sure you want to cancel your appointment with{" "}
                <strong>{selectedAppointment.therapist}</strong> on{" "}
                <strong>{selectedAppointment.date} at {selectedAppointment.time}</strong>?
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn-soft-outline" onClick={() => setShowCancelModal(false)}>
              No, Keep It
            </button>
            <button className="btn-soft-danger" onClick={confirmCancel}>
              Yes, Cancel
            </button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default MyAppointments;