import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  deepTeal: "#002324",
  sand: "#E5DDDE",
  sage: "#A1AD95",
  mint: "#EBFACF",
  white: "#FFFFFF",
};

const styles = {
  content: {
    padding: "2rem 2.5rem",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1.25rem",
    marginBottom: "2rem",
  },

  statCard: (accent) => ({
    backgroundColor: colors.white,
    borderRadius: "12px",
    padding: "1.5rem",
    border: `1px solid ${colors.sand}`,
    borderTop: `4px solid ${accent}`,
    boxShadow: "0 2px 8px rgba(0,35,36,0.05)",
    cursor: "pointer", // makes card clickable
    transition: "0.2s",
  }),

  statLabel: {
    fontSize: "0.7rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: colors.sage,
    marginBottom: "0.5rem",
  },

  statValue: (color) => ({
    fontSize: "2.4rem",
    fontWeight: "700",
    color: color || colors.deepTeal,
  }),

  statSub: {
    fontSize: "0.75rem",
    color: colors.sage,
    marginTop: "0.25rem",
  },

  sessionCard: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "10px",
    border: `1px solid ${colors.sand}`,
    marginBottom: "1rem",
  },
};

const TherapistDashboard = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [therapistName, setTherapistName] = useState("");
  const isPaidSession = (booking) =>
    booking?.payment?.status === "COMPLETED" || booking?.status === "CONFIRMED";

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.id) {
    console.error("No logged-in therapist found");
    return;
  }

  setTherapistName(user.name);

  const fetchBookings = async () => {
  try {
    // 🔥 STEP 1: get therapistId using userId
    const therapistRes = await fetch(
      `http://localhost:5000/api/therapists/by-user/${user.id}`
    );

    if (!therapistRes.ok) throw new Error("Failed to fetch therapist ID");

    const therapistData = await therapistRes.json();

    const therapistId = therapistData.therapistId;

    console.log("Therapist ID:", therapistId);

    // 🔥 STEP 2: fetch bookings using therapistId
    const bookingsRes = await fetch(
      `http://localhost:5000/api/bookings/therapist/${therapistId}`
    );

    if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");

    const bookingsData = await bookingsRes.json();

    console.log("Fetched bookings:", bookingsData);

    setBookings(bookingsData);

  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
};

  fetchBookings();
}, []);

  const today = new Date().toISOString().split("T")[0];

const upcoming = bookings.filter(
  (b) => new Date(b.bookingDate) >= new Date(today) && isPaidSession(b)
);

console.log("Upcoming sessions:", upcoming); // ✅ DEBUG LINE

const history = bookings.filter(
  (b) => new Date(b.bookingDate) < new Date(today) && isPaidSession(b)
);

const paidSessions = bookings.filter(isPaidSession);

  return (
    <div style={styles.content}>
      <h1>Welcome, {therapistName}</h1>
      <p>Here's your activity overview.</p>

      {/* CLICKABLE STAT CARDS */}

      <div style={styles.statsGrid}>
        
        {/* TOTAL SESSIONS */}
        <div
          style={styles.statCard(colors.deepTeal)}
          onClick={() => navigate("/total-sessions")}
        >
          <div style={styles.statLabel}>Total Sessions</div>
          <div style={styles.statValue(colors.deepTeal)}>
            {paidSessions.length}
          </div>
          <div style={styles.statSub}>Click to view paid sessions</div>
        </div>

        {/* UPCOMING SESSIONS */}
        <div
          style={styles.statCard("#276749")}
          onClick={() => navigate("/upcoming-sessions")}
        >
          <div style={styles.statLabel}>Upcoming Sessions</div>
          <div style={styles.statValue("#276749")}>
            {upcoming.length}
          </div>
          <div style={styles.statSub}>Click to view upcoming bookings</div>
        </div>

        {/* BOOKING HISTORY */}
        <div
          style={styles.statCard("#B7791F")}
          onClick={() => navigate("/booking-history")}
        >
          <div style={styles.statLabel}>Booking History</div>
          <div style={styles.statValue("#B7791F")}>
            {history.length}
          </div>
          <div style={styles.statSub}>Click to view past bookings</div>
        </div>
      </div>

      {/* UPCOMING SESSION PREVIEW */}

<h2>Upcoming Sessions</h2>

{upcoming.length > 0 ? (
  upcoming.map((session) => (
    <div key={session.id} style={styles.sessionCard}>
      <p>
        <strong>Client:</strong> {session.client?.name || "N/A"}
      </p>
      <p>
        <strong>Date:</strong> {session.bookingDate}
      </p>
      <p>
        <strong>Time:</strong> {session.startTime} - {session.endTime}
      </p>
      <p>
        <strong>Status:</strong> {session.status}
      </p>
    </div>
  ))
) : (
  <p>No upcoming sessions</p>
)}

      <button
        onClick={() => navigate("/upcoming-sessions")}
        style={{
          marginTop: "1rem",
          padding: "10px 18px",
          borderRadius: "8px",
          border: "none",
          background: colors.deepTeal,
          color: colors.mint,
          cursor: "pointer",
        }}
      >
        View All Sessions
      </button>
    </div>
  );
};

export default TherapistDashboard;
