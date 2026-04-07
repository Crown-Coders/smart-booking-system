import React, { useState, useEffect } from "react";
import "./Profile.css";

const Profile = () => {
  const role = "therapist";

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    specialization: "",
    qualification: "",
    yearsOfExperience: 0,
    licenseNumber: "",
    bio: "",
    createdAt: "",
    updatedAt: "",
  });

  const [loading, setLoading] = useState(true);

  // Automatically fetch logged-in therapist profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.id) {
          console.error("No logged-in user found");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/therapists/${user.id}`
        );

        const data = await response.json();

        setProfile({
          name: data?.name || "",
          email: data?.email || "",
          phone: data?.phone || "",
          idNumber: data?.idNumber || "",
          specialization: data?.specialization || "",
          qualification: data?.qualification || "",
          yearsOfExperience: data?.yearsOfExperience || 0,
          licenseNumber: data?.licenseNumber || "",
          bio: data?.bio || "",
          createdAt: data?.createdAt
            ? new Date(data.createdAt).toLocaleDateString()
            : "",
          updatedAt: data?.updatedAt
            ? new Date(data.updatedAt).toLocaleDateString()
            : "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "idNumber" && !/^\d{0,13}$/.test(value)) return;
    if (name === "yearsOfExperience" && value < 0) return;

    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/therapists/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        }
      );

      const updatedData = await response.json();

      setProfile({
        ...updatedData,
        createdAt: updatedData.createdAt
          ? new Date(updatedData.createdAt).toLocaleDateString()
          : "",
        updatedAt: updatedData.updatedAt
          ? new Date(updatedData.updatedAt).toLocaleDateString()
          : "",
      });

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-page__title-card">
        <h1>Profile</h1>
        <p>Manage your personal information</p>
      </div>

      <label>Name</label>
      <input
        name="name"
        value={profile.name}
        onChange={handleChange}
        className="profile-page__input"
      />

      <label>Email</label>
      <input
        name="email"
        value={profile.email}
        onChange={handleChange}
        className="profile-page__input"
      />

      <label>Phone</label>
      <input
        name="phone"
        value={profile.phone}
        onChange={handleChange}
        className="profile-page__input"
      />

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
          <input
            name="specialization"
            value={profile.specialization}
            onChange={handleChange}
            className="profile-page__input"
          />

          <label>Qualification</label>
          <input
            name="qualification"
            value={profile.qualification}
            onChange={handleChange}
            className="profile-page__input"
          />

          <label>Years of Experience</label>
          <input
            type="number"
            name="yearsOfExperience"
            value={profile.yearsOfExperience}
            onChange={handleChange}
            className="profile-page__input"
          />

          <label>License Number</label>
          <input
            name="licenseNumber"
            value={profile.licenseNumber}
            onChange={handleChange}
            className="profile-page__input"
          />

          <label>Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="profile-page__input profile-page__input--bio"
          />
        </>
      )}

      <label>Created At</label>
      <input
        value={profile.createdAt}
        disabled
        className="profile-page__input"
      />

      <label>Updated At</label>
      <input
        value={profile.updatedAt}
        disabled
        className="profile-page__input"
      />

      <button onClick={handleSave} className="profile-page__button">
        Save Changes
      </button>
    </div>
  );
};

export default Profile;