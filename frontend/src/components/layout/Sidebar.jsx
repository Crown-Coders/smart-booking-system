// src/components/layout/Sidebar.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const COLORS = {
  background: "#002324",
  text: "#E5DDDE",
  hover: "#EBFACF",
  accent: "#A1AD95",
  disabled: "#A1AD95",
};

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
  marginBottom: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  minHeight: "40px",
};

const sectionLabelStyle = {
  color: COLORS.accent,
  fontSize: "0.8rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
  color: COLORS.text,
  padding: "0.25rem 0.5rem",
  borderRadius: "4px",
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

const MENU_BY_ROLE = {
  therapist: [
    { name: "Therapist Dashboard", path: "/therapist/dashboard" },
    { name: "Profile", path: "/profile" },
    { name: "Total Sessions", path: "/total-sessions" },
    { name: "Upcoming Sessions", path: "/upcoming-sessions" },
    { name: "Booking History", path: "/booking-history" },
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
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleNavigation = (item) => {
    if (!item.disabled && item.path) {
      navigate(item.path);
      if (isMobile) onClose();
    }
  };

  return (
    <aside style={sidebarStyle}>
      <div style={headerStyle}>
        {userRole === "therapist" && <span style={sectionLabelStyle}>Therapist</span>}
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
            aria-label="Close sidebar"
          >
            X
          </button>
        )}
      </div>

      <ul style={navStyle}>
        {menuItems.map((item, index) => {
          const isActive = item.path === location.pathname;
          return (
            <li
              key={item.name}
              style={{
                ...navItemStyle,
                ...(hovered === index ? hoverStyle : {}),
                ...(isActive ? hoverStyle : {}), 
                ...(item.disabled ? disabledStyle : {}),
              }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleNavigation(item)} /* FIX: onClick is now properly an HTML attribute! */
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