import { useEffect, useState } from "react";
import { CircleCheck, Filter, History } from "lucide-react";
import "./BookingHistory.css";

const BookingHistory = () => {
  const [historyBookings, setHistoryBookings] = useState([]);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const response = await fetch("/api/bookings/therapist/history"); // adjust if your route name is different
        if (!response.ok) throw new Error("Failed to fetch booking history");

        const data = await response.json();
        setHistoryBookings(data);
      } catch (error) {
        console.error("Error fetching booking history:", error);
      }
    };

    fetchBookingHistory();
  }, []);

  return (
    <section className="booking-history">
      <header className="booking-history__header">
        <h1 className="booking-history__title">Booking History</h1>
        <p className="booking-history__subtitle">
          Review past bookings in a clean, aligned layout.
        </p>
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
          {historyBookings.length > 0 ? (
            historyBookings.map((booking) => (
              <article key={booking.id} className="booking-history__card">
                <div className="booking-history__row">
                  <p className="booking-history__name">{booking.clientName}</p>
                  <span className="booking-history__status">{booking.status}</span>
                </div>

                <p className="booking-history__meta">
                  {booking.date} | {booking.time}
                </p>

                <p className="booking-history__meta">
                  Mode: {booking.mode}
                </p>
              </article>
            ))
          ) : (
            <p className="booking-history__empty">
              No booking history available.
            </p>
          )}
        </div>
      </section>
    </section>
  );
};

export default BookingHistory;