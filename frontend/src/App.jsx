import { BrowserRouter, Routes, Route } from "react-router-dom";
import TherapistDashboard from './Therapist/TherapistDashboard';
import Profile from './Therapist/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TherapistDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;