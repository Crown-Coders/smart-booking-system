// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Login from "./components/layout/Login";
import Register from "./components/layout/Register";
import LandingPage from "./components/layout/LandingPage";

// User pages
import UserDashboard from './Pages/users/UserDashboard';
import MyAppointments from './Pages/users/MyAppointments';
import Calendar from './Pages/users/Calendar';
import Messages from './Pages/users/Messages';

// Helper to detect client dashboard routes
const isClientRoute = (pathname) => {
  const clientPaths = ['/dashboard', '/appointments', '/calendar', '/messages', '/ai-chatbot'];
  return clientPaths.some(path => pathname.startsWith(path));
};

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // NEW: track screen size
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const user = { role: "client" };
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const showSidebar = !isAuthPage && isClientRoute(location.pathname);

  // NEW: decide when to shift content
  const shouldShiftContent = showSidebar && (isMobile ? sidebarOpen : true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
      showSidebarToggle={showSidebar}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
    />

      {showSidebar && (
        <Sidebar
          userRole={user.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <main className={
        isAuthPage
          ? "login-fullscreen"
          : `content ${shouldShiftContent ? 'sidebar-open' : ''}` 
      }
       style={{ flex: 1 }} // ← this makes main grow to push footer down
      >
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleLoginSuccess} />} />

          {/* Client dashboard routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/ai-chatbot" element={<div>AI Chatbot (Coming Soon)</div>} />
        </Routes>
      </main>

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