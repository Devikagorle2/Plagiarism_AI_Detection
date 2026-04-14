# Smart Expense Tracker with AI Insights

A comprehensive expense tracking application with AI-powered spending insights, featuring a professional authentication system and modern UI.

## 🎯 Features

1. **User Authentication**: Email/password registration and login with JWT tokens
2. **Expense Management**: Add daily expenses with categories (Food, Travel, Shopping, Bills, Savings, Entertainment, Health, Others)
3. **Budget with Category Allocation**: Set monthly budget allocations by category with progress tracking
4. **Dashboard**: Monthly summary with total spent, remaining budget, savings tracking, and category-wise progress bars
5. **Loan/EMI Tracker**: Track loans and EMIs with payment progress, due date reminders, and visual indicators
6. **Multi-Channel Reminders**: Automatic reminders via Email, SMS (Twilio), or WhatsApp based on user preference
7. **Net Worth Tracker**: Track assets and liabilities with timeline visualization and net worth calculation
8. **Savings Goals**: Create and track savings goals with progress bars and milestone tracking
9. **Recurring Expenses**: Set up recurring expenses with automatic processing (weekly, monthly, yearly)
10. **Receipt Scanner**: OCR-powered receipt scanning using Tesseract.js to auto-extract expense data
11. **Visual Analytics**: Pie charts for category-wise spending, line charts for trends
12. **Budget Management**: Set budgets with alerts when nearing limits
13. **Expense History**: Filterable history by date and category
14. **AI Insights**: AI analyzes spending patterns and provides personalized recommendations
15. **Multi-Currency Support**: Switch between USD, EUR, GBP, JPY, INR, CAD, AUD
16. **Reactive Mascot**: Animated mascot that changes mood based on spending percentage
17. **Dark Mode Support**: Full dark mode support across all pages
18. **Mobile-First UI**: Modern, professional mobile interface inspired by fintech apps
19. **Secure Authentication**: JWT-based authentication with password hashing

## 🛠 Tech Stack

### Frontend
- **React 18**: Modern JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Chart.js & Recharts**: Libraries for data visualization
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **React Hot Toast**: Toast notifications
- **Moment.js**: Date formatting and manipulation
- **Framer Motion**: Animation library for smooth transitions
- **Tesseract.js**: OCR library for receipt scanning
- **Lottie React**: For Lottie animations (placeholder for cartoon animations)

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **SQLite**: Lightweight, file-based database (no installation required)
- **better-sqlite3**: Synchronous SQLite driver for Node.js
- **JWT (jsonwebtoken)**: Token-based authentication
- **bcrypt**: Password hashing for security
- **CORS**: Cross-Origin Resource Sharing middleware
- **nodemailer**: Email sending for reminders
- **Twilio**: SMS and WhatsApp messaging
- **node-cron**: Scheduled tasks for daily reminders

### Architecture
- **REST API**: RESTful API design
- **JWT Authentication**: Secure token-based authentication
- **SQLite Database**: Local file-based database with SQL queries

## 📁 Project Structure

```
smart-expense-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── mongodb.js           # SQLite database configuration and initialization
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic (register, login, profile)
│   │   │   ├── expenseController.js # Expense CRUD operations
│   │   │   ├── budgetController.js  # Budget management
│   │   │   ├── budgetCategoryController.js # Category budget allocations
│   │   │   ├── loanController.js    # Loan/EMI tracker operations
│   │   │   ├── networthController.js # Net worth tracker operations
│   │   │   ├── savingsController.js # Savings goals operations
│   │   │   ├── recurringController.js # Recurring expenses operations
│   │   │   └── aiController.js      # AI insights generation
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT token verification middleware
│   │   ├── models/
│   │   │   ├── User.js              # User model with SQLite operations
│   │   │   ├── Expense.js           # Expense model with SQLite operations
│   │   │   ├── Budget.js            # Budget model with SQLite operations
│   │   │   ├── BudgetCategory.js    # Category budget model
│   │   │   ├── Loan.js              # Loan/EMI model
│   │   │   ├── Asset.js             # Asset model for net worth
│   │   │   ├── Liability.js         # Liability model for net worth
│   │   │   ├── SavingsGoal.js       # Savings goals model
│   │   │   └── RecurringExpense.js  # Recurring expenses model
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication routes
│   │   │   ├── expenses.js          # Expense routes
│   │   │   ├── budget.js            # Budget routes (includes category allocations)
│   │   │   ├── loans.js             # Loan/EMI routes
│   │   │   ├── networth.js          # Net worth tracker routes
│   │   │   ├── savings.js           # Savings goals routes
│   │   │   ├── recurring.js         # Recurring expenses routes
│   │   │   └── ai.js                # AI routes
│   │   ├── utils/
│   │   │   ├── emailService.js      # Email sending utility
│   │   │   └── messaging.js        # Multi-channel messaging (Email, SMS, WhatsApp)
│   │   ├── jobs/
│   │   │   └── reminderJob.js       # Scheduled loan reminder job
│   │   └── index.js                 # Backend entry point and server setup
│   ├── database.sqlite              # SQLite database file (auto-created)
│   ├── package.json                 # Backend dependencies
│   └── .env.example                 # Environment variables template
├── frontend/
│   ├── public/
│   │   └── index.html               # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx           # Main layout component with navigation
│   │   │   ├── DashboardCards.jsx   # Dashboard summary cards
│   │   │   ├── CategoryBudgetProgress.jsx # Category budget progress bars
│   │   │   ├── CartoonAnim.jsx      # Placeholder for Lottie animations
│   │   │   ├── Mascot.jsx           # Reactive mascot component
│   │   │   └── ReceiptScanner.jsx  # OCR receipt scanner component
│   │   │   └── mobile/              # Mobile-first UI components
│   │   │       ├── SummaryCard.jsx  # Dashboard summary card
│   │   │       ├── ChartCard.jsx    # Chart display card
│   │   │       ├── AIInsightCard.jsx # AI insights card
│   │   │       ├── TransactionItem.jsx # Individual expense item
│   │   │       ├── BottomNav.jsx    # Mobile bottom navigation
│   │   │       └── CategorySelector.jsx # Category selection
│   │   ├── context/
│   │   │   ├── AuthContext.js       # Authentication context and state management
│   │   │   └── ThemeContext.js      # Dark mode theme context
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Login page with email/password form
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── Dashboard.jsx        # Dashboard with charts and summary
│   │   │   ├── Expenses.jsx         # Expense management page
│   │   │   ├── BudgetSetup.jsx      # Category budget allocation page
│   │   │   ├── Loans.jsx            # Loan/EMI tracker page
│   │   │   ├── Analytics.jsx        # Analytics page with detailed charts
│   │   │   ├── Settings.jsx         # Settings page for currency and preferences
│   │   │   ├── NetWorth.jsx        # Net worth tracker page
│   │   │   ├── SavingsGoals.jsx    # Savings goals page
│   │   │   └── RecurringExpenses.jsx # Recurring expenses page
│   │   │   └── mobile/              # Mobile UI pages
│   │   │       ├── Dashboard.jsx    # Mobile dashboard
│   │   │       ├── AddExpense.jsx   # Add expense mobile page
│   │   │       ├── History.jsx      # Expense history mobile page
│   │   │       ├── Budget.jsx       # Budget management mobile page
│   │   │       └── MobileApp.jsx    # Mobile app wrapper
│   │   ├── utils/
│   │   │   ├── api.js               # API client with axios
│   │   │   ├── currency.js          # Currency formatting utilities
│   │   │   └── firebase.js          # (Deprecated - no longer used)
│   │   ├── data/
│   │   │   └── dummyData.js         # Sample data for mobile UI preview
│   │   ├── App.jsx                  # Main React app with routing
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global CSS styles
│   ├── package.json                 # Frontend dependencies
│   └── .env.example                 # Environment variables template
├── IMPLEMENTATION_SUMMARY.md        # Summary of new features implementation
├── index.html                       # (Deprecated - moved to frontend/public/)
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
- **npm**: Comes with Node.js
- **Git**: For cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-expense-tracker
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   **Backend (.env)**:
   ```env
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   NODE_ENV=development
   # Email Configuration (optional - for email reminders)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   # Twilio Configuration (optional - for SMS and WhatsApp reminders)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   TWILIO_WHATSAPP_NUMBER=+14155238886
   # Google Gemini AI (optional - for AI insights)
   GEMINI_API_KEY=your_gemini_api_key
   ```

   **Frontend (.env)**:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

5. **Start the development servers**

   **Backend (Terminal 1)**:
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on: http://localhost:5000

   **Frontend (Terminal 2)**:
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on: http://localhost:3000

## 🏗 How It Works

### Frontend Architecture (React)

#### HTML Structure
The HTML entry point is in `frontend/public/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Smart Expense Tracker</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```
- **root div**: Where React renders the entire application
- **viewport meta tag**: Ensures responsive design on mobile devices

#### CSS Styling (Tailwind CSS)
- **Utility-first approach**: CSS classes are applied directly in JSX
- **Responsive design**: Mobile-first breakpoints (sm, md, lg, xl)
- **Custom colors**: Primary color scheme defined in Tailwind config
- **Global styles**: Additional styles in `frontend/src/index.css`

Example styling:
```jsx
<div className="bg-white rounded-lg shadow-md p-6">
  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
</div>
```

#### JavaScript/React Components

**1. App.jsx - Main Application**
- Sets up React Router for navigation
- Configures AuthProvider for authentication state
- Defines protected routes (require login) and public routes
- Handles route redirects based on authentication status

**2. AuthContext.js - Authentication State**
- Manages user authentication state globally
- Stores JWT token in localStorage
- Provides login, logout, and authentication status to all components
- Handles token persistence across page refreshes

**3. Pages**

**Login.jsx**:
- Email/password form for user authentication
- Calls backend `/api/auth/login` endpoint
- Stores JWT token and user data on successful login
- Redirects to dashboard after successful login

**Register.jsx**:
- Registration form with name, email, password, confirm password
- Validates password match and minimum length
- Calls backend `/api/auth/register` endpoint
- Auto-logs in user after successful registration

**Dashboard.jsx**:
- Displays monthly spending summary
- Shows pie chart for category breakdown
- Displays recent expenses
- Shows budget usage percentage
- Fetches data from `/api/expenses/dashboard`

**Expenses.jsx**:
- Lists all user expenses
- Filters by date range and category
- Add new expense form
- Delete expense functionality
- Pagination support

**Analytics.jsx**:
- Detailed spending analytics
- Line charts for spending trends
- Category comparison charts
- Time-based analysis (weekly, monthly)

**Settings.jsx**:
- Currency selection (USD, EUR, GBP, JPY, INR, CAD, AUD)
- User profile information
- Logout functionality

**4. Components**

**Layout.jsx**:
- Main application shell
- Navigation sidebar (desktop) or bottom nav (mobile)
- Header with user info
- Outlet for page content

**Mobile Components**:
- **SummaryCard.jsx**: Displays total spent, budget, and remaining
- **ChartCard.jsx**: Wrapper for chart components
- **AIInsightCard.jsx**: Displays AI-generated insights
- **TransactionItem.jsx**: Individual expense list item
- **BottomNav.jsx**: Mobile bottom navigation bar
- **CategorySelector.jsx**: Category selection for expenses

**5. Utils**

**api.js**:
- Axios instance configured with base URL
- Request interceptor: Adds JWT token to Authorization header
- Response interceptor: Handles 401 errors (auto-logout)
- API methods:
  - `authAPI.login(email, password)` - Login
  - `authAPI.register(email, password, name)` - Register
  - `authAPI.getProfile()` - Get user profile
  - `expensesAPI.addExpense()` - Add expense
  - `expensesAPI.getExpenses()` - Get expenses
  - `expensesAPI.getDashboardData()` - Get dashboard data
  - `expensesAPI.deleteExpense()` - Delete expense
  - `budgetAPI.setBudget()` - Set budget
  - `budgetAPI.getBudget()` - Get budget
  - `budgetAPI.getBudgetAlerts()` - Get budget alerts
  - `aiAPI.getInsights()` - Get AI insights
  - `aiAPI.getSpendingTrends()` - Get spending trends

**currency.js**:
- Currency conversion rates
- Currency formatting functions
- Symbol mapping for different currencies

### Backend Architecture (Node.js + Express)

#### Server Setup (index.js)
```javascript
- Express app initialization
- CORS configuration
- JSON body parser
- Route registration
- Error handling middleware
- Server startup on port 5000
- Health check endpoint: GET /health
```

#### Database (SQLite)
- **File-based**: `database.sqlite` in backend directory
- **Tables**: users, expenses, budgets
- **No installation required**: Uses better-sqlite3 package
- **Synchronous operations**: Better performance for simple queries

**Database Schema**:

**users table**:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  lastLoginAt TEXT,
  phone TEXT,
  whatsapp TEXT,
  reminderChannel TEXT DEFAULT 'email'
)
```

**expenses table**:
```sql
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
)
```

**budgets table**:
```sql
CREATE TABLE budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  month TEXT NOT NULL,
  monthlyBudget REAL NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  UNIQUE(userId, month)
)
```

**budget_categories table**:
```sql
CREATE TABLE budget_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  month TEXT NOT NULL,
  category TEXT NOT NULL,
  allocated REAL NOT NULL,
  spent REAL DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id),
  UNIQUE(userId, month, category)
)
```

**loans table**:
```sql
CREATE TABLE loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  name TEXT NOT NULL,
  source TEXT NOT NULL,
  purpose TEXT NOT NULL,
  totalAmount REAL NOT NULL,
  paidAmount REAL DEFAULT 0,
  dueDate TEXT,
  reminderSent INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
)
```

**assets table**:
```sql
CREATE TABLE assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  value REAL NOT NULL,
  date TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
)
```

**liabilities table**:
```sql
CREATE TABLE liabilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  value REAL NOT NULL,
  date TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
)
```

**savings_goals table**:
```sql
CREATE TABLE savings_goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  name TEXT NOT NULL,
  target REAL NOT NULL,
  current REAL DEFAULT 0,
  deadline TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
)
```

**recurring_expenses table**:
```sql
CREATE TABLE recurring_expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  frequency TEXT,
  nextDue TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
)
```

#### Models

**User.js**:
- Class-based model with static methods
- `create(data)` - Insert new user
- `findByEmail(email)` - Find user by email
- `findById(id)` - Find user by ID
- `updateLastLogin(id)` - Update last login timestamp
- Password hashing with bcrypt

**Expense.js**:
- Class-based model with static methods
- `create(data)` - Insert new expense
- `find(query)` - Find expenses with filters
- `findById(id)` - Find expense by ID
- `findByIdAndDelete(id)` - Delete expense by ID
- `countDocuments(query)` - Count expenses with filters

**Budget.js**:
- Class-based model with static methods
- `create(data)` - Insert new budget
- `findOne(query)` - Find budget by user and month
- `update(query, data)` - Update existing budget
- `find(query)` - Find budgets with filters

**BudgetCategory.js**:
- Class-based model with static methods
- `setAllocation(userId, month, category, allocated)` - Set or update category allocation
- `getByUserAndMonth(userId, month)` - Get all categories for user/month
- `updateSpent(userId, month, category, spentDelta)` - Update spent amount
- `deleteByUserAndMonth(userId, month)` - Delete all categories for user/month
- `getTotalBudget(userId, month)` - Get total budget for user/month
- `getSavingsRemaining(userId, month)` - Get remaining savings for user/month

**Loan.js**:
- Class-based model with static methods
- `create(loan)` - Create new loan
- `findByUser(userId)` - Get all loans for user
- `findById(id)` - Get loan by ID
- `updatePayment(id, amount)` - Update paid amount
- `delete(id)` - Delete loan
- `updateReminderSent(id)` - Mark reminder as sent
- `getPending(userId)` - Get pending loans
- `getDueLoansToday()` - Get loans due today with user details

**Asset.js**:
- Class-based model with static methods
- `create(asset)` - Create new asset
- `findByUser(userId)` - Get all assets for user
- `delete(id)` - Delete asset
- `getTimeline(userId)` - Get asset timeline for charts

**Liability.js**:
- Class-based model with static methods
- `create(liability)` - Create new liability
- `findByUser(userId)` - Get all liabilities for user
- `delete(id)` - Delete liability
- `getTimeline(userId)` - Get liability timeline for charts

**SavingsGoal.js**:
- Class-based model with static methods
- `create(goal)` - Create new savings goal
- `findByUser(userId)` - Get all goals for user
- `updateCurrent(id, amount)` - Add to goal
- `delete(id)` - Delete goal

**RecurringExpense.js**:
- Class-based model with static methods
- `create(recurring)` - Create new recurring expense
- `findByUser(userId)` - Get all recurring expenses for user
- `delete(id)` - Delete recurring expense
- `getDueToday()` - Get recurring expenses due today
- `updateNextDue(id, nextDue)` - Update next due date

#### Controllers

**authController.js**:
- `register(email, password, name)` - Register new user
  - Validates input
  - Hashes password with bcrypt
  - Creates user in database
  - Generates JWT token
  - Returns user data and token
- `login(email, password)` - Login user
  - Finds user by email
  - Compares password hash
  - Generates JWT token
  - Updates last login
  - Returns user data and token
- `getProfile(userId)` - Get user profile

**expenseController.js**:
- `addExpense(req, res)` - Add new expense
  - Validates expense data
  - Creates expense record
  - Returns expense with ID
- `getExpenses(req, res)` - Get expenses with filters
  - Supports date range filtering
  - Supports category filtering
  - Supports pagination
  - Sorts by date descending
- `getDashboardData(req, res)` - Get dashboard summary
  - Calculates total spent
  - Calculates category breakdown
  - Gets user's budget
  - Calculates remaining budget
  - Gets last 7 days trend data
- `deleteExpense(req, res)` - Delete expense
  - Verifies ownership
  - Deletes expense

**budgetController.js**:
- `setBudget(req, res)` - Set monthly budget
  - Checks if budget exists for month
  - Creates or updates budget
- `getBudget(req, res)` - Get user's budget
- `getBudgetAlerts(req, res)` - Get budget alerts

**budgetCategoryController.js**:
- `setCategoryAllocation(req, res)` - Set category budget allocation
- `getCategoryAllocations(req, res)` - Get category allocations for a month
- `getDashboardBudgetData(req, res)` - Get dashboard budget data with savings

**loanController.js**:
- `createLoan(req, res)` - Create new loan
- `getLoans(req, res)` - Get all loans for user
- `makePayment(req, res)` - Record payment on a loan
- `deleteLoan(req, res)` - Delete a loan
- `sendManualReminder(req, res)` - Send manual email reminder

**aiController.js**:
- `getInsights(req, res)` - Get AI spending insights
- `getSpendingTrends(req, res)` - Get spending trends

**networthController.js**:
- `addAsset(req, res)` - Add new asset
- `addLiability(req, res)` - Add new liability
- `getNetWorth(req, res)` - Get net worth with timeline
- `deleteAsset(req, res)` - Delete asset
- `deleteLiability(req, res)` - Delete liability

**savingsController.js**:
- `createGoal(req, res)` - Create new savings goal
- `getGoals(req, res)` - Get all savings goals
- `addToGoal(req, res)` - Add amount to goal
- `deleteGoal(req, res)` - Delete savings goal

**recurringController.js**:
- `createRecurring(req, res)` - Create new recurring expense
- `getRecurring(req, res)` - Get all recurring expenses
- `deleteRecurring(req, res)` - Delete recurring expense
- `processRecurringExpenses()` - Process recurring expenses (called by cron)

#### Middleware

**auth.js**:
- JWT token verification
- Extracts token from Authorization header
- Verifies token with JWT secret
- Decodes user ID from token
- Attaches user info to request object
- Returns 401 if token is invalid or missing

#### Routes

**auth.js**:
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile (protected)

**expenses.js**:
- POST `/api/expenses` - Add expense (protected)
- GET `/api/expenses` - Get expenses (protected)
- GET `/api/expenses/dashboard` - Get dashboard data (protected)
- DELETE `/api/expenses/:id` - Delete expense (protected)

**budget.js**:
- POST `/api/budget` - Set budget (protected)
- GET `/api/budget` - Get budget (protected)
- GET `/api/budget/alerts` - Get budget alerts (protected)
- PUT `/api/budget/category` - Set category allocation (protected)
- GET `/api/budget/category` - Get category allocations (protected)
- GET `/api/budget/dashboard-budget` - Get dashboard budget data (protected)

**loans.js**:
- POST `/api/loans` - Create loan (protected)
- GET `/api/loans` - Get all loans (protected)
- PUT `/api/loans/:id/pay` - Make payment on loan (protected)
- DELETE `/api/loans/:id` - Delete loan (protected)
- POST `/api/loans/:id/remind` - Send manual reminder (protected)

**ai.js**:
- GET `/api/ai/insights` - Get AI insights (protected)
- GET `/api/ai/trends` - Get spending trends (protected)

**networth.js**:
- POST `/api/networth/asset` - Add asset (protected)
- POST `/api/networth/liability` - Add liability (protected)
- GET `/api/networth` - Get net worth data (protected)
- DELETE `/api/networth/asset/:id` - Delete asset (protected)
- DELETE `/api/networth/liability/:id` - Delete liability (protected)

**savings.js**:
- POST `/api/savings` - Create savings goal (protected)
- GET `/api/savings` - Get savings goals (protected)
- PUT `/api/savings/:id/add` - Add to savings goal (protected)
- DELETE `/api/savings/:id` - Delete savings goal (protected)

**recurring.js**:
- POST `/api/recurring` - Create recurring expense (protected)
- GET `/api/recurring` - Get recurring expenses (protected)
- DELETE `/api/recurring/:id` - Delete recurring expense (protected)

### Authentication Flow

**Registration**:
1. User fills registration form (name, email, password)
2. Frontend sends POST to `/api/auth/register`
3. Backend validates input
4. Backend hashes password with bcrypt
5. Backend creates user in SQLite database
6. Backend generates JWT token (valid for 7 days)
7. Backend returns user data and token
8. Frontend stores user data and token in localStorage
9. Frontend redirects to dashboard

**Login**:
1. User fills login form (email, password)
2. Frontend sends POST to `/api/auth/login`
3. Backend finds user by email
4. Backend compares password hash with bcrypt
5. Backend generates JWT token
6. Backend updates last login timestamp
7. Backend returns user data and token
8. Frontend stores user data and token in localStorage
9. Frontend redirects to dashboard

**Protected API Calls**:
1. Frontend retrieves token from localStorage
2. Frontend adds token to Authorization header: `Bearer <token>`
3. Backend middleware extracts token from header
4. Backend verifies token with JWT secret
5. Backend decodes user ID from token
6. Backend processes request with user context
7. Backend returns data to frontend

**Logout**:
1. User clicks logout button
2. Frontend removes user data and token from localStorage
3. Frontend redirects to login page
4. AuthContext updates authentication state

## 📊 API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLoginAt": "2024-01-02T00:00:00.000Z"
}
```

### Expense Endpoints

#### POST /api/expenses
Add a new expense (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 50.00,
  "category": "Food",
  "description": "Lunch",
  "date": "2024-01-01"
}
```

**Response:**
```json
{
  "message": "Expense added successfully",
  "expense": {
    "id": 1,
    "userId": 1,
    "amount": 50.00,
    "category": "Food",
    "description": "Lunch",
    "date": "2024-01-01",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/expenses
Get user expenses with filters (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): Filter expenses from this date
- `endDate` (optional): Filter expenses until this date
- `category` (optional): Filter by category
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "expenses": [
    {
      "id": 1,
      "userId": 1,
      "amount": 50.00,
      "category": "Food",
      "description": "Lunch",
      "date": "2024-01-01",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "hasMore": false
}
```

#### GET /api/expenses/dashboard
Get dashboard data (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "summary": {
    "totalSpent": 1500.00,
    "budget": 2000.00,
    "remainingBudget": 500.00,
    "budgetUsagePercentage": 75.0
  },
  "categoryBreakdown": {
    "Food": 500.00,
    "Travel": 300.00,
    "Shopping": 400.00,
    "Bills": 300.00
  },
  "last7Days": [
    {
      "date": "2024-01-01",
      "amount": 100.00,
      "count": 2
    }
  ],
  "recentExpenses": [...],
  "totalExpenses": 15
}
```

#### DELETE /api/expenses/:id
Delete an expense (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Expense deleted successfully"
}
```

### Budget Endpoints

#### POST /api/budget
Set monthly budget (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "month": "2024-01",
  "monthlyBudget": 2000.00
}
```

**Response:**
```json
{
  "message": "Budget set successfully",
  "budget": {
    "id": 1,
    "userId": 1,
    "month": "2024-01",
    "monthlyBudget": 2000.00
  }
}
```

#### GET /api/budget
Get user's budget (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `month` (optional): Get budget for specific month

**Response:**
```json
{
  "budget": {
    "id": 1,
    "userId": 1,
    "month": "2024-01",
    "monthlyBudget": 2000.00,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/budget/alerts
Get budget alerts (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "alerts": [
    {
      "type": "warning",
      "message": "You've used 75% of your monthly budget",
      "percentage": 75.0
    }
  ]
}
```

#### PUT /api/budget/category
Set category budget allocation (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "month": "2024-01",
  "category": "Food",
  "allocated": 500.00
}
```

**Response:**
```json
{
  "message": "Category allocation set successfully"
}
```

#### GET /api/budget/category
Get category allocations for a month (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `month` (required): Get allocations for specific month (format: YYYY-MM)

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "month": "2024-01",
    "category": "Food",
    "allocated": 500.00,
    "spent": 250.00
  }
]
```

#### GET /api/budget/dashboard-budget
Get dashboard budget data with savings (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "categories": [...],
  "totalBudget": 2000.00,
  "totalSpent": 750.00,
  "savingsRemaining": 200.00,
  "month": "2024-01"
}
```

### Loan Endpoints

#### POST /api/loans
Create a new loan (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Car Loan",
  "source": "Bank",
  "purpose": "Vehicle purchase",
  "totalAmount": 20000.00,
  "paidAmount": 5000.00,
  "dueDate": "2024-12-31"
}
```

**Response:**
```json
{
  "id": 1,
  "message": "Loan added successfully"
}
```

#### GET /api/loans
Get all loans for user (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "Car Loan",
    "source": "Bank",
    "purpose": "Vehicle purchase",
    "totalAmount": 20000.00,
    "paidAmount": 5000.00,
    "dueDate": "2024-12-31",
    "reminderSent": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### PUT /api/loans/:id/pay
Make a payment on a loan (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 500.00
}
```

**Response:**
```json
{
  "message": "Payment recorded successfully"
}
```

#### DELETE /api/loans/:id
Delete a loan (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Loan deleted successfully"
}
```

#### POST /api/loans/:id/remind
Send manual email reminder for a loan (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Reminder sent to email"
}
```

### AI Endpoints

#### GET /api/ai/insights
Get AI spending insights (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "insights": [
    {
      "category": "Food",
      "recommendation": "Consider meal prepping to reduce food expenses"
    }
  ]
}
```

#### GET /api/ai/trends
Get spending trends (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `months` (optional): Number of months to analyze (default: 3)

**Response:**
```json
{
  "trends": [
    {
      "month": "2024-01",
      "totalSpent": 1500.00,
      "categoryBreakdown": {...}
    }
  ]
}
```

### Net Worth Endpoints

#### POST /api/networth/asset
Add a new asset (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Savings Account",
  "type": "Cash",
  "value": 5000.00,
  "date": "2024-01-01"
}
```

**Response:**
```json
{
  "message": "Asset added"
}
```

#### POST /api/networth/liability
Add a new liability (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Credit Card",
  "type": "Loan",
  "value": 2000.00,
  "date": "2024-01-01"
}
```

**Response:**
```json
{
  "message": "Liability added"
}
```

#### GET /api/networth
Get net worth data (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "assets": [...],
  "liabilities": [...],
  "totalAssets": 5000.00,
  "totalLiabilities": 2000.00,
  "netWorth": 3000.00,
  "timeline": [...]
}
```

#### DELETE /api/networth/asset/:id
Delete an asset (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Asset deleted"
}
```

#### DELETE /api/networth/liability/:id
Delete a liability (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Liability deleted"
}
```

### Savings Goals Endpoints

#### POST /api/savings
Create a new savings goal (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Emergency Fund",
  "target": 10000.00,
  "current": 0,
  "deadline": "2024-12-31"
}
```

**Response:**
```json
{
  "message": "Goal created"
}
```

#### GET /api/savings
Get all savings goals (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Emergency Fund",
    "target": 10000.00,
    "current": 2500.00,
    "deadline": "2024-12-31"
  }
]
```

#### PUT /api/savings/:id/add
Add amount to a savings goal (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 500.00
}
```

**Response:**
```json
{
  "message": "Added to goal"
}
```

#### DELETE /api/savings/:id
Delete a savings goal (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Goal deleted"
}
```

### Recurring Expenses Endpoints

#### POST /api/recurring
Create a new recurring expense (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 50.00,
  "category": "Bills",
  "description": "Netflix subscription",
  "frequency": "monthly",
  "nextDue": "2024-01-01"
}
```

**Response:**
```json
{
  "message": "Created"
}
```

#### GET /api/recurring
Get all recurring expenses (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "amount": 50.00,
    "category": "Bills",
    "description": "Netflix subscription",
    "frequency": "monthly",
    "nextDue": "2024-01-01"
  }
]
```

#### DELETE /api/recurring/:id
Delete a recurring expense (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Deleted"
}
```

## 💡 How to Use the Application

### 1. Registration
1. Navigate to http://localhost:3000/register
2. Enter your name, email, and password
3. Click "Create account"
4. You'll be automatically logged in and redirected to the dashboard

### 2. Login
1. Navigate to http://localhost:3000/login
2. Enter your email and password
3. Click "Sign in"
4. You'll be redirected to the dashboard

### 3. Adding Expenses
1. From the dashboard, click "Add Expense"
2. Enter amount, category, description, and date
3. Click "Add Expense" to save
4. The expense will appear in your dashboard and expense history

### 4. Setting Budget
1. Navigate to the "Budget Setup" page
2. Set your monthly budget amount
3. Allocate budget to specific categories
4. View progress bars for each category

### 5. Tracking Loans
1. Navigate to the "Loans" page
2. Add a new loan with name, source, purpose, total amount, and due date
3. Track payments by adding payment amounts
4. View payment progress with visual indicators
5. Receive automatic reminders (email/SMS/WhatsApp) when loans are due

### 6. Net Worth Tracker
1. Navigate to the "Net Worth" page
2. Add assets (savings accounts, investments, property, etc.)
3. Add liabilities (loans, credit cards, mortgages, etc.)
4. View net worth calculation and timeline chart
5. Track your financial progress over time

### 7. Savings Goals
1. Navigate to the "Savings Goals" page
2. Create a new savings goal with name, target amount, and deadline
3. Add money to your goals over time
4. Track progress with visual progress bars
5. View piggy bank animation for motivation

### 8. Recurring Expenses
1. Navigate to the "Recurring Expenses" page
2. Add recurring expenses (subscriptions, bills, etc.)
3. Set frequency (weekly, monthly, yearly)
4. Expenses will be automatically processed on due dates
5. View and manage all recurring expenses

### 9. Receipt Scanner
1. In the Expenses page, use the Receipt Scanner component
2. Upload a receipt image
3. OCR will automatically extract amount, date, and category
4. Review and save the extracted expense data

### 10. Settings
1. Navigate to the "Settings" page
2. Set your preferred currency
3. Configure messaging preferences (phone, WhatsApp, reminder channel)
4. Toggle dark mode
5. View your profile information

### 11. Viewing Analytics
1. Navigate to the Analytics page
2. View pie charts for category breakdown
3. View line charts for spending trends
4. Analyze your spending patterns

### 12. Logout
1. Click on your profile in the navigation
2. Click "Logout"
3. You'll be redirected to the login page

## 🔐 Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **JWT Authentication**: Secure token-based authentication
3. **Token Expiration**: JWT tokens expire after 7 days
4. **Protected Routes**: All API endpoints (except register/login) require authentication
5. **CORS Configuration**: Only allows requests from configured origins
6. **SQL Injection Prevention**: Parameterized queries in SQLite operations
7. **Input Validation**: All inputs are validated before processing

## 📱 Mobile Responsiveness

The application is designed with a mobile-first approach:
- Responsive design using Tailwind CSS breakpoints
- Mobile-specific UI components in `frontend/src/components/mobile/`
- Bottom navigation for mobile users
- Touch-friendly buttons and inputs
- Optimized charts for mobile screens
- Mobile-specific pages for better UX

## 🎨 UI/UX Features

1. **Modern Design**: Clean, professional interface inspired by fintech apps
2. **Dark Mode Support**: (Can be added with Tailwind dark mode)
3. **Smooth Animations**: CSS transitions for better user experience
4. **Toast Notifications**: Feedback for user actions
5. **Loading States**: Visual feedback during data fetching
6. **Error Handling**: User-friendly error messages
7. **Empty States**: Helpful messages when no data is available

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Database errors:**
- Delete `backend/database.sqlite` to reset the database
- The database will be recreated on server restart

### Frontend Issues

**CORS errors:**
- Ensure backend is running on port 5000
- Check CORS configuration in backend

**Build errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Authentication Issues

**Token expired:**
- You'll be automatically redirected to login
- Login again to get a new token

**Invalid credentials:**
- Check email and password
- Ensure user is registered

## 📝 Development Notes

### Adding New Features

**Frontend:**
1. Create new component in `frontend/src/components/`
2. Add route in `frontend/src/App.jsx`
3. Add API method in `frontend/src/utils/api.js`
4. Style with Tailwind CSS classes

**Backend:**
1. Create controller in `backend/src/controllers/`
2. Create model in `backend/src/models/`
3. Add routes in `backend/src/routes/`
4. Register routes in `backend/src/index.js`

### Database Migrations

Since SQLite is file-based:
- To add columns: Delete `database.sqlite` and restart server
- The database will be recreated with new schema
- **Warning**: This will delete all data

### Environment Variables

Never commit `.env` files. Use `.env.example` as a template:
```bash
cp .env.example .env
# Edit .env with your values
```

## 🚢 Deployment

### Backend Deployment

**Options:**
- Heroku
- Railway
- Render
- DigitalOcean
- AWS EC2

**Steps:**
1. Set environment variables on hosting platform
2. Deploy backend code
3. Ensure `database.sqlite` is in a persistent storage
4. Set up SSL/HTTPS

### Frontend Deployment

**Options:**
- Vercel
- Netlify
- GitHub Pages
- AWS S3

**Steps:**
1. Set `REACT_APP_API_URL` to production backend URL
2. Build the frontend: `npm run build`
3. Deploy the `build` folder
4. Configure routing for SPA (Single Page Application)

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

This is a student project. Feel free to fork and modify for your own use.

## 📧 Support

For issues or questions, please refer to the troubleshooting section or contact the project maintainers.
