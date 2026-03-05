// src/App.jsx
import { useState } from "react";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';

// Layout components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import Login from "./components/layout/Login";
import Register from "./components/layout/Register";
import LandingPage from "./components/layout/LandingPage"; 
// User pages
import UserDashboard from './Pages/users/UserDashboard';
import MyAppointments from './Pages/users/MyAppointments';
import Calendar from './Pages/users/Calendar';
import Messages from './Pages/users/Messages';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Fixed to client role only
  const user = { role: "client" };

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
        <Sidebar
          userRole={user.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <main className={
        isAuthPage 
          ? "login-fullscreen" 
          : `content ${sidebarOpen ? 'sidebar-open' : ''}`
      }>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Client routes only - these match your sidebar menu */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/ai-chatbot" element={<div>AI Chatbot (Coming Soon)</div>} />
        </Routes>
      </main>

      {/* Footer always visible */}
      <Footer />
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
