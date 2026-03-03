// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Login from "./components/layout/Login";
import Register from "./components/layout/Register";
import Home from "./components/layout/Home";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock user state; replace with real authentication later
  const [user, setUser] = useState({ role: "therapist" }); // or null for not logged in

  return (
    <Router>
      <div
        className="app-layout"
        style={{ "--sidebar-width": user?.role ? "240px" : "0px" }}
      >
        {/* Navbar */}
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Sidebar - only render if user is logged in */}
        {user?.role && (
          <Sidebar
            userRole={user.role}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className={`content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/register"
              element={
                <div className="route-page">
                  <Register />
                </div>
              }
            />
            {/* Add more protected routes here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;