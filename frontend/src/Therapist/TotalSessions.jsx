import { CalendarRange, CheckCircle2, Clock3 } from "lucide-react";
import "./TotalSessions.css";

const TotalSessions = () => {
  const completedSessions = [
    { id: 1, client: "John Doe", date: "2026-02-20", time: "09:00 AM", duration: "60 min", mode: "Online" },
    { id: 2, client: "Jane Smith", date: "2026-02-22", time: "01:00 PM", duration: "45 min", mode: "In-person" },
    { id: 3, client: "Lebo Khumalo", date: "2026-02-24", time: "11:30 AM", duration: "60 min", mode: "Online" },
    { id: 4, client: "Peter Maseko", date: "2026-02-27", time: "03:00 PM", duration: "45 min", mode: "In-person" },
  ];

  return (
    <section className="total-sessions">
      <header className="total-sessions__header">
        <h1 className="total-sessions__title">Total Sessions</h1>
        <p className="total-sessions__subtitle">Structured view of all completed therapy sessions.</p>
      </header>

      <div className="total-sessions__toolbar">
        <div className="total-sessions__chip">
          <CheckCircle2 size={15} />
          <span>Completed: {completedSessions.length}</span>
        </div>
        <div className="total-sessions__chip">
          <Clock3 size={15} />
          <span>Avg Duration: 53 min</span>
        </div>
        <div className="total-sessions__chip">
          <CalendarRange size={15} />
          <span>Current Month: 14 sessions</span>
        </div>
      </div>

      <section className="total-sessions__panel">
        <h2 className="total-sessions__panel-title">Completed Session List</h2>
        <div className="total-sessions__grid">
          {completedSessions.map((session) => (
            <article key={session.id} className="total-sessions__card">
              <p className="total-sessions__client">{session.client}</p>
              <p className="total-sessions__meta">
                {session.date} | {session.time}
              </p>
              <p className="total-sessions__meta">Duration: {session.duration}</p>
              <p className="total-sessions__meta">Mode: {session.mode}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default TotalSessions;
