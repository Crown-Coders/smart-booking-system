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

## Frontend (Web)
- React
- Vite
- Tailwind CSS

## Mobile Application
- React Native
- Expo
- React Navigation
- EAS Build (Android APK generation)

## Backend
- Node.js
- Express.js
- Sequelize ORM

## Database
- PostgreSQL (Production)
- SQLite (Development)

## Other Tools & Services
- PayFast (Payment Gateway)
- Brevo (Email Service)
- bcryptjs (Password Hashing)
- dotenv (Environment Variables)
- JSON Web Tokens (JWT Authentication)


# System Requirements

## Development Environment
- Node.js >= 18
- npm >= 9
- Git

## Web & Backend
- PostgreSQL (Production)
- SQLite (Development)
- Render or similar cloud hosting

## Mobile
- Expo CLI
- EAS CLI
- Android Studio (Emulator)
- Android device (optional, for testing)


# Project Structure

```text
smart-booking-system/
├─ backend/
│  ├─ models/               # Sequelize models (User, Booking, Therapist, etc.)
│  ├─ routes/               # Express API routes
│  ├─ controllers/          # Request handling logic
│  ├─ utils/                # Utilities (PayFast, email, helpers)
│  ├─ middleware/           # Auth & role-based access control
│  ├─ server.js             # Main backend server entry
│  ├─ createSuperUser.js    # Script to create initial superuser
│  ├─ .env                  # Backend environment variables
│  └─ package.json
│
├─ frontend/
│  ├─ src/
│  │  ├─ components/        # Reusable React components
│  │  ├─ pages/             # Page-level views
│  │  ├─ services/          # API service calls
│  │  ├─ context/           # Auth & global state
│  │  ├─ App.jsx            # App root component
│  │  └─ main.jsx           # React entry point
│  ├─ vite.config.js
│  ├─ .env                  # Frontend environment variables
│  └─ package.json
│
├─ mobile/
│  ├─ src/
│  │  ├─ screens/           # App screens (Login, Register, Dashboard, Booking)
│  │  ├─ components/        # Reusable UI components
│  │  ├─ navigation/        # Stack & tab navigation
│  │  ├─ services/          # API & backend communication
│  │  ├─ context/           # Auth & app state
│  │  ├─ utils/             # Helpers & constants
│  │  └─ chatbot/           # Chatbot UI & logic
│  ├─ assets/               # Images, icons, fonts
│  ├─ App.tsx               # Mobile app entry point
│  ├─ app.json              # Expo configuration
│  ├─ eas.json              # EAS build configuration
│  ├─ .env                  # Mobile environment variables
│  └─ package.json
│
├─ .env                     # Root environment variables (shared)
├─ package.json             # Root scripts & dependencies
└─ README.md                # Project documentation

# Setup and Installation

Clone the repository:

git clone https://github.com/Crown-Coders/smart-booking-system.git
cd smart-booking-system


### Install backend dependencies:

cd backend
npm install


### Install frontend dependencies:

cd frontend
npm install  

### Install mobile dependencies:

cd mobile
npm install


# Running Locally

#### Backend:

cd backend
npm start / npm server.js


#### Frontend:

cd frontend
npm run dev

#### Mobile : 

cd mobile 
npx expo -c

The frontend runs on http://localhost:5173 and communicates with the backend on http://localhost:5000.

The mobile runs on expo through npx expo -c and communicates with backend on http://localhost:5000.

# Deployment

Deploy backend on Render using Node.js environment.

Deploy frontend on Render using the production URL.

Ensure environment variables are set in the hosting dashboard.

Backend must use the PORT provided by Render.

## Production URLs:

Frontend: https://smart-booking-system-8cgy.onrender.com

Backend: https://smart-booking-system-backend-nxum.onrender.com

Mobile APK : https://expo.dev/accounts/phathisa/projects/mental-com-mobile/builds/bcb05a1f-cb1f-4443-b1fc-2cdbd77f8db2 

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

