// src/components/layout/Layout.jsx
//this component will wrap around all pages to provide consistent
//  layout with navbar, sidebar, and footer.
//  It will also handle responsive design and conditional
//  rendering of sidebar based on user role and route.
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import './App.css';

// Helper to check if current path is a dashboard route
const isDashboardRoute = (pathname) => {
  return pathname.startsWith("/dashboard");
};

function Layout({ children, userRole = "client" }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const showSidebar = isDashboardRoute(location.pathname);

  // Adjust main content margin based on sidebar visibility
  const mainContentStyle = {
    marginTop: "60px", // height of navbar
    marginLeft: showSidebar ? "240px" : "0",
    padding: "1.5rem",
    minHeight: "calc(100vh - 60px)", // full height minus navbar
    display: "flex",
    flexDirection: "column",
    transition: "margin-left 0.3s ease",
  };

  return (
    <>
      <Navbar />
      {showSidebar && (
        <Sidebar
          userRole={userRole}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      <main style={mainContentStyle}>
        {children}
        <Footer />
      </main>
    </>
  );
}

export default Layout;