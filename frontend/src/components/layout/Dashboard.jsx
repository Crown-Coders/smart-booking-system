import React from "react";
import jwt_decode from "jwt-decode";

function Dashboard() {
  // Get token from localStorage
  const token = localStorage.getItem("token");
  let user = null;

  if (token) {
    user = jwt_decode(token); // decode JWT to get user info
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome {user ? user.name : "Guest"}!</h1>
      <p>This is your dashboard.</p>
    </div>
  );
}

export default Dashboard;
