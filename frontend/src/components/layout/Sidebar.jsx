import { useState, useEffect } from "react";

/* ===== BASE STYLES ===== */

const sidebarBase = {
  width: "240px",
  height: "100vh",
  backgroundColor: "#E6D7FA",
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
  color: "#4B2C73",
  fontSize: "1.3rem",
  fontWeight: "600",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "1.2rem",
  cursor: "pointer",
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
  borderRadius: "6px",
  cursor: "pointer",
  color: "#6B5E7A",
};

const hoverStyle = {
  backgroundColor: "#9A79BA",
  color: "white",
};

const disabledStyle = {
  opacity: 0.5,
  cursor: "not-allowed",
};

/* ===== ROLE → MENU MAP ===== */

const MENU_BY_ROLE = {
  therapist: [
    { name: "Dashboard" },
    { name: "Appointments" },
    { name: "Calendar" },
    { name: "Clients" },
    { name: "AI Chatbot", disabled: true },
  ],
  client: [
    { name: "My Appointments" },
    { name: "Calendar" },
    { name: "Messages" },
    { name: "Profile" },
  ],
  admin: [
    { name: "Dashboard" },
    { name: "Users" },
    { name: "Therapists" },
    { name: "Reports" },
    { name: "System Settings" },
  ],
};

function Sidebar({ userRole, isOpen, onClose }) {
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  /* ===== HANDLE RESPONSIVENESS ===== */
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const menuItems = MENU_BY_ROLE[userRole] ?? [];

  const sidebarStyle = {
    ...sidebarBase,
    transform:
      isMobile && !isOpen ? "translateX(-100%)" : "translateX(0)",
  };

  return (
    <aside style={sidebarStyle}>
      <div style={headerStyle}>
        <span>Mental</span>

        {/* Close button only on mobile */}
        {isMobile && (
          <button style={closeBtnStyle} onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <ul style={navStyle}>
        {menuItems.map((item, index) => (
          <li
            key={item.name}
            style={{
              ...navItemStyle,
              ...(hovered === index ? hoverStyle : {}),
              ...(item.disabled ? disabledStyle : {}),
            }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => {
              if (!item.disabled) {
                console.log(item.name);
                if (isMobile) onClose();
              }
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;