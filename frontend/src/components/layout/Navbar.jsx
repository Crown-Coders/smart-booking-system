// src/components/layout/Navbar.jsx
import React from 'react';
import { Link } from "react-router-dom";

function Navbar() {
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

        @media (max-width: 768px) {
          .navbar {
            padding: 0 1rem;
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
        <Link to="/" className="navbar-brand">Smart Booking</Link>
        <div className="nav-links">
          <Link to="/home" className="nav-link active">Home</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;