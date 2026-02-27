// src/therapist/Profile.jsx

import React, { useState } from "react";

const Profile = () => {
  // Change role to "user" or "therapist"
  const role = "therapist";

  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "0712345678",
    specialization: "Clinical Psychology",
  });

  // Handle input change
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h1>Profile</h1>
      <p>Manage your personal information</p>

      {/* Common Fields */}
      <label>Name</label>
      <input
        type="text"
        name="name"
        value={profile.name}
        onChange={handleChange}
        style={inputStyle}
      />

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={profile.email}
        onChange={handleChange}
        style={inputStyle}
      />

      <label>Phone</label>
      <input
        type="text"
        name="phone"
        value={profile.phone}
        onChange={handleChange}
        style={inputStyle}
      />

      {/* Therapist-only Field */}
      {role === "therapist" && (
        <>
          <label>Specialization</label>
          <input
            type="text"
            name="specialization"
            value={profile.specialization}
            onChange={handleChange}
            style={inputStyle}
          />
        </>
      )}

      <button style={buttonStyle}>Save Changes</button>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px",
  width: "100%",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Profile;