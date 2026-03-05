import { useMemo, useState } from "react";
import { CalendarDays, Eye, Timer } from "lucide-react";
import "./UpcomingSessions.css";

const UpcomingSessions = () => {
  const upcomingSessions = useMemo(
    () => [
      {
        id: 1,
        client: "John Doe",
        date: "2026-03-10",
        time: "10:00 AM",
        mode: "Online",
        duration: "60 min",
        issue: "Anxiety management",
        notes: "First follow-up after intake.",
      },
      {
        id: 2,
        client: "Jane Smith",
        date: "2026-03-11",
        time: "2:00 PM",
        mode: "In-person",
        duration: "45 min",
        issue: "Stress and burnout",
        notes: "Review weekly coping plan.",
      },
      {
        id: 3,
        client: "Thabo Mokoena",
        date: "2026-03-12",
        time: "9:30 AM",
        mode: "Online",
        duration: "60 min",
        issue: "Depression support",
        notes: "Progress check on sleep routine.",
      },
    ],
    []
  );

  const [selectedId, setSelectedId] = useState(upcomingSessions[0]?.id ?? null);
  const selectedSession = upcomingSessions.find((session) => session.id === selectedId);

  return (
    <section className="upcoming-sessions">
      <header className="upcoming-sessions__header">
        <h1 className="upcoming-sessions__title">Upcoming Sessions</h1>
        <p className="upcoming-sessions__subtitle">Use the view icon to open complete details for each upcoming booking.</p>
      </header>

      <div className="upcoming-sessions__toolbar">
        <div className="upcoming-sessions__chip">
          <CalendarDays size={15} />
          <span>Total Upcoming: {upcomingSessions.length}</span>
        </div>
        <div className="upcoming-sessions__chip">
          <Timer size={15} />
          <span>Next Session: {upcomingSessions[0]?.time ?? "N/A"}</span>
        </div>
      </div>

      <section className="upcoming-sessions__panel">
        <h2 className="upcoming-sessions__panel-title">Session List</h2>
        <div className="upcoming-sessions__grid">
          {upcomingSessions.map((session) => (
            <article key={session.id} className="upcoming-sessions__card">
              <p className="upcoming-sessions__name">{session.client}</p>
              <p className="upcoming-sessions__meta">
                {session.date} | {session.time}
              </p>
              <p className="upcoming-sessions__meta">Mode: {session.mode}</p>
              <button
                type="button"
                className="upcoming-sessions__view-btn"
                onClick={() => setSelectedId(session.id)}
                aria-label={`View details for ${session.client}`}
                title="View session details"
              >
                <Eye size={16} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="upcoming-sessions__panel">
        <h2 className="upcoming-sessions__panel-title">Session Details</h2>
        {selectedSession ? (
          <div className="upcoming-sessions__details">
            <p className="upcoming-sessions__detail-text">
              <strong>Client:</strong> {selectedSession.client}
            </p>
            <p className="upcoming-sessions__detail-text">
              <strong>Date:</strong> {selectedSession.date}
            </p>
            <p className="upcoming-sessions__detail-text">
              <strong>Time:</strong> {selectedSession.time}
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
