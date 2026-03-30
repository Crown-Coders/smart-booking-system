import { CalendarRange, CheckCircle2, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import "./TotalSessions.css";

const TotalSessions = () => {
  const [completedSessions, setCompletedSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const therapistId = localStorage.getItem("userId");

        const res = await fetch(
          `http://localhost:5000/api/bookings/therapist/${therapistId}`
        );

        const data = await res.json();

        // Filter only completed sessions
        const completed = data.filter(
          (booking) => booking.status === "completed"
        );

        setCompletedSessions(completed);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  return (
    <section className="total-sessions">
      <header className="total-sessions__header">
        <h1 className="total-sessions__title">Total Sessions</h1>
        <p className="total-sessions__subtitle">
          Structured view of all completed therapy sessions.
        </p>
      </header>

      <div className="total-sessions__toolbar">
        <div className="total-sessions__chip">
          <CheckCircle2 size={15} />
          <span>Completed: {completedSessions.length}</span>
        </div>

        <div className="total-sessions__chip">
          <Clock3 size={15} />
          <span>Sessions Loaded</span>
        </div>

        <div className="total-sessions__chip">
          <CalendarRange size={15} />
          <span>Auto Updated</span>
        </div>
      </div>

      <section className="total-sessions__panel">
        <h2 className="total-sessions__panel-title">
          Completed Session List
        </h2>

        <div className="total-sessions__grid">
          {completedSessions.map((session) => (
            <article key={session.id} className="total-sessions__card">
              <p className="total-sessions__client">
                {session.client?.name}
              </p>

              <p className="total-sessions__meta">
                {session.bookingDate} | {session.startTime} - {session.endTime}
              </p>

              <p className="total-sessions__meta">
                Status: {session.status}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default TotalSessions;