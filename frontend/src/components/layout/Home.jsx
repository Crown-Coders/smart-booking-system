// src/components/layout/Home.jsx
function Home() {
  return (
    <div style={{
      minHeight: "calc(100vh - 60px - 4rem)", /* fill remaining space (viewport minus navbar & padding) */
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: "12px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      padding: "2rem",
      textAlign: "center",
      color: "#002324",
      fontSize: "1.8rem",
      fontWeight: 500,
    }}>
      Welcome to Smart Booking!<br />
      <span style={{ fontSize: "1.2rem", color: "#A1AD95", marginTop: "1rem" }}>
        Please log in to continue.
      </span>
    </div>
  );
}

export default Home;