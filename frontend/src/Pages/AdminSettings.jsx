import React from "react";

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
  section: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.sand}`,
    borderRadius: "16px",
    padding: "1.25rem",
    boxShadow: "0 8px 30px rgba(0,35,36,0.06)",
    marginBottom: "1rem",
  },
  sectionTitle: {
    margin: "0 0 0.75rem",
    fontSize: "1.05rem",
    fontWeight: 700,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    padding: "0.9rem 0",
    borderTop: `1px solid ${colors.sand}`,
    color: "#5f6f6b",
  },
};

export default function AdminSettings() {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>System Settings</h1>
        <p style={styles.subtitle}>A simple admin settings placeholder page for platform-level configuration.</p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Platform</h2>
        <div style={{ ...styles.row, borderTop: "none" }}>
          <span>Application mode</span>
          <strong>Development</strong>
        </div>
        <div style={styles.row}>
          <span>Default API host</span>
          <strong>http://localhost:5000</strong>
        </div>
        <div style={styles.row}>
          <span>Admin access level</span>
          <strong>Superuser</strong>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Configuration Areas</h2>
        <div style={{ ...styles.row, borderTop: "none" }}>
          <span>User and role management</span>
          <strong>Ready</strong>
        </div>
        <div style={styles.row}>
          <span>Booking policy controls</span>
          <strong>Placeholder</strong>
        </div>
        <div style={styles.row}>
          <span>Email and notification settings</span>
          <strong>Placeholder</strong>
        </div>
      </div>
    </div>
  );
}
