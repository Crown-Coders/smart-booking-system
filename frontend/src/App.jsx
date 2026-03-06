import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./App.css";

// AI Chatbot
import AIChatbot from "./components/AI/AIChatbot";

// Layout components
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Auth & Public pages
import Login from "./components/layout/Login";
import Register from "./components/layout/Register";
import LandingPage from "./components/layout/LandingPage";

// Therapist pages
import TherapistDashboard from "./Therapist/TherapistDashboard";
import Profile from "./Therapist/Profile";
import TotalSessions from "./Therapist/TotalSessions";
import UpcomingSessions from "./Therapist/UpcomingSessions";
import BookingHistory from "./Therapist/BookingHistory";

// User pages
import UserDashboard from "./Pages/users/UserDashboard";
import MyAppointments from "./Pages/users/MyAppointments";
import Calendar from "./Pages/users/Calendar";
import Messages from "./Pages/users/Messages";

// Helper function to detect client routes
const isClientRoute = (pathname) => {
  const clientPaths = [
    "/dashboard",
    "/appointments",
    "/calendar",
    "/messages",
    "/ai-chatbot",
  ];

  return clientPaths.some((path) => pathname.startsWith(path));
};

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const pathname = location.pathname;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const showSidebar = !isAuthPage && isClientRoute(pathname);

  const user = { role: "client" };

  const shouldShiftContent =
    showSidebar && (isMobile ? sidebarOpen : true);

  // Detect screen size
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Check login token
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <Navbar
        showSidebarToggle={showSidebar}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          userRole={user.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={
          isAuthPage
            ? "login-fullscreen"
            : `content ${shouldShiftContent ? "sidebar-open" : ""}`
        }
        style={{ flex: 1 }}
      >
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/register"
            element={<Register onRegisterSuccess={handleLoginSuccess} />}
          />

          {/* Therapist */}
          <Route
            path="/therapist/dashboard"
            element={<TherapistDashboard />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/total-sessions" element={<TotalSessions />} />
          <Route
            path="/upcoming-sessions"
            element={<UpcomingSessions />}
          />

          {/* Client */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/messages" element={<Messages />} />

          {/* AI Chatbot */}
          <Route path="/ai-chatbot" element={<AIChatbot />} />
        </Routes>
      </main>

      {/* Footer */}
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