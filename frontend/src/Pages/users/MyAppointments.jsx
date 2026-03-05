import React from "react";
import { Container, Table, Badge, Button } from "react-bootstrap";

function MyAppointments() {
  const appointments = [
    { id: 1, date: "2024-03-10", time: "10:00 AM", therapist: "Dr. Smith", status: "confirmed" },
    { id: 2, date: "2024-03-15", time: "2:00 PM", therapist: "Dr. Johnson", status: "pending" },
    { id: 3, date: "2024-03-20", time: "11:00 AM", therapist: "Dr. Williams", status: "confirmed" },
  ];

  return (
    <Container fluid>
      <h1 className="page-header">My Appointments</h1>
      
      <Table striped bordered hover responsive className="mt-4">
        <thead style={{ backgroundColor: "#002324", color: "#E5DDDE" }}>
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
              <td>{apt.date}</td>
              <td>{apt.time}</td>
              <td>{apt.therapist}</td>
              <td>
                <Badge bg={apt.status === "confirmed" ? "success" : "warning"}>
                  {apt.status}
                </Badge>
              </td>
              <td>
                <Button size="sm" className="btn-custom me-2">View</Button>
                <Button size="sm" variant="outline-danger">Cancel</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Button className="btn-custom mt-3">Book New Appointment</Button>
    </Container>
  );
}

export default MyAppointments;