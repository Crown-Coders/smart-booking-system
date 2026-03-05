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

// Helper to detect dashboard routes
const isDashboardRoute = (pathname) => pathname.startsWith("/dashboard");

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Mock user role – replace with real auth later
  const user = { role: "therapist" }; // or "client", "admin"

  const isDashboard = isDashboardRoute(location.pathname);
  const showSidebar = isDashboard; // sidebar only on dashboards

  // Main content classes: always add 'content', plus 'sidebar-open' if sidebar is open
  const mainClasses = `content ${showSidebar && sidebarOpen ? 'sidebar-open' : ''}`;

  return (
    <div className="app-layout">
      {/* Navbar always visible */}
      <Navbar
        showSidebarToggle={isDashboard}      // hamburger only on dashboards
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Sidebar only on dashboards */}
      {showSidebar && (
        <Sidebar
          userRole={user.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <main className={mainClasses}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard routes */}
        </Routes>
      </main>

      {/* Footer always visible */}
      <Footer />
    </div>
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