import { useState } from "react";
import { motion } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, maxLength } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.slice(0, maxLength || undefined),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // …submit logic…
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      overflow: "hidden",              
      backgroundColor: "#fff",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    card: {
      width: "min(92vw, 1200px)",
      maxWidth: "460px",
      margin: "0 auto",
      backgroundColor: "#E5DDDE",
      borderRadius: "16px",            
      boxShadow: "0 8px 30px rgba(0,35,36,.12)",
      minHeight: "750px",              
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "2.5rem 2rem",         
      transition: "transform 0.2s",
    },
    header: {
      textAlign: "center",
      marginBottom: "2rem",
    },
    title: {
      color: "#002324",
      fontSize: "2rem",
      fontWeight: 600,
      margin: 0,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem",
      flex: "1 0 auto",
      justifyContent: "center",
    },
    field: {
      display: "flex",
      flexDirection: "column",
      gap: "0.4rem",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: 500,
      color: "#002324",
    },
    input: {
      width: "100%",
      padding: "0.9rem 1rem",
      border: "1px solid #A1AD95",
      borderRadius: "10px",
      outline: "none",
      fontSize: "1rem",
      backgroundColor: "#fff",      // matching login input
      color: "#002324",
      transition: "border 0.2s, box-shadow 0.2s",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "0.9rem",
      backgroundColor: "#002324",
      color: "#EBFACF",
      border: "none",
      borderRadius: "10px",
      fontSize: "1.1rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "background-color 0.3s ease, transform 0.1s",
      marginTop: "0.5rem",
    },
    footer: {
      textAlign: "center",
      fontSize: "0.9rem",
      marginTop: "1.8rem",
      color: "#002324",
    },
    signinLink: {
      color: "#002324",
      fontWeight: 600,
      textDecoration: "none",
      borderBottom: "1px solid #A1AD95",
      transition: "color 0.2s",
    },
  };

  return (
    <div style={styles.page}>
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ transform: "translateY(-2px)" }}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>Create your account</h2>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>FULL NAME</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Jane Doe"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>EMAIL</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>PASSWORD</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              maxLength={13}                    // 13‑character max
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>CONFIRM PASSWORD</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              maxLength={13}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Create account
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{" "}
          <a href="/login" style={styles.signinLink}>
            Sign in
          </a>
        </div>
      </motion.div>
    </div>
  );
}