// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./assets/images/logo-mental.com.png";

// Layout components
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PrivateRoute from "./components/layout/PrivateRoute";

// AI Chatbot
import AIChatbot from "./components/AI/Chatbot";
import ChatbotButton from "./components/AI/ChatbotButton";

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
import Services from "./Pages/users/Services";
import PaymentSuccess from "./Pages/PaymentSuccess";
import PaymentCancel from "./Pages/PaymentCancel";

// Admin pages
import AdminDashboard from "./Pages/AdminDashboard";
import UsersPage from "./Pages/UserPage";

// Helper to detect dashboard routes for showing sidebar
const isDashboardRoute = (pathname) => {
  const dashboardPaths = [
    '/dashboard',
    '/appointments',
    '/calendar',
    '/services',
    '/ai-chatbot',
    '/admin',
    '/therapist',
    '/profile',
    '/booking-history',
    '/total-sessions',
    '/upcoming-sessions'
  ];
  return dashboardPaths.some(path => pathname.startsWith(path));
};

const readStoredAuth = () => {
  try {
    const rawUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const user = rawUser ? JSON.parse(rawUser) : null;
    return {
      user,
      token,
      isAuthenticated: Boolean(token && user),
    };
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }
};

const getDashboardPath = (role) => {
  if (role === "SUPERUSER" || role === "ADMIN") return "/admin";
  if (role === "THERAPIST") return "/therapist/dashboard";
  return "/dashboard";
};

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [authState, setAuthState] = useState(() => readStoredAuth());
  const location = useLocation();
  const navigate = useNavigate();

  // Chatbot open/close status
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => setIsChatOpen(prev => !prev);

  const { user, isAuthenticated } = authState;
  const dashboardPath = useMemo(() => getDashboardPath(user?.role), [user?.role]);

  // Show navbar on all pages
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const showSidebar = !isAuthPage && isDashboardRoute(location.pathname);

  // Check screen width on mount and resize
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const syncAuth = () => setAuthState(readStoredAuth());
    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("authchange", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authchange", syncAuth);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const shouldShiftContent = showSidebar && isAuthenticated && (isMobile ? sidebarOpen : true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event("authchange"));
    navigate('/');
  };

  const handleLoginSuccess = () => {
    const latestAuth = readStoredAuth();
    setAuthState(latestAuth);
    navigate(getDashboardPath(latestAuth.user?.role));
  };

  const handleRegisterSuccess = () => {
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showSplash && (
        <div className="app-splash" aria-hidden="true">
          <div className="app-splash__orb" />
          <div className="app-splash__card">
            <div className="app-splash__logo-ring">
              <img src={logo} alt="" className="app-splash__logo" />
            </div>
            <p className="app-splash__eyebrow">MENTAL.COM</p>
            <h1 className="app-splash__title">Care that feels calm from the first click.</h1>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        showSidebarToggle={showSidebar && isAuthenticated}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        dashboardPath={dashboardPath}
      />

      {/* Sidebar (only visible if logged in) */}
      {showSidebar && isAuthenticated && (
        <Sidebar
          userRole={user?.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main
        className={
          isAuthPage
            ? "login-fullscreen"
            : `content ${shouldShiftContent ? "sidebar-open" : ""}`
        }
      >
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} />} />

          {/* Therapist routes */}
          <Route path="/therapist/dashboard" element={<TherapistDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/total-sessions" element={<TotalSessions />} />
          <Route path="/upcoming-sessions" element={<UpcomingSessions />} />

          {/* Client routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/appointments" element={<MyAppointments />} />

          {/* Services page (public, but sidebar visible only if logged in) */}
          <Route path="/services" element={<Services />} />

          {/* Calendar is protected */}
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <Calendar />
              </PrivateRoute>
            }
          />

          {/* Payment routes */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />

          {/* AI Chatbot */}
          <Route path="/ai-chatbot" element={<div>AI Chatbot (Coming Soon)</div>} />

          {/* Admin routes with role-based access */}
          <Route
            path="/admin"
            element={user?.role === "SUPERUSER" ? <AdminDashboard /> : <LandingPage />}
          />
          <Route
            path="/admin/users"
            element={user?.role === "SUPERUSER" ? <UsersPage /> : <LandingPage />}
          />
        </Routes>
      </main>

      {/* Floating chatbot */}
      {isAuthenticated && (
        <>
          <ChatbotButton onClick={toggleChat} />
          <AIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
      )}

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
