# smart-booking-system
Therapy booking system (mental.com)
# Smart Booking System

A full-stack booking platform for therapy sessions with User, Therapist, and Admin/Superuser roles. Users can create bookings, therapists can manage their schedules, and admins can manage the system. Features include booking management, payment integration (PayFast), email notifications, and a chatbot for user assistance. Built with React frontend, Express/Node backend, Sequelize ORM, and PostgreSQL/SQLite.

# Features

User registration and login

Therapists registration and login

Superuser/Admin can add therapists and users

Users can book therapy sessions and see their confirmed bookings

Therapists can view their schedules and manage bookings through their dashboard

Real-time availability checking

PayFast payment integration with IPN webhook

Email notifications for booking and payment confirmation

Chatbot integration for assistance

Responsive frontend design

# Technologies

Frontend: React , Vite, Tailwind CSS
Backend: Node.js, Express.js, Sequelize ORM
Database: PostgreSQL (production), SQLite (development)
Other: PayFast payment gateway, bcryptjs, dotenv

# System Requirements

Node.js >= 18

npm >= 9

PostgreSQL (for production)

Render or similar hosting for deployment


# Project Structure
smart-booking-system/
├─ backend/
│  ├─ models/          # Sequelize models
│  ├─ routes/          # Express routes
│  ├─ utils/           # Utilities (PayFast, email)
│  ├─ server.js        # Main backend server
│  ├─ createSuperUser.js # Script to create initial superuser
├─ frontend/
│  ├─ src/
│  │  ├─ components/   # React components
│  │  ├─ Pages/        # Pages
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  ├─ vite.config.js
├─ .env
├─ package.json
└─ README.md

# Setup and Installation

Clone the repository:

git clone https://github.com/Crown-Coders/smart-booking-system.git
cd smart-booking-system


Install backend dependencies:

cd backend
npm install


Install frontend dependencies:

cd ../frontend
npm install  

# Running Locally

Backend:

cd backend
npm start / npm server.js


Frontend:

cd frontend
npm run dev


The frontend runs on http://localhost:5173 and communicates with the backend on http://localhost:5000.

# Deployment

Deploy backend on Render using Node.js environment.

Deploy frontend on Render using the production URL.

Ensure environment variables are set in the hosting dashboard.

Backend must use the PORT provided by Render.

Production URLs:

Frontend: https://smart-booking-system-8cgy.onrender.com

Backend: https://smart-booking-system-backend-nxum.onrender.com

# Payment Integration (PayFast)

Sandbox URL: https://sandbox.payfast.co.za/eng/process

Production URL: https://www.payfast.co.za/eng/process

Backend handles return_url, cancel_url, and notify_url from .env.

Ensure notify_url points to backend endpoint /api/bookings/payfast-ipn.


# API Routes
Auth

POST /api/auth/register - Register new user

POST /api/auth/login - Login

Users

GET /api/users/:userId - Get user bookings

Booking

POST /api/bookings - Create booking

POST /api/bookings/payfast/:bookingId - Redirect to PayFast

POST /api/bookings/payfast-ipn - IPN webhook

POST /api/bookings/payment-success/:bookingId - Confirm payment

Admin/Therapist

GET /api/admin/...

GET /api/therapists/...

Chatbot

POST /api/chat - Ask chatbot

