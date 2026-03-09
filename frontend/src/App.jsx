// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
 
// Layout components
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer"; 
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
import UserDashboard from './Pages/users/UserDashboard';
import MyAppointments from './Pages/users/MyAppointments';
import Calendar from './Pages/users/Calendar';
import Messages from './Pages/users/Messages';
import PaymentSuccess from "./Pages/PaymentSuccess";
import PaymentCancel from "./Pages/PaymentCancel";


// Admin pages
import AdminDashboard from './Pages/AdminDashboard';
import UsersPage from './Pages/UserPage';

// Helper to detect dashboard routes for showing sidebar
const isDashboardRoute = (pathname) => {
  const dashboardPaths = [
    '/dashboard',
    '/appointments',
    '/calendar',
    '/messages',
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
 
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

 //chatbot's open/close status
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => setIsChatOpen(prev => !prev);

  const user = JSON.parse(localStorage.getItem("user"));
 
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
 
  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);
 
  const shouldShiftContent = showSidebar && (isMobile ? sidebarOpen : true);
 
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };
 
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
 

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
     
      {/* Cleaned up Navbar logic so it only renders once */}
      <Navbar
        showSidebarToggle={showSidebar}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
 
      {showSidebar && (
        <Sidebar
          userRole={user?.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
 
      <main
        className={isAuthPage ? "login-fullscreen" : `content ${shouldShiftContent ? "sidebar-open" : ""}`}
        style={{ flex: 1 }}
      >
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleLoginSuccess} />} />
          
          {/* Therapist routes */}
          <Route path="/therapist/dashboard" element={<TherapistDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/total-sessions" element={<TotalSessions />} />
          <Route path="/upcoming-sessions" element={<UpcomingSessions />} />
 
          {/* Client routes only */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />

          <Route path="/ai-chatbot" element={<div>AI Chatbot (Coming Soon)</div>} />
          <Route
              path="/admin"
              element={user?.role === "SUPERUSER" ? <AdminDashboard /> : <LandingPage />}
            />
            <Route
              path="/admin/users"
              element={user?.role === "SUPERUSER" ? <UsersPage /> : <LandingPage />}
            />
            <Route
              path="/therapist/dashboard"
              element={user?.role === "THERAPIST" ? <TherapistDashboard /> : <LandingPage />}
            />
 
            <Route
              path="/dashboard"
              element={user?.role === "CLIENT" ? <UserDashboard /> : <LandingPage />}
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
      {/* Footer  */}
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
 