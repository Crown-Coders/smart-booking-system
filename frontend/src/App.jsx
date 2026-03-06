// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Login from "./components/layout/Login";
import Register from "./components/layout/Register";
import Home from "./components/layout/Home";
import TherapistDashboard from "./Therapist/TherapistDashboard";
import Profile from "./Therapist/Profile";
import TotalSessions from "./Therapist/TotalSessions";
import UpcomingSessions from "./Therapist/UpcomingSessions";
import BookingHistory from "./Therapist/BookingHistory";
// User pages
import UserDashboard from './Pages/users/UserDashboard';
import MyAppointments from './Pages/users/MyAppointments';
import Calendar from './Pages/users/Calendar';
import Messages from './Pages/users/Messages';
import AdminDashboard from './Pages/AdminDashboard';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

const user = JSON.parse(localStorage.getItem("user"));


  // Show navbar on ALL pages
  const showNavbar = true;
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* Always show navbar */}
      {showNavbar && (
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}
      
      {/* Only show sidebar on non-auth pages */}
      {!isAuthPage && (
        <>
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <Sidebar
            userRole={user?.role}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

        </>
      )}

      <main className={isAuthPage ? "login-fullscreen" : `content ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/total-sessions" element={<TotalSessions />} />
          <Route path="/upcoming-sessions" element={<UpcomingSessions />} />
          
          {/* Client routes only - these match your sidebar menu */}
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/ai-chatbot" element={<div>AI Chatbot (Coming Soon)</div>} />
          <Route
              path="/admin"
              element={user?.role === "SUPERUSER" ? <AdminDashboard /> : <Home />}
            />
            <Route
              path="/therapist/dashboard"
              element={user?.role === "THERAPIST" ? <TherapistDashboard /> : <Home />}
            />

            <Route
              path="/dashboard"
              element={user?.role === "CLIENT" ? <UserDashboard /> : <Home />}
            />

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