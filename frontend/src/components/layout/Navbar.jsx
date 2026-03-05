// src/components/layout/Navbar.jsx
import React from 'react';
import { NavLink } from "react-router-dom";
import logo from '../../assets/images/logo-mental.com.png';

function Navbar({ showSidebarToggle, onToggleSidebar }) {
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
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
        }

        .navbar-brand {
          color: #EBFACF;
          font-size: 1.5rem;
          font-weight: 700;
          text-decoration: none;
        }
        .navbar-logo {
          height:100px;
          border-radius: 8px; /* softens the square edges of the logo */
          object-fit: contain;
        }
        .navbar-brand:hover {
          color: #A1AD95;
        }

        .nav-links {
          display: flex;
          gap: 1rem;
          align-items: center;
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

        .hamburger {
          background: none;
          border: none;
          color: #EBFACF;
          font-size: 1.8rem;
          cursor: pointer;
          display: none; /* hidden on desktop by default */
          margin-right: 1rem;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 1rem;
          }
          .hamburger {
            display: block; /* show on mobile only */
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
          <NavLink to="/register" className="nav-link">Sign Up</NavLink>
          <NavLink to="/login" className="nav-link">Login</NavLink>
        </div>
      </nav>
    </>
  );
}

export default Navbar;