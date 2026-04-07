import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const colors = {
  deepTeal: "#002324",
  sand: "#E5DDDE",
  sage: "#A1AD95",
  mint: "#EBFACF",
  white: "#FFFFFF",
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f3f0",
    padding: "2rem 2.5rem",
    fontFamily: '"DM Sans", system-ui, sans-serif',
    color: colors.deepTeal,
  },
  header: {
    marginBottom: "1.5rem",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 700,
  },
  subtitle: {
    marginTop: "0.5rem",
    color: "#5f6f6b",
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  refreshBtn: {
    border: `1px solid ${colors.sand}`,
    backgroundColor: colors.white,
    color: colors.deepTeal,
    borderRadius: "999px",
    padding: "0.7rem 1rem",
    cursor: "pointer",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  card: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.sand}`,
    borderRadius: "16px",
    padding: "1.25rem",
    boxShadow: "0 8px 30px rgba(0,35,36,0.06)",
  },
  cardTitle: {
    margin: 0,
    fontSize: "0.82rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: colors.sage,
  },
  cardValue: {
    marginTop: "0.6rem",
    fontSize: "2rem",
    fontWeight: 700,
  },
  cardSub: {
    marginTop: "0.45rem",
    color: "#5f6f6b",
    fontSize: "0.88rem",
  },
  panelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "1rem",
  },
  panel: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.sand}`,
    borderRadius: "16px",
    padding: "1.25rem",
    boxShadow: "0 8px 30px rgba(0,35,36,0.06)",
  },
  panelTitle: {
    margin: "0 0 0.9rem",
    fontSize: "1.05rem",
    fontWeight: 700,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    padding: "0.8rem 0",
    borderTop: `1px solid ${colors.sand}`,
    color: "#5f6f6b",
  },
  empty: {
    color: "#5f6f6b",
    margin: 0,
  },
  notice: {
    backgroundColor: "#fff7e6",
    color: "#8a5a00",
    border: "1px solid #f2d39b",
    borderRadius: "12px",
    padding: "0.9rem 1rem",
    marginBottom: "1rem",
  },
};

const normalizeRole = (role = "") => String(role).toUpperCase();
const normalizeStatus = (status = "") => String(status).toUpperCase();

const formatCurrency = (value) => `R${Number(value || 0).toFixed(2)}`;
const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default function AdminReports() {
  const [users, setUsers] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setWarning("");

      const [usersResult, therapistsResult, bookingsResult] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/api/users`),
        fetch(`${API_BASE_URL}/api/therapists`),
        fetch(`${API_BASE_URL}/api/bookings`),
      ]);

      let hadFailure = false;

      if (usersResult.status === "fulfilled" && usersResult.value.ok) {
        setUsers(await usersResult.value.json());
      } else {
        hadFailure = true;
        setUsers([]);
      }

      if (therapistsResult.status === "fulfilled" && therapistsResult.value.ok) {
        setTherapists(await therapistsResult.value.json());
      } else {
        hadFailure = true;
        setTherapists([]);
      }

      if (bookingsResult.status === "fulfilled" && bookingsResult.value.ok) {
        setBookings(await bookingsResult.value.json());
      } else {
        hadFailure = true;
        setBookings([]);
      }

      if (hadFailure) {
        setWarning("Some report data could not be loaded, but the available sections below are using live database data.");
      }
    } catch (error) {
      console.error(error);
      setWarning("Failed to load reports data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const stats = useMemo(() => {
    const clientCount = users.filter((user) => normalizeRole(user.role) === "CLIENT").length;
    const therapistUserCount = users.filter((user) => normalizeRole(user.role) === "THERAPIST").length;
    const adminCount = users.filter((user) => normalizeRole(user.role) === "ADMIN" || normalizeRole(user.role) === "SUPERUSER").length;
    const activeUsers = users.filter((user) => user.isActive !== false).length;

    const confirmedBookings = bookings.filter((booking) => {
      const status = normalizeStatus(booking.status);
      return status === "CONFIRMED" || status === "COMPLETED";
    }).length;

    const pendingBookings = bookings.filter((booking) => {
      const status = normalizeStatus(booking.status);
      return status === "PENDING" || status === "PENDING_PAYMENT";
    }).length;

    const monthlyBookings = bookings.filter((booking) => {
      if (!booking.bookingDate) return false;
      const date = new Date(booking.bookingDate);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalUsers: users.length,
      activeUsers,
      clientCount,
      therapistUserCount,
      adminCount,
      therapistProfiles: therapists.length,
      totalBookings: bookings.length,
      confirmedBookings,
      pendingBookings,
      monthlyBookings,
      totalRevenue: bookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0),
    };
  }, [users, therapists, bookings]);

  const topTherapists = useMemo(() => {
    const counts = bookings.reduce((acc, booking) => {
      const key = String(booking.therapistId || "");
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return therapists
      .map((therapist) => ({
        id: therapist.id,
        name: therapist.user?.name || `Therapist ${therapist.id}`,
        specialty: therapist.specialization || "General Therapy",
        bookings: counts[String(therapist.id)] || 0,
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }, [therapists, bookings]);

  const recentBookings = useMemo(
    () => bookings.slice(0, 5),
    [bookings],
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Reports</h1>
        <p style={styles.subtitle}>Live admin reporting based on users, therapists, and bookings in the database.</p>
      </div>

      <div style={styles.actionRow}>
        <div style={{ color: "#5f6f6b" }}>
          {loading ? "Refreshing report data..." : "Showing current database totals."}
        </div>
        <button style={styles.refreshBtn} onClick={fetchReportsData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {warning ? <div style={styles.notice}>{warning}</div> : null}

      <div style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.cardTitle}>Total Users</p>
          <div style={styles.cardValue}>{stats.totalUsers}</div>
          <div style={styles.cardSub}>{stats.activeUsers} currently active</div>
        </div>
        <div style={styles.card}>
          <p style={styles.cardTitle}>Total Bookings</p>
          <div style={styles.cardValue}>{stats.totalBookings}</div>
          <div style={styles.cardSub}>{stats.monthlyBookings} this month</div>
        </div>
        <div style={styles.card}>
          <p style={styles.cardTitle}>Therapist Profiles</p>
          <div style={styles.cardValue}>{stats.therapistProfiles}</div>
          <div style={styles.cardSub}>{stats.therapistUserCount} therapist user accounts</div>
        </div>
        <div style={styles.card}>
          <p style={styles.cardTitle}>Revenue</p>
          <div style={styles.cardValue}>{formatCurrency(stats.totalRevenue)}</div>
          <div style={styles.cardSub}>{stats.confirmedBookings} confirmed or completed bookings</div>
        </div>
      </div>

      <div style={styles.panelGrid}>
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>User Breakdown</h2>
          <ul style={styles.list}>
            <li style={{ ...styles.listItem, borderTop: "none" }}>
              <span>Clients</span>
              <strong>{stats.clientCount}</strong>
            </li>
            <li style={styles.listItem}>
              <span>Therapists</span>
              <strong>{stats.therapistUserCount}</strong>
            </li>
            <li style={styles.listItem}>
              <span>Admins</span>
              <strong>{stats.adminCount}</strong>
            </li>
            <li style={styles.listItem}>
              <span>Inactive users</span>
              <strong>{stats.totalUsers - stats.activeUsers}</strong>
            </li>
          </ul>
        </div>

        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Booking Summary</h2>
          <ul style={styles.list}>
            <li style={{ ...styles.listItem, borderTop: "none" }}>
              <span>Pending bookings</span>
              <strong>{stats.pendingBookings}</strong>
            </li>
            <li style={styles.listItem}>
              <span>Confirmed bookings</span>
              <strong>{stats.confirmedBookings}</strong>
            </li>
            <li style={styles.listItem}>
              <span>Average booking value</span>
              <strong>{formatCurrency(stats.totalBookings ? stats.totalRevenue / stats.totalBookings : 0)}</strong>
            </li>
            <li style={styles.listItem}>
              <span>Therapist roster size</span>
              <strong>{stats.therapistProfiles}</strong>
            </li>
          </ul>
        </div>

        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Top Therapists By Booking Count</h2>
          {topTherapists.length === 0 ? (
            <p style={styles.empty}>No therapist booking data yet.</p>
          ) : (
            <ul style={styles.list}>
              {topTherapists.map((therapist, index) => (
                <li key={therapist.id} style={{ ...styles.listItem, borderTop: index === 0 ? "none" : styles.listItem.borderTop }}>
                  <span>{therapist.name} · {therapist.specialty}</span>
                  <strong>{therapist.bookings}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <p style={styles.empty}>No booking records found.</p>
          ) : (
            <ul style={styles.list}>
              {recentBookings.map((booking, index) => (
                <li key={booking.id} style={{ ...styles.listItem, borderTop: index === 0 ? "none" : styles.listItem.borderTop }}>
                  <span>
                    {booking.client?.name || "Client"} · {formatDate(booking.bookingDate)}
                  </span>
                  <strong>{normalizeStatus(booking.status)}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
