import { CalendarRange, CheckCircle2, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import "./TotalSessions.css";

const TotalSessions = () => {
  const [completedSessions, setCompletedSessions] = useState([]);
  const isPaidSession = (session) =>
    session?.payment?.status === "COMPLETED" || session?.status === "CONFIRMED";
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.id) {
          setCompletedSessions([]);
          return;
        }

        const therapistRes = await fetch(`${apiBaseUrl}/api/therapists/${user.id}`);
        if (!therapistRes.ok) throw new Error("Failed to fetch therapist profile");

        const therapistData = await therapistRes.json();
        const therapistId = therapistData.id;

        if (!therapistId) {
          setCompletedSessions([]);
          return;
        }

      const completed = data.filter(isPaidSession);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/therapist/${therapistId}`);
        if (!res.ok) throw new Error("Failed to fetch sessions");

        const data = await res.json();
        setCompletedSessions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setCompletedSessions([]);
      }
    };

    fetchSessions();
  }, [apiBaseUrl]);

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
                Status: {session.payment?.status || session.status}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default TotalSessions;
