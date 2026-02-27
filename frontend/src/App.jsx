import { useState } from "react";
import './App.css'
import Sidebar from './components/layout/Sidebar'


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //  This will come from auth later
  const user = {
    role: "admin", // try: "client" or "admin" or "therapist"
  };

   return (
    <div className="app-layout">
      {/* Top bar (mobile) */}
      <header className="topbar">
        <button
          className="hamburger"
          onClick={() => setSidebarOpen((open) => !open)}
        >
          ☰
        </button>
        <span className="app-title">Smart Booking</span>
      </header>

      <Sidebar
        userRole={user.role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="content">
        <h1>Dashboard</h1>
      </main>
    </div>
  );
}

export default App;

