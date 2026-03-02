// src/components/layout/Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom"; // if you want a sign-up link

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

      localStorage.setItem("token", data.token);
      console.log("Login successful");
      // redirect to dashboard (you can add navigate here)
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <style>{`
        .login-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 60px - 4rem); /* account for navbar & content padding */
          width: 100%;
          padding: 1rem;
          box-sizing: border-box;
        }

        .login-card {
          background-color: #E5DDDE;        /* light cream */
          padding: 2.5rem 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 35, 36, 0.12);
          width: 100%;
          max-width: 400px;
          text-align: center;
          transition: transform 0.2s;
        }

        .login-card:hover {
          transform: translateY(-2px);
        }

        .login-card h2 {
          margin-bottom: 0.5rem;
          color: #002324;
          font-size: 2rem;
          font-weight: 600;
        }

        .login-subtitle {
          color: #A1AD95;
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }

        .input-group {
          margin-bottom: 1.2rem;
          text-align: left;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.4rem;
          color: #002324;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .login-card input {
          width: 100%;
          padding: 0.9rem 1rem;
          border: 1px solid #A1AD95;
          border-radius: 10px;
          outline: none;
          font-size: 1rem;
          background-color: #EBFACF;
          color: #002324;
          transition: border 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .login-card input:focus {
          border-color: #002324;
          box-shadow: 0 0 0 3px rgba(0, 35, 36, 0.1);
        }

        .login-card button {
          width: 100%;
          padding: 0.9rem;
          background-color: #002324;
          color: #EBFACF;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.1s;
          margin-top: 0.5rem;
        }

        .login-card button:hover {
          background-color: #A1AD95;
          color: #002324;
        }

        .login-card button:active {
          transform: scale(0.98);
        }

        .error-message {
          color: #d32f2f;
          font-size: 0.9rem;
          margin: 0.5rem 0 1rem;
          text-align: left;
          background-color: #ffebee;
          padding: 0.7rem;
          border-radius: 8px;
          border-left: 4px solid #d32f2f;
        }

        .signup-link {
          margin-top: 1.8rem;
          font-size: 0.9rem;
          color: #002324;
        }

        .signup-link a {
          color: #002324;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid #A1AD95;
          transition: color 0.2s;
        }

        .signup-link a:hover {
          color: #A1AD95;
          border-bottom-color: #002324;
        }
      `}</style>

      <div className="login-wrapper">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <div className="login-subtitle">Sign in to your account</div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit">Log in</button>
          </form>

          <div className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;