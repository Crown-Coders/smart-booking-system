// src/components/layout/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-mental.com.png";

function Register({ onRegisterSuccess }) {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    idNumber: "",
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
          idNumber: form.idNumber
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      window.dispatchEvent(new Event("authchange"));
      if (typeof onRegisterSuccess === 'function') {
        onRegisterSuccess();
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Created a shared style object so all inputs match Login.jsx perfectly
  const inputStyle = { 
    padding: "0.6rem 0.75rem", 
    fontSize: "1rem",
    backgroundColor: "white" 
  };

  return (
    // ✅ Removed the outer .login-fullscreen wrapper!
    <div className="login-card-wrapper" style={{ maxWidth: "550px" }}> 
      <div className="login-card">
        
        {/* ✅ Matched the logo class to Login.jsx */}
        <img src={logo} alt="Mental.com Logo" className="navbar-logo" />
        <h2>Create Account</h2>
        <p className="login-subtitle">Sign up to get started</p>

        <form onSubmit={handleSubmit}>
          
          <div className="input-group" style={{ marginBottom: "1.5rem" }}> 
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              type="text"
              name="name"
              placeholder="First Name"
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          
          <div className="input-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="register-surname">Surname</label>
            <input
              id="register-surname"
              type="text"
              name="surname"
              placeholder="Last Name"
              value={form.surname}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="register-id-number">ID Number</label>
            <input
              id="register-id-number"
              type="text"
              name="idNumber"
              placeholder="Enter your ID Number"
              value={form.idNumber}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
              <label htmlFor="register-confirm-password">Confirm</label>
              <input
                id="register-confirm-password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            style={{ 
              padding: "0.6rem 0.75rem", 
              fontSize: "1rem",
              width: "100%",
              marginTop: "0.5rem" 
            }}
          > 
            Sign Up
          </button>
        </form>

        <p className="signup-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        
      </div>
    </div>
  );
}

export default Register;
