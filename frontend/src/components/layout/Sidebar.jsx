// src/components/layout/Sidebar.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ADDED for routing

/* ===== COLOR PALETTE ===== */
const COLORS = {
  background: "#002324",      // Dark green sidebar
  text: "#E5DDDE",            // Light cream text
  hover: "#EBFACF",           // Soft green hover background
  accent: "#A1AD95",          // Accent green for borders/highlights
  disabled: "#A1AD95",        // Slightly muted accent for disabled
};

/* ===== BASE STYLES ===== */
const sidebarBase = {
  width: "240px",
  height: "100vh",
  backgroundColor: COLORS.background,
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
  position: "fixed",
  top: 0,
  left: 0,
  transition: "transform 0.3s ease",
  zIndex: 1000,
};

const headerStyle = {
  marginBottom: "2rem",
  color: COLORS.hover,          // Reserved for potential future use
  fontSize: "1.5rem",
  fontWeight: "700",
  display: "flex",
  justifyContent: "flex-end",   // Align close button to the right
  alignItems: "center",
  minHeight: "40px",            // Ensure consistent height even when empty
};

const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
  color: COLORS.text,
  padding: "0.25rem 0.5rem",
  borderRadius: "4px",
  transition: "background-color 0.2s",
};

const closeBtnHover = {
  backgroundColor: COLORS.hover,
  color: COLORS.background,
};

const navStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  flexGrow: 1,
};

const navItemStyle = {
  padding: "0.75rem 1rem",
  marginBottom: "0.5rem",
  borderRadius: "8px",
  cursor: "pointer",
  color: COLORS.text,
  fontWeight: 500,
  transition: "all 0.3s ease",
};

const hoverStyle = {
  backgroundColor: COLORS.hover,
  color: COLORS.background,
  fontWeight: 600,
};

const disabledStyle = {
  opacity: 0.5,
  cursor: "not-allowed",
  color: COLORS.disabled,
};

/*  ROLE → MENU MAP - UPDATED with paths */
const MENU_BY_ROLE = {
  therapist: [
    { name: "Dashboard", path: "/therapist/dashboard" },
    { name: "Appointments", path: "/therapist/appointments" },
    { name: "Calendar", path: "/therapist/calendar" },
    { name: "Clients", path: "/therapist/clients" },
    { name: "Profile", path: "/therapist/profile" },
    { name: "AI Chatbot", path: "/ai-chatbot", disabled: true },
  ],

  client: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Appointments", path: "/appointments" },
    { name: "Calendar", path: "/calendar" },
    { name: "Messages", path: "/messages" },
    { name: "AI Chatbot", path: "/ai-chatbot", disabled: true },
  ],

  admin: [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Therapists", path: "/admin/therapists" },
    { name: "Reports", path: "/admin/reports" },
    { name: "System Settings", path: "/admin/settings" },
    { name: "AI Chatbot", path: "/ai-chatbot", disabled: true },
  ],
};

function Sidebar({ userRole, isOpen, onClose }) {
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate(); // ADDED for navigation
  const location = useLocation(); // ADDED to check active route

  // Handle mobile responsiveness
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const menuItems = MENU_BY_ROLE[userRole] ?? [];

  const sidebarStyle = {
    ...sidebarBase,
    transform: isMobile && !isOpen ? "translateX(-100%)" : "translateX(0)",
  };

  // ADDED: Function to handle navigation
  const handleNavigation = (item) => {
    if (!item.disabled && item.path) {
      navigate(item.path);
      if (isMobile) onClose(); // Close sidebar on mobile after navigation
    }
  };

  return (
    <aside style={sidebarStyle}>
      {/* Sidebar header – now only contains the close button on mobile */}
      <div style={headerStyle}>
        {isMobile && (
          <button
            style={closeBtnStyle}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.hover;
              e.currentTarget.style.color = COLORS.background;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = COLORS.text;
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation items */}
      <ul style={navStyle}>
        {menuItems.map((item, index) => {
          // ADDED: Check if this item matches the current route
          const isActive = location.pathname === item.path;
          
          return (
            <li
              key={item.name}
              style={{
                ...navItemStyle,
                ...(hovered === index ? hoverStyle : {}),
                ...(isActive ? hoverStyle : {}), // Use hover style for active state (matches original design)
                ...(item.disabled ? disabledStyle : {}),
              }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleNavigation(item)} // UPDATED: use navigation function
            >
              {item.name}
              {item.disabled && <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", color: COLORS.accent }}>(coming soon)</span>}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;