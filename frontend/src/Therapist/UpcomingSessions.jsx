import { useEffect, useState } from "react";
import { CalendarDays, Eye, Timer } from "lucide-react";
import "./UpcomingSessions.css";

const UpcomingSessions = () => {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch upcoming sessions from backend
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

      // ✅ STEP 1
      const therapistRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/therapists/by-user/${user.id}`
      );

      const therapistData = await therapistRes.json();
      const therapistId = therapistData.therapistId;

      // ✅ STEP 2
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/therapist/${therapistId}`
      );

        const data = await response.json();

        const parseDateOnly = (value) => new Date(`${value}T00:00:00`);
        const today = parseDateOnly(new Date().toISOString().split("T")[0]);

        const upcoming = (Array.isArray(data) ? data : []).filter(
          (b) => b.bookingDate && parseDateOnly(b.bookingDate) >= today
        );

        setUpcomingSessions(upcoming);
        setSelectedId(upcoming.length > 0 ? upcoming[0].id : null);
      } catch (error) {
        console.error("Error fetching upcoming sessions:", error);
        setUpcomingSessions([]);
        setSelectedId(null);
      }
    };

    fetchSessions();
  }, [apiBaseUrl]);

  const selectedSession = upcomingSessions.find((session) => session.id === selectedId);

  return (
    <section className="upcoming-sessions">
      <header className="upcoming-sessions__header">
        <h1 className="upcoming-sessions__title">Upcoming Sessions</h1>
        <p className="upcoming-sessions__subtitle">
          Use the view icon to open complete details for each upcoming booking.
        </p>
      </header>

      <div className="upcoming-sessions__toolbar">
        <div className="upcoming-sessions__chip">
          <CalendarDays size={15} />
          <span>Total Upcoming: {upcomingSessions.length}</span>
        </div>
        <div className="upcoming-sessions__chip">
          <Timer size={15} />
          <span>Next Session: {upcomingSessions[0]?.startTime ?? "N/A"}</span>
        </div>
      </div>

      <section className="upcoming-sessions__panel">
        <h2 className="upcoming-sessions__panel-title">Session List</h2>
        <div className="upcoming-sessions__grid">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
              <article key={session.id} className="upcoming-sessions__card">
                <p className="upcoming-sessions__name">
  {session.client?.name || "Unknown"}
</p>

<p className="upcoming-sessions__meta">
  {session.bookingDate} | {session.startTime} - {session.endTime}
</p>

<p className="upcoming-sessions__meta">
  Status: {session.status}
</p>
                <button
                  type="button"
                  className="upcoming-sessions__view-btn"
                  onClick={() => setSelectedId(session.id)}
                  aria-label={`View details for ${session.clientName}`}
                  title="View session details"
                >
                  <Eye size={16} />
                </button>
              </article>
            ))
          ) : (
            <p className="upcoming-sessions__empty">No upcoming sessions scheduled.</p>
          )}
        </div>
      </section>

      <section className="upcoming-sessions__panel">
        <h2 className="upcoming-sessions__panel-title">Session Details</h2>
        {selectedSession ? (
          <div className="upcoming-sessions__details">
            <p className="upcoming-sessions__detail-text">
             <strong>Client:</strong> {selectedSession.client?.name}
            </p>
            <p className="upcoming-sessions__detail-text">
              <strong>Date:</strong> {selectedSession.bookingDate}
            </p>
            <p className="upcoming-sessions__detail-text">
              <strong>Time:</strong> {selectedSession.startTime} - {selectedSession.endTime}
            </p>
            <p className="upcoming-sessions__detail-text">
              <strong>Mode:</strong> {selectedSession.mode}
            </p>
            <p className="upcoming-sessions__detail-text">
              <strong>Duration:</strong> {selectedSession.duration}
            </p>
            <p className="upcoming-sessions__detail-text">
              <strong>Focus:</strong> {selectedSession.issue}
            </p>
            <p className="upcoming-sessions__detail-text">
              <strong>Notes:</strong> {selectedSession.notes}
            </p>
          </div>
        ) : (
          <p className="upcoming-sessions__empty">Select a session card to view details.</p>
        )}
      </section>
    </section>
  );
};

export default UpcomingSessions;