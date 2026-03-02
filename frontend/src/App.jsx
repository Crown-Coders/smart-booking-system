import { useState } from "react";
import './App.css'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // This will come from auth later
  const user = {
    role: "admin", // try: "client" or "admin" or "therapist"
  };

  return (
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
        <h1>Dashboard</h1>
      </main>
    </div> 
  );
}

export default App;