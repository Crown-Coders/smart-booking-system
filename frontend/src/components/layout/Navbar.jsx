import React from 'react';
import { Link } from "react-router-dom";

function Navbar({ showSidebarToggle, onToggleSidebar, isAuthenticated, onLogout }) {
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
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between; /* brand left, links right */
          padding: 0 2rem;
        }

        .navbar-brand {
          color: #EBFACF;          /* soft green */
          font-size: 1.5rem;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.5px;
        }
        .navbar-logo {
          height:60px;
          border-radius: 8px;
          object-fit: contain;
        }
        .navbar-brand:hover {
          color: #A1AD95;
        }

        .nav-links {
          display: flex;
          gap: 1rem;
        }

        .nav-link {
          color: #E5DDDE;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.3s ease;
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
          padding: 0.4rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
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
          margin-right: 1rem;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 1rem;
          }
          .hamburger {
            display: block;
          }
          .nav-links {
            gap: 0.5rem;
          }
          .nav-link {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
          }
          .navbar-brand {
            font-size: 1.2rem;
          }
        }
      `}</style>

      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {showSidebarToggle && (
            <button className="hamburger" onClick={onToggleSidebar}>
              ☰
            </button>
          )}
          <NavLink to="/" className="navbar-brand">
            <img src={logo} alt="Mental.com Logo" className="navbar-logo" />
          </NavLink>
        </div>

        <div className="nav-links">
          <NavLink to="/" className="nav-link" end>Home</NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
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