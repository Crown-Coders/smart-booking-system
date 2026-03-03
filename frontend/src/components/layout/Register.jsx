// src/components/layout/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).some((field) => !field)) {
      setError("All fields are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          surname: form.surname,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-fullscreen">
      <div className="login-card-wrapper" style={{ maxWidth: "500px" }}> 
        <div className="login-card" style={{ padding: "2.5rem 2rem" }}>
          <h2>Create Account</h2>
          <p className="login-subtitle">Sign up to get started</p>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3"> 
              <label className="input-group">Name</label>
              <input
                type="text"
                name="name"
                placeholder="First Name"
                value={form.name}
                onChange={handleChange}
                className="form-control" 
                style={{ padding: "0.6rem 0.75rem", fontSize: "1rem" }} 
                required
              />
            </div>
            
            {/* Surname - Now below Name */}
            <div className="mb-3">
              <label className="input-group">Surname</label>
              <input
                type="text"
                name="surname"
                placeholder="Last Name"
                value={form.surname}
                onChange={handleChange}
                className="form-control" 
                style={{ padding: "0.6rem 0.75rem", fontSize: "1rem" }}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="input-group">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="form-control" 
                style={{ padding: "0.6rem 0.75rem", fontSize: "1rem" }} 
                required
              />
            </div>

            {/* Password + Confirm - Keeping these side by side as requested */}
            <div className="row g-2 mb-3">
              <div className="col">
                <label className="input-group">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-control" 
                  style={{ padding: "0.6rem 0.75rem", fontSize: "1rem" }} 
                  required
                />
              </div>
              <div className="col">
                <label className="input-group">Confirm</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="form-control" 
                  style={{ padding: "0.6rem 0.75rem", fontSize: "1rem" }} 
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-dark w-100" style={{ padding: "0.6rem 0.75rem", fontSize: "1rem" }}> 
              Sign Up
            </button>
          </form>

          <p className="signup-link mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
