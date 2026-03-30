import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [therapists, setTherapists] = useState([]);

  // Fetch therapists from API
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/therapists`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setTherapists(data);
      } catch (err) {
        console.error("Failed to fetch therapists:", err);
      }
    };
    fetchTherapists();
  }, []);

  // Placeholder services (all click just shows all therapists)
  const services = [
    { name: "Educational Psychologist" },
    { name: "Couple Therapy" },
    { name: "Occupational Therapist" },
    { name: "Speech and Language Therapy" },
    { name: "Family Therapist" },
    { name: "Counselling" },
    { name: "Trauma Counselling" },
  ];

  const styles = {
    page: { padding: 20, fontFamily: "Arial, sans-serif", background: "#f5f5f5", minHeight: "100vh" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 25 },
    backBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 20 },
    servicesGrid: { display: "flex", flexWrap: "wrap", gap: 20 },
    serviceCard: { flex: "1 1 calc(50% - 20px)", background: "#fff", padding: 20, borderRadius: 20, boxShadow: "0 4px 8px rgba(0,0,0,0.15)", textAlign: "center", cursor: "pointer", transition: "transform 0.2s" },
    serviceTitle: { marginTop: 10, fontSize: 16, color: "#002324" },
    therapistsList: { display: "flex", flexDirection: "column", gap: 15, marginTop: 20 },
    therapistCard: { display: "flex", background: "#fff", padding: 15, borderRadius: 18, boxShadow: "0 4px 8px rgba(0,0,0,0.15)" },
    therapistImage: { width: 70, height: 70, borderRadius: "50%", marginRight: 15, objectFit: "cover" },
    therapistInfo: { flex: 1 },
    therapistName: { margin: 0, fontSize: 16, color: "#002324" },
    specialization: { fontSize: 14, color: "#4E5E5B", marginBottom: 5 },
    bookBtn: { marginTop: 8, backgroundColor: "#2F5D50", color: "#fff", padding: "6px 12px", border: "none", borderRadius: 10, cursor: "pointer" }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => selectedService ? setSelectedService(null) : navigate(-1)}>←</button>
        <h2>{selectedService ? selectedService : "Browse Services"}</h2>
        <div style={{ width: 30 }} />
      </div>

      {/* Services Grid */}
      {!selectedService && (
        <div style={styles.servicesGrid}>
          {services.map((service, index) => (
            <div
              key={index}
              style={styles.serviceCard}
              onClick={() => setSelectedService(service.name)}
            >
              <div style={{ fontSize: 36 }}>⚕️</div>
              <h3 style={styles.serviceTitle}>{service.name}</h3>
            </div>
          ))}
        </div>
      )}

      {/* Therapists (All displayed for now) */}
      {selectedService && therapists.length > 0 && (
        <div style={styles.therapistsList}>
          {therapists.map((therapist) => (
            <div key={therapist.id} style={styles.therapistCard}>
              <img
                src={therapist.image || "https://i.pravatar.cc/150?img=12"}
                alt={therapist.user?.name || "Therapist"}
                style={styles.therapistImage}
              />
              <div style={styles.therapistInfo}>
                <h4 style={styles.therapistName}>Dr. {therapist.user?.name}</h4>
                <p style={styles.specialization}>{therapist.specialization}</p>
                <p>{therapist.yearsOfExperience} years experience</p>
                <button
                  style={styles.bookBtn}
                  onClick={() =>
                    navigate("/calendar", { state: { therapist } })
                  }
                >
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}