import React, { useState } from "react";

const Profile = () => {
  const role = "therapist";

  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "0712345678",
    idNumber: "",
    specialization: "Clinical Psychology",

    qualification: "Masters in Psychology",
    yearsOfExperience: 5,
    licenseNumber: "HPCSA-123456",
    bio: "Experienced clinical psychologist passionate about mental wellness.",

    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ID number validation (max 13 digits)
    if (name === "idNumber" && !/^\d{0,13}$/.test(value)) return;

    // Years of experience must be numeric
    if (name === "yearsOfExperience" && value < 0) return;

    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    setProfile({
      ...profile,
      updatedAt: new Date().toISOString().split("T")[0],
    });

    alert("Profile updated successfully");
  };

  return (
    <div style={profileWrapper}>
      <h1>Profile</h1>
      <p>Manage your personal information</p>

      <label>Name</label>
      <input name="name" value={profile.name} onChange={handleChange} style={inputStyle} />

      <label>Email</label>
      <input name="email" value={profile.email} onChange={handleChange} style={inputStyle} />

      <label>Phone</label>
      <input name="phone" value={profile.phone} onChange={handleChange} style={inputStyle} />

      <label>ID Number (13 digits max)</label>
      <input
        name="idNumber"
        value={profile.idNumber}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Enter SA ID number"
      />

      {role === "therapist" && (
        <>
          <label>Specialization</label>
          <input
            name="specialization"
            value={profile.specialization}
            onChange={handleChange}
            style={inputStyle}
          />

          <label>Qualification</label>
          <input
            name="qualification"
            value={profile.qualification}
            onChange={handleChange}
            style={inputStyle}
          />

          <label>Years of Experience</label>
          <input
            type="number"
            name="yearsOfExperience"
            value={profile.yearsOfExperience}
            onChange={handleChange}
            style={inputStyle}
          />

          <label>License Number</label>
          <input
            name="licenseNumber"
            value={profile.licenseNumber}
            onChange={handleChange}
            style={inputStyle}
          />

          <label>Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            style={{ ...inputStyle, height: "100px" }}
          />
        </>
      )}

      <label>Created At</label>
      <input value={profile.createdAt} disabled style={inputStyle} />

      <label>Updated At</label>
      <input value={profile.updatedAt} disabled style={inputStyle} />

      <button onClick={handleSave} style={buttonStyle}>
        Save Changes
      </button>
    </div>
  );
};

/* ===== Styles ===== */

const profileWrapper = {
  padding: "20px",
  maxWidth: "500px",
  margin: "0 auto",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "12px",
  width: "100%",
  backgroundColor: "#4F46E5",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Profile;