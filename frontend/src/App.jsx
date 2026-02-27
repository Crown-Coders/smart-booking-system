// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Login from "./components/layout/Login";
import Register from "./components/layout/Register";
import Home from "./components/layout/Home";
import TherapistDashboard from './Therapist/TherapistDashboard';
import Profile from './Therapist/Profile';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const user = { role: "therapist" };

  // Hide navbar/sidebar for login and register pages
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isAuthPage && (
        <>
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <Sidebar
            userRole={user.role}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </>
      )}

      <main className={isAuthPage ? "login-fullscreen" : `content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        <Route path="/" element={<TherapistDashboard />} />
        <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
