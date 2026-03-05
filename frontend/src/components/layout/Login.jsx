import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/images/logo-mental.com.png';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      // ✅ Save token in localStorage
      localStorage.setItem("token", data.token);

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-fullscreen">  
      <div className="login-card-wrapper">
        <div className="login-card">
          
  
        
          <img 
            src={logo}
            alt="Mental.com Logo" 
            style={{ width: "100px", marginBottom: "1rem", borderRadius: "10px" }} 
          />
          
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group" style={{ marginBottom: "1.5rem" }}> 
              <label>Email</label>
              <input
                type="email"
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
              <label>Password</label>
              <input
                type="password"
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
                padding: "0.8rem", 
                fontSize: "1.1rem",
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
    </div>
  );
}

export default Login;