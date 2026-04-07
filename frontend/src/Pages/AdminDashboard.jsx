import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const getFallbackImage = (id) => `https://i.pravatar.cc/150?u=therapist-${id}`;

const colors = {
  deepTeal: "#002324",
  sand: "#E5DDDE",
  sage: "#A1AD95",
  mint: "#EBFACF",
  white: "#FFFFFF",
  slate: "#64748B",
};

const emptyTherapistForm = {
  name: "",
  surname: "",
  email: "",
  password: "",
  specialty: "",
  yearsOfExperience: "",
  licenseNumber: "",
  typeOfPractice: "",
  bio: "",
  image: "",
};

const SERVICE_OPTIONS = [
  "Educational Psychologist",
  "Couple Therapy",
  "Occupational Therapist",
  "Speech and Language Therapy",
  "Family Therapist",
  "Counselling",
  "Trauma Counselling",
];

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f3f0",
    color: colors.deepTeal,
    fontFamily: '"DM Sans", system-ui, sans-serif',
  },
  shell: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1.25rem 3rem",
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "end",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 700,
    color: colors.deepTeal,
  },
  subtitle: {
    margin: "0.45rem 0 0",
    color: colors.slate,
    fontSize: "0.95rem",
  },
  reloadBtn: {
    border: `1px solid ${colors.sand}`,
    backgroundColor: colors.white,
    color: colors.deepTeal,
    borderRadius: "999px",
    padding: "0.75rem 1rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  statCard: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.sand}`,
    borderRadius: "18px",
    padding: "1.25rem",
    boxShadow: "0 8px 30px rgba(0,35,36,0.06)",
  },
  statLabel: {
    color: colors.sage,
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  statValue: {
    marginTop: "0.5rem",
    fontSize: "2rem",
    fontWeight: 700,
    color: colors.deepTeal,
  },
  card: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.sand}`,
    borderRadius: "18px",
    boxShadow: "0 8px 30px rgba(0,35,36,0.06)",
    marginBottom: "1.25rem",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    padding: "1.2rem 1.25rem",
    borderBottom: `1px solid ${colors.sand}`,
    flexWrap: "wrap",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: 700,
  },
  addBtn: {
    border: "none",
    backgroundColor: colors.deepTeal,
    color: colors.mint,
    borderRadius: "999px",
    padding: "0.75rem 1rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  bookingsList: {
    padding: "0 1.25rem 1.25rem",
  },
  bookingRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "center",
    padding: "1rem 0",
    borderBottom: `1px solid ${colors.sand}`,
    flexWrap: "wrap",
  },
  bookingName: {
    fontSize: "1rem",
    fontWeight: 700,
  },
  bookingMeta: {
    marginTop: "0.35rem",
    color: colors.slate,
    fontSize: "0.9rem",
  },
  bookingRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "0.45rem",
    minWidth: "180px",
  },
  bookingSummary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "0.6rem",
    flexWrap: "wrap",
  },
  price: {
    fontWeight: 700,
  },
  status: (status) => {
    const normalized = String(status || "").toLowerCase();
    const map = {
      pending: { bg: "#FFF8E1", color: "#B7791F", border: "#F6E05E" },
      pending_payment: { bg: "#FFF8E1", color: "#B7791F", border: "#F6E05E" },
      confirmed: { bg: "#F0FFF4", color: "#276749", border: "#9AE6B4" },
      completed: { bg: "#F0FFF4", color: "#276749", border: "#9AE6B4" },
      cancelled: { bg: "#FFF5F5", color: "#C53030", border: "#FEB2B2" },
    };
    const palette = map[normalized] || map.pending;
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.3rem 0.75rem",
      borderRadius: "999px",
      border: `1px solid ${palette.border}`,
      backgroundColor: palette.bg,
      color: palette.color,
      fontSize: "0.78rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
    };
  },
  approveBtn: {
    border: "none",
    backgroundColor: colors.mint,
    color: colors.deepTeal,
    borderRadius: "10px",
    padding: "0.55rem 0.85rem",
    fontSize: "0.82rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  therapistsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
    padding: "1.25rem",
  },
  therapistCard: {
    border: `1px solid ${colors.sand}`,
    borderRadius: "16px",
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  therapistHead: {
    backgroundColor: colors.deepTeal,
    color: colors.mint,
    display: "flex",
    alignItems: "center",
    gap: "0.9rem",
    padding: "1rem",
  },
  therapistImg: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    objectFit: "cover",
    border: `2px solid ${colors.mint}`,
  },
  therapistName: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 700,
  },
  therapistSpec: {
    marginTop: "0.25rem",
    color: colors.sage,
    fontSize: "0.84rem",
  },
  therapistBody: {
    padding: "1rem",
    color: colors.slate,
    fontSize: "0.9rem",
    lineHeight: 1.7,
  },
  empty: {
    padding: "1.25rem",
    color: colors.slate,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    zIndex: 1000,
  },
  modalCard: {
    width: "100%",
    maxWidth: "540px",
    maxHeight: "90vh",
    overflowY: "auto",
    backgroundColor: colors.white,
    borderRadius: "18px",
    padding: "1.25rem",
  },
  modalTitle: {
    margin: "0 0 1rem",
    fontSize: "1.3rem",
    fontWeight: 700,
    color: colors.deepTeal,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "0.85rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.84rem",
    fontWeight: 600,
    color: colors.deepTeal,
  },
  input: {
    width: "100%",
    padding: "0.8rem 0.9rem",
    borderRadius: "12px",
    border: `1px solid ${colors.sand}`,
    backgroundColor: "#fcfbfa",
    fontSize: "0.92rem",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: "96px",
    padding: "0.8rem 0.9rem",
    borderRadius: "12px",
    border: `1px solid ${colors.sand}`,
    backgroundColor: "#fcfbfa",
    fontSize: "0.92rem",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "1rem",
  },
  secondaryBtn: {
    border: `1px solid ${colors.sand}`,
    backgroundColor: colors.white,
    color: colors.deepTeal,
    borderRadius: "12px",
    padding: "0.75rem 1rem",
    fontWeight: 600,
    cursor: "pointer",
  },
};

const formatTherapist = (item) => ({
  id: String(item.id),
  name: item.user?.name?.split(" ")[0] || "",
  surname: item.user?.name?.split(" ").slice(1).join(" ") || "",
  specialty: item.specialization || "General Therapy",
  typeOfPractice: item.typeOfPractice || "Private Practice",
  yearsOfExperience: item.yearsOfExperience || 0,
  hpcsaNumber: item.licenseNumber || "Not provided",
  image: item.image || getFallbackImage(item.id),
});

const formatDateTime = (booking) => {
  const dateLabel = booking.bookingDate
    ? new Date(booking.bookingDate).toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No date";

  return `${dateLabel} · ${String(booking.startTime || "").slice(0, 5)} - ${String(
    booking.endTime || "",
  ).slice(0, 5)}`;
};

const getBookingTherapistName = (booking, therapists) => {
  const therapist = therapists.find((item) => String(item.id) === String(booking.therapistId));
  if (!therapist) return "Not assigned";
  return `Dr. ${[therapist.name, therapist.surname].filter(Boolean).join(" ").trim()}`;
};

export default function AdminDashboard() {
  const [therapists, setTherapists] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [submittingTherapist, setSubmittingTherapist] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  const [newTherapist, setNewTherapist] = useState(emptyTherapistForm);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoadingDashboard(true);
      const [therapistsResult, bookingsResult, usersResult] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/api/therapists`),
        fetch(`${API_BASE_URL}/api/bookings`),
        fetch(`${API_BASE_URL}/api/users`),
      ]);

      let hadFailure = false;

      if (therapistsResult.status === "fulfilled" && therapistsResult.value.ok) {
        const therapistsData = await therapistsResult.value.json();
        setTherapists((Array.isArray(therapistsData) ? therapistsData : []).map(formatTherapist));
      } else {
        hadFailure = true;
        setTherapists([]);
      }

      if (bookingsResult.status === "fulfilled" && bookingsResult.value.ok) {
        const bookingsData = await bookingsResult.value.json();
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } else {
        hadFailure = true;
        setBookings([]);
      }

      if (usersResult.status === "fulfilled" && usersResult.value.ok) {
        const usersData = await usersResult.value.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      } else {
        hadFailure = true;
        setUsers([]);
      }

      if (hadFailure) {
        alert("Some dashboard data could not be loaded. Please make sure the backend server is running on port 5000.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load dashboard data");
    } finally {
      setLoadingDashboard(false);
    }
  };

  const stats = useMemo(() => {
    const pending = bookings.filter((item) =>
      ["PENDING", "pending_payment", "pending"].includes(item.status),
    ).length;
    const confirmed = bookings.filter((item) =>
      ["CONFIRMED", "confirmed", "completed", "COMPLETED"].includes(item.status),
    ).length;

    return {
      users: users.length,
      total: bookings.length,
      pending,
      confirmed,
      revenue: bookings.reduce((sum, item) => sum + Number(item.price || 0), 0),
    };
  }, [bookings, users]);

  const handleTherapistChange = (field, value) => {
    setNewTherapist((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTherapist = async () => {
    if (!newTherapist.name || !newTherapist.surname || !newTherapist.email || !newTherapist.password) {
      alert("Please fill in the required fields");
      return;
    }

    try {
      setSubmittingTherapist(true);
      const response = await fetch(`${API_BASE_URL}/api/therapists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTherapist),
      });

      if (!response.ok) {
        throw new Error("Failed to add therapist");
      }

      setShowModal(false);
      setNewTherapist(emptyTherapistForm);
      await fetchDashboardData();
    } catch (error) {
      console.error(error);
      alert("Failed to add therapist");
    } finally {
      setSubmittingTherapist(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      setUpdatingBookingId(bookingId);
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Update failed");
      }

      await fetchDashboardData();
    } catch (error) {
      console.error(error);
      alert(error.message || `Failed to update booking to ${status}`);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.hero}>
            <div>
              <h1 style={styles.title}>Admin Dashboard</h1>
              <p style={styles.subtitle}>Monitor live booking, therapist, and revenue activity.</p>
            </div>
            <button style={styles.reloadBtn} onClick={fetchDashboardData} disabled={loadingDashboard}>
              {loadingDashboard ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Users</div>
              <div style={styles.statValue}>{stats.users}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Bookings</div>
              <div style={styles.statValue}>{stats.total}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Pending</div>
              <div style={styles.statValue}>{stats.pending}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Confirmed</div>
              <div style={styles.statValue}>{stats.confirmed}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Revenue</div>
              <div style={styles.statValue}>R{stats.revenue.toFixed(2)}</div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Recent Bookings</h2>
            </div>
            <div style={styles.bookingsList}>
              {bookings.length === 0 ? (
                <div style={styles.empty}>No live booking data yet.</div>
              ) : (
                bookings.slice(0, 6).map((booking) => (
                  <div key={booking.id} style={styles.bookingRow}>
                    <div style={{ flex: 1 }}>
                      <div style={styles.bookingName}>{booking.client?.name || "Client"}</div>
                      <div style={styles.bookingMeta}>{formatDateTime(booking)}</div>
                      <div style={styles.bookingMeta}>
                        Therapist: {getBookingTherapistName(booking, therapists)}
                      </div>
                    </div>
                    <div style={styles.bookingRight}>
                      <div style={styles.bookingSummary}>
                        <div style={styles.price}>R{Number(booking.price || 0).toFixed(2)}</div>
                        <span style={styles.status(booking.status)}>{booking.status}</span>
                      </div>
                      {booking.status !== "CONFIRMED" && booking.status !== "COMPLETED" ? (
                        <button
                          style={styles.approveBtn}
                          onClick={() => updateBookingStatus(booking.id, "CONFIRMED")}
                          disabled={updatingBookingId === booking.id}
                        >
                          {updatingBookingId === booking.id ? "Updating..." : "Approve"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Therapist Roster</h2>
              <button style={styles.addBtn} onClick={() => setShowModal(true)}>
                + Add Therapist
              </button>
            </div>
            {therapists.length === 0 ? (
              <div style={styles.empty}>No therapists found yet.</div>
            ) : (
              <div style={styles.therapistsGrid}>
                {therapists.map((therapist) => (
                  <div key={therapist.id} style={styles.therapistCard}>
                    <div style={styles.therapistHead}>
                      <img
                        src={therapist.image}
                        alt={`${therapist.name} ${therapist.surname}`}
                        style={styles.therapistImg}
                      />
                      <div>
                        <p style={styles.therapistName}>
                          Dr. {therapist.name} {therapist.surname}
                        </p>
                        <div style={styles.therapistSpec}>{therapist.specialty}</div>
                      </div>
                    </div>
                    <div style={styles.therapistBody}>
                      <div>{therapist.typeOfPractice}</div>
                      <div>{therapist.yearsOfExperience} years experience</div>
                      <div>HPCSA: {therapist.hpcsaNumber}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        
        </div>

        {showModal ? (
          <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div style={styles.modalCard} onClick={(event) => event.stopPropagation()}>
              <h2 style={styles.modalTitle}>Add Therapist</h2>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>First Name</label>
                  <input
                    style={styles.input}
                    value={newTherapist.name}
                    onChange={(e) => handleTherapistChange("name", e.target.value)}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Surname</label>
                  <input
                    style={styles.input}
                    value={newTherapist.surname}
                    onChange={(e) => handleTherapistChange("surname", e.target.value)}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Email</label>
                  <input
                    style={styles.input}
                    value={newTherapist.email}
                    onChange={(e) => handleTherapistChange("email", e.target.value)}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    style={styles.input}
                    value={newTherapist.password}
                    onChange={(e) => handleTherapistChange("password", e.target.value)}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Specialty</label>
                  <select
                    style={styles.input}
                    value={newTherapist.specialty}
                    onChange={(e) => handleTherapistChange("specialty", e.target.value)}
                  >
                    <option value="">Select a service</option>
                    {SERVICE_OPTIONS.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Years of Experience</label>
                  <input
                    style={styles.input}
                    value={newTherapist.yearsOfExperience}
                    onChange={(e) => handleTherapistChange("yearsOfExperience", e.target.value)}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>License Number</label>
                  <input
                    style={styles.input}
                    value={newTherapist.licenseNumber}
                    onChange={(e) => handleTherapistChange("licenseNumber", e.target.value)}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Type of Practice</label>
                  <input
                    style={styles.input}
                    value={newTherapist.typeOfPractice}
                    onChange={(e) => handleTherapistChange("typeOfPractice", e.target.value)}
                  />
                </div>
              </div>
              <div style={{ ...styles.field, marginTop: "0.85rem" }}>
                <label style={styles.label}>Bio</label>
                <textarea
                  style={styles.textarea}
                  value={newTherapist.bio}
                  onChange={(e) => handleTherapistChange("bio", e.target.value)}
                />
              </div>
              <div style={{ ...styles.field, marginTop: "0.85rem" }}>
                <label style={styles.label}>Image URL</label>
                <input
                  style={styles.input}
                  value={newTherapist.image}
                  onChange={(e) => handleTherapistChange("image", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div style={styles.modalActions}>
                <button style={styles.secondaryBtn} onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button style={styles.addBtn} onClick={addTherapist} disabled={submittingTherapist}>
                  {submittingTherapist ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
