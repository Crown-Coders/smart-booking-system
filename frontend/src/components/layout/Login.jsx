import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-mental.com.png";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      // Safely read response text first
      const text = await response.text();

      // Convert to JSON only if there is content
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.message || "Login failed");
      }

      // Save token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authchange"));

      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(data.user);
        return;
      }

      // Redirect based on role
      if (data.user.role === "SUPERUSER" || data.user.role === "ADMIN") {
        navigate("/admin");
      } 
      else if (data.user.role === "THERAPIST") {
        navigate("/therapist/dashboard");
      } 
      else {
        navigate("/dashboard");
      }

    } catch (err) {
      if (err instanceof TypeError) {
        setError(`Cannot reach backend at ${apiBaseUrl}. Make sure backend is running and CORS allows this frontend origin.`);
        return;
      }

      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="login-card-wrapper">
      <div className="login-card">
        <img src={logo} alt="Mental.com Logo" className="navbar-logo" />

        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit}>

          <div className="input-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: "0.6rem 0.75rem",
                fontSize: "1rem",
                backgroundColor: "white"
              }}
            />
          </div>

          <div className="input-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: "0.6rem 0.75rem",
                fontSize: "1rem",
                backgroundColor: "white"
              }}
            />
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
            Log in
          </button>

        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
