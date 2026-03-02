// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Login from "./components/layout/Login";
import Home from "./components/layout/Home";


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Placeholder user role, later comes from authentication
  const user = { role: "therapist" }; // Change to "therapist" or "client" to test different menus

  return (
    <Router>
      <div className="app-layout">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <Sidebar
          userRole={user.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className={`content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Add more protected routes here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;