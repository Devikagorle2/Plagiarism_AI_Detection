# Quick Start Guide

## Current Status
- Backend API: RUNNING on http://localhost:5000
- Frontend: Starting...

## Test the Backend API
Open your browser and go to: http://localhost:5000/health

You should see: `{"status":"OK","timestamp":"...","environment":"development"}`

## Setup Instructions

### 1. Environment Variables
Copy the example files:
```bash
# Backend
cd backend
copy env.example .env

# Frontend  
cd frontend
copy env.example .env
```

### 2. Firebase Setup
1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable Authentication (Google + Email/Password)
4. Enable Firestore Database
5. Get your credentials from Project Settings > Service Accounts
6. Update your .env files

### 3. Gemini AI Setup
1. Go to https://makersuite.google.com/app/apikey
2. Create an API key
3. Add to backend .env as GEMINI_API_KEY

### 4. Test the Application
Once both servers are running:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features Ready to Test
- User authentication (mock mode without Firebase)
- Add/view/delete expenses
- Budget management
- Dashboard with charts
- AI insights (mock mode without Gemini)

## Troubleshooting
- Backend issues: Check console logs
- Frontend issues: Check browser console
- Environment errors: Verify .env files are set
- Firebase errors: Check Firebase console settings
