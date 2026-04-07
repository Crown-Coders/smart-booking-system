import React, { useState, useEffect } from "react";
import "./Profile.css";

const Profile = () => {
  const role = "therapist";
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const mapApiProfileToForm = (data) => ({
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
  const [saving, setSaving] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    title: "",
    message: "",
    kind: "success",
  });

  const showFeedbackModal = (title, message, kind = "success") => {
    setFeedbackModal({ open: true, title, message, kind });
  };

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

        setProfile(mapApiProfileToForm(data));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [apiBaseUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "idNumber" && !/^\d{0,13}$/.test(value)) return;
    if (name === "yearsOfExperience" && value < 0) return;

    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
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

      setProfile(mapApiProfileToForm(updatedData));

      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...existingUser,
          name: updatedData?.name || existingUser.name,
          email: updatedData?.email || existingUser.email,
        })
      );

      showFeedbackModal("Success", "Profile updated successfully", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showFeedbackModal(
        "Update failed",
        error.message || "Failed to update profile",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page profile-page--loading">
        <div className="profile-page__loading-card">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-page__hero">
        <div>
          <p className="profile-page__eyebrow">Therapist Account</p>
          <h1>Profile Settings</h1>
          <p>Keep your professional details current and visible to clients.</p>
        </div>
        <div className="profile-page__avatar" aria-hidden="true">
          {(profile.name || "T").trim().charAt(0).toUpperCase()}
        </div>
      </div>

      <form
        className="profile-page__form-card"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="profile-page__grid">
          <div className="profile-page__field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="profile-page__input"
            />
          </div>

          <div className="profile-page__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="profile-page__input"
            />
          </div>

          <div className="profile-page__field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="profile-page__input"
            />
          </div>

          <div className="profile-page__field">
            <label htmlFor="idNumber">ID Number (13 digits max)</label>
            <input
              id="idNumber"
              name="idNumber"
              value={profile.idNumber}
              onChange={handleChange}
              className="profile-page__input"
              placeholder="Enter SA ID number"
            />
          </div>
        </div>

        {role === "therapist" && (
          <div className="profile-page__section">
            <h2>Professional Details</h2>
            <div className="profile-page__grid">
              <div className="profile-page__field">
                <label htmlFor="specialization">Specialization</label>
                <input
                  id="specialization"
                  name="specialization"
                  value={profile.specialization}
                  onChange={handleChange}
                  className="profile-page__input"
                />
              </div>

              <div className="profile-page__field">
                <label htmlFor="qualification">Qualification</label>
                <input
                  id="qualification"
                  name="qualification"
                  value={profile.qualification}
                  onChange={handleChange}
                  className="profile-page__input"
                />
              </div>

              <div className="profile-page__field">
                <label htmlFor="yearsOfExperience">Years of Experience</label>
                <input
                  id="yearsOfExperience"
                  type="number"
                  name="yearsOfExperience"
                  value={profile.yearsOfExperience}
                  onChange={handleChange}
                  className="profile-page__input"
                />
              </div>

              <div className="profile-page__field">
                <label htmlFor="licenseNumber">License Number</label>
                <input
                  id="licenseNumber"
                  name="licenseNumber"
                  value={profile.licenseNumber}
                  onChange={handleChange}
                  className="profile-page__input"
                />
              </div>
            </div>

            <div className="profile-page__field">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="profile-page__input profile-page__input--bio"
              />
            </div>
          </div>
        )}

        <div className="profile-page__section">
          <h2>Record Details</h2>
          <div className="profile-page__meta-grid">
            <div className="profile-page__field">
              <label htmlFor="createdAt">Created At</label>
              <input
                id="createdAt"
                value={profile.createdAt}
                disabled
                className="profile-page__input"
              />
            </div>

            <div className="profile-page__field">
              <label htmlFor="updatedAt">Updated At</label>
              <input
                id="updatedAt"
                value={profile.updatedAt}
                disabled
                className="profile-page__input"
              />
            </div>
          </div>
        </div>

        <div className="profile-page__actions">
          <button type="submit" className="profile-page__button" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {feedbackModal.open && (
        <div
          className="profile-page__modal-overlay"
          onClick={() => setFeedbackModal((prev) => ({ ...prev, open: false }))}
        >
          <div
            className="profile-page__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-feedback-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`profile-page__modal-badge profile-page__modal-badge--${feedbackModal.kind}`}
              aria-hidden="true"
            >
              {feedbackModal.kind === "success" ? "OK" : "!"}
            </div>
            <h3 id="profile-feedback-title">{feedbackModal.title}</h3>
            <p>{feedbackModal.message}</p>
            <button
              type="button"
              className="profile-page__modal-button"
              onClick={() => setFeedbackModal((prev) => ({ ...prev, open: false }))}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;