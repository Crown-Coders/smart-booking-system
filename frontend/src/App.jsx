import { BrowserRouter, Routes, Route } from "react-router-dom";
import TherapistDashboard from "./Therapist/TherapistDashboard";
import Profile from "./Therapist/Profile";
import BookingHistory from "./Therapist/BookingHistory";
import TotalSessions from "./Therapist/TotalSessions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TherapistDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        <Route path="/total-sessions" element={<TotalSessions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;