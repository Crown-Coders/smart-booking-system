import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo-mental.com.png";

function Navbar({ showSidebarToggle, onToggleSidebar, isAuthenticated, onLogout, dashboardPath = "/dashboard" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, isAuthenticated]);

  return (
    <>
      <style>{`
        .navbar {
          background-color: #002324;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1100;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.25rem;
          gap: 1rem;
        }

        .navbar-brand {
          color: #EBFACF;
          font-size: 1.5rem;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.5px;
          display: inline-flex;
          align-items: center;
        }

        .navbar-logo {
          height: 52px;
          border-radius: 8px;
          object-fit: contain;
          max-width: 100%;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }

        .nav-links {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .nav-link {
          color: #E5DDDE;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 0.95rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .nav-link:hover {
          background-color: #A1AD95;
          color: #002324;
        }

        .nav-link.active {
          background-color: #EBFACF;
          color: #002324;
          font-weight: 600;
        }

        .logout-btn {
          background: transparent;
          border: 1px solid #E5DDDE;
          color: #E5DDDE;
          padding: 0.5rem 0.95rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .logout-btn:hover {
          background-color: #A1AD95;
          color: #002324;
          border-color: #A1AD95;
        }

        .hamburger {
          background: none;
          border: none;
          color: #EBFACF;
          font-size: 1.8rem;
          cursor: pointer;
          display: none;
          padding: 0.25rem 0.5rem;
          line-height: 1;
        }

        .sidebar-toggle {
          display: inline-flex;
          margin-right: 0.25rem;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 1rem;
          }

          .hamburger {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-only {
            display: inline-flex;
          }

          .nav-links {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            background: #002324;
            padding: 1rem;
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
            border-top: 1px solid rgba(229, 221, 222, 0.15);
            box-shadow: 0 14px 30px rgba(0,0,0,0.18);
            transform: translateY(-120%);
            opacity: 0;
            pointer-events: none;
            transition: transform 0.25s ease, opacity 0.25s ease;
          }

          .nav-links.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }

          .nav-link,
          .logout-btn {
            width: 100%;
            text-align: center;
            padding: 0.85rem 1rem;
          }

          .navbar-logo {
            height: 44px;
          }
        }

        @media (min-width: 769px) {
          .mobile-only {
            display: none;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-left">
          {showSidebarToggle ? (
            <button className="hamburger sidebar-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
              ☰
            </button>
          ) : null}
          <NavLink to="/" className="navbar-brand">
            <img src={logo} alt="Mental.com Logo" className="navbar-logo" />
          </NavLink>
        </div>

        <button className="hamburger mobile-only" onClick={() => setMenuOpen((current) => !current)} aria-label="Toggle navigation menu">
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" className="nav-link" end>Home</NavLink>

          {!isAuthenticated ? (
            <NavLink to="/services" className="nav-link">Services</NavLink>
          ) : null}

          {isAuthenticated ? (
            <>
              <NavLink to={dashboardPath} className="nav-link">Dashboard</NavLink>
              <button onClick={onLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/register" className="nav-link">Sign Up</NavLink>
              <NavLink to="/login" className="nav-link">Login</NavLink>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
