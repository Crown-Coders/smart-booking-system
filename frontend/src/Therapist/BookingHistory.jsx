import { CircleCheck, Filter, History } from "lucide-react";
import "./BookingHistory.css";

const BookingHistory = () => {
  const historyBookings = [
    { id: 1, client: "John Doe", date: "2026-02-20", time: "09:00 AM", mode: "Online", status: "Completed" },
    { id: 2, client: "Jane Smith", date: "2026-02-22", time: "01:00 PM", mode: "In-person", status: "Completed" },
    { id: 3, client: "Lebo Khumalo", date: "2026-02-25", time: "11:30 AM", mode: "Online", status: "Completed" },
    { id: 4, client: "Peter Maseko", date: "2026-02-27", time: "03:00 PM", mode: "In-person", status: "Completed" },
  ];

  return (
    <section className="booking-history">
      <header className="booking-history__header">
        <h1 className="booking-history__title">Booking History</h1>
        <p className="booking-history__subtitle">Review past bookings in a clean, aligned layout.</p>
      </header>

      <div className="booking-history__toolbar">
        <div className="booking-history__chip">
          <History size={15} />
          <span>All History</span>
        </div>
        <div className="booking-history__chip">
          <CircleCheck size={15} />
          <span>Completed</span>
        </div>
        <div className="booking-history__chip">
          <Filter size={15} />
          <span>Newest First</span>
        </div>
      </div>

      <section className="booking-history__panel">
        <h2 className="booking-history__panel-title">Past Bookings</h2>
        <div className="booking-history__grid">
          {historyBookings.map((booking) => (
            <article key={booking.id} className="booking-history__card">
              <div className="booking-history__row">
                <p className="booking-history__name">{booking.client}</p>
                <span className="booking-history__status">{booking.status}</span>
              </div>
              <p className="booking-history__meta">
                {booking.date} | {booking.time}
              </p>
              <p className="booking-history__meta">Mode: {booking.mode}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default BookingHistory;
