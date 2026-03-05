import React, { useState } from "react";
import "./Profile.css";

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

    if (name === "idNumber" && !/^\d{0,13}$/.test(value)) return;
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
    <div className="profile-page">
      <div className="profile-page__title-card">
        <h1>Profile</h1>
        <p>Manage your personal information</p>
      </div>

      <label>Name</label>
      <input name="name" value={profile.name} onChange={handleChange} className="profile-page__input" />

      <label>Email</label>
      <input name="email" value={profile.email} onChange={handleChange} className="profile-page__input" />

      <label>Phone</label>
      <input name="phone" value={profile.phone} onChange={handleChange} className="profile-page__input" />

      <label>ID Number (13 digits max)</label>
      <input
        name="idNumber"
        value={profile.idNumber}
        onChange={handleChange}
        className="profile-page__input"
        placeholder="Enter SA ID number"
      />

      {role === "therapist" && (
        <>
          <label>Specialization</label>
          <input name="specialization" value={profile.specialization} onChange={handleChange} className="profile-page__input" />

          <label>Qualification</label>
          <input name="qualification" value={profile.qualification} onChange={handleChange} className="profile-page__input" />

          <label>Years of Experience</label>
          <input
            type="number"
            name="yearsOfExperience"
            value={profile.yearsOfExperience}
            onChange={handleChange}
            className="profile-page__input"
          />

          <label>License Number</label>
          <input name="licenseNumber" value={profile.licenseNumber} onChange={handleChange} className="profile-page__input" />

          <label>Bio</label>
          <textarea name="bio" value={profile.bio} onChange={handleChange} className="profile-page__input profile-page__input--bio" />
        </>
      )}

      <label>Created At</label>
      <input value={profile.createdAt} disabled className="profile-page__input" />

      <label>Updated At</label>
      <input value={profile.updatedAt} disabled className="profile-page__input" />

      <button onClick={handleSave} className="profile-page__button">
        Save Changes
      </button>
    </div>
  );
};

export default Profile;
