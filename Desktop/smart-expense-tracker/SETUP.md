# Smart Expense Tracker - Setup Guide

## Overview
A comprehensive expense tracking application with AI-powered spending insights for students.

## Features Implemented
- **User Authentication**: Google/Email login via Firebase
- **Expense Management**: Add, view, filter, and delete expenses
- **Budget Management**: Set monthly budgets with automatic alerts
- **Dashboard**: Visual analytics with charts and spending insights
- **AI Insights**: Gemini-powered spending pattern analysis
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Prerequisites
- Node.js 18+ 
- Firebase project with Authentication and Firestore enabled
- Google Gemini API key
- npm or yarn

## Setup Instructions

### 1. Firebase Configuration
1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication (Google and Email/Password providers)
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate a new private key and save the JSON file
6. Enable the Firestore API
7. Get your Firebase Web API Key from Project Settings > General

### 2. Environment Setup

#### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# Google Gemini AI API
GEMINI_API_KEY=your-gemini-api-key

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-firebase-web-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# API Configuration
REACT_APP_API_URL=http://localhost:5000
```

### 3. Gemini AI Setup
1. Get a Gemini API key from https://makersuite.google.com/app/apikey
2. Add it to your backend `.env` file as `GEMINI_API_KEY`

### 4. Start the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend will start on http://localhost:5000

#### Start Frontend
```bash
cd frontend
npm start
```
The frontend will start on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with Firebase ID token
- `GET /api/auth/profile` - Get user profile

### Expenses
- `POST /api/expenses` - Add new expense
- `GET /api/expenses` - Get expenses with filters
- `GET /api/expenses/dashboard` - Get dashboard data
- `DELETE /api/expenses/:id` - Delete expense

### Budget
- `POST /api/budget` - Set/update budget
- `GET /api/budget` - Get budget for month
- `GET /api/budget/alerts` - Get budget alerts

### AI Insights
- `GET /api/ai/insights` - Get AI spending insights
- `GET /api/ai/trends` - Get spending trends

## Application Structure

### Backend (Node.js + Express)
```
backend/
  src/
    controllers/     # API route handlers
    models/         # Data models (Expense, Budget, User)
    routes/         # API routes
    middleware/     # Auth, validation middleware
    config/         # Firebase, Gemini configuration
```

### Frontend (React + Tailwind)
```
frontend/
  src/
    components/     # Reusable UI components
    pages/         # Page components
    context/       # React context (Auth)
    utils/         # Firebase, API utilities
    hooks/         # Custom React hooks
```

## Usage Guide

1. **Login**: Use Google authentication to sign in
2. **Dashboard**: View spending overview, charts, and AI insights
3. **Expenses**: Add, view, and manage your expenses
4. **Analytics**: Deep dive into spending patterns and trends
5. **Settings**: Set budgets and manage preferences

## Features in Detail

### Dashboard
- Monthly spending summary
- Budget usage with alerts
- Category-wise spending pie chart
- 7-day spending trend line chart
- AI-powered insights and recommendations
- Recent expenses list

### Expense Management
- Add expenses with amount, category, description, and date
- Filter expenses by category and date range
- Delete expenses with confirmation
- Categories: Food, Travel, Shopping, Bills, Others

### Budget System
- Set monthly budgets
- Automatic alerts at 75%, 90%, and 100% usage
- Daily spending trend analysis
- Budget vs actual spending comparison

### AI Insights
- Personalized spending recommendations
- Category-wise spending analysis
- Trend identification and suggestions
- Practical money-saving tips

## Troubleshooting

### Common Issues
1. **Firebase Authentication Errors**: Check Firebase configuration and API keys
2. **CORS Issues**: Ensure frontend URL is in CORS allowed origins
3. **Gemini API Errors**: Verify API key and quota
4. **Database Connection**: Check Firebase Firestore rules and permissions

### Development Tips
- Use browser dev tools to debug API calls
- Check console for Firebase authentication errors
- Verify environment variables are properly set
- Test with small amounts first

## Deployment

### Backend Deployment
1. Set production environment variables
2. Use a process manager like PM2
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Update environment variables for production
4. Configure Firebase hosting if desired

## Security Considerations
- Environment variables should never be committed to git
- Use HTTPS in production
- Implement rate limiting on API endpoints
- Regularly update dependencies
- Validate all user inputs

## Support
For issues and questions:
1. Check the console for error messages
2. Verify all configuration steps
3. Ensure all required services are active
4. Test API endpoints individually

## Future Enhancements
- Expense categories customization
- Recurring expenses
- Export to CSV/PDF
- Multi-currency support
- Expense sharing between users
- Mobile app development
