# Smart Expense Tracker - Mobile UI

A modern, professional mobile-first React UI for a fintech application with AI-powered insights.

## Features

### Pages

1. **Dashboard**
   - Personalized greeting based on time of day
   - Summary cards showing total spent and remaining budget
   - Budget progress bar with color-coded warnings
   - Category-wise spending pie chart
   - Spending trend line chart
   - AI insight cards with smart suggestions
   - Recent transactions list

2. **Add Expense**
   - Large amount input with currency symbol
   - Visual category selector with icons
   - Date picker
   - Optional notes field
   - Sticky bottom submit button

3. **History**
   - Filter chips by category
   - Date filter option
   - Grouped transactions by date
   - Clean list UI with right-aligned amounts

4. **Budget**
   - Editable monthly budget
   - Real-time budget status indicators
   - Progress bar with percentage
   - Warning alerts when usage > 80%
   - Category breakdown with visual bars
   - Daily average and days remaining stats

### Components

- **SummaryCard** - Reusable card for displaying summary metrics
- **ChartCard** - Container for chart components with header
- **AIInsightCard** - Highlighted card for AI-powered insights
- **TransactionItem** - Individual transaction display component
- **BottomNav** - Fixed bottom navigation with highlighted center button
- **CategorySelector** - Visual category selection grid

## Design System

### Color Palette
- Primary: #4F46E5 (indigo)
- Success: #22C55E (green)
- Danger: #EF4444 (red)
- Warning: #F59E0B (yellow)
- Background: #F9FAFB
- Card: #FFFFFF
- Text: #111827 (primary), #6B7280 (secondary)

### Typography
- Font: Inter or Poppins
- Large font for amounts (text-4xl, text-2xl)
- Medium for headings (text-lg, text-xl)
- Small for labels (text-sm)

### Styling
- Rounded corners: rounded-2xl
- Soft shadows: shadow-sm, shadow-md
- Smooth transitions: transition-all duration-300
- Hover effects: hover:scale-105, hover:shadow-md
- Mobile-first: max-w-md mx-auto container

## Tech Stack

- React (functional components)
- Tailwind CSS
- Recharts (for charts)
- React Router (for navigation)
- Heroicons (for icons)

## Installation

The mobile UI is located in:
- Components: `src/components/mobile/`
- Pages: `src/pages/mobile/`
- Data: `src/data/dummyData.js`

## Usage

To use the mobile UI, import the MobileApp component:

```jsx
import MobileApp from './pages/mobile/MobileApp';

function App() {
  return <MobileApp />;
}
```

## File Structure

```
src/
├── components/
│   └── mobile/
│       ├── SummaryCard.jsx
│       ├── ChartCard.jsx
│       ├── AIInsightCard.jsx
│       ├── TransactionItem.jsx
│       ├── BottomNav.jsx
│       └── CategorySelector.jsx
├── pages/
│   └── mobile/
│       ├── Dashboard.jsx
│       ├── AddExpense.jsx
│       ├── History.jsx
│       ├── Budget.jsx
│       ├── MobileApp.jsx
│       └── README.md
└── data/
    └── dummyData.js
```

## Customization

### Modify Colors
Update the color palette in the component files to match your brand.

### Add Categories
Add new categories to the `categoryIcons` and `categoryColors` objects in TransactionItem.jsx and CategorySelector.jsx.

### Update Dummy Data
Modify `src/data/dummyData.js` to use your own sample data.

## Responsive Design

The UI is designed mobile-first with:
- Max width container (max-w-md)
- Proper padding and spacing
- Flexible grid layouts
- Touch-friendly button sizes

## Animations

All interactive elements include:
- Smooth transitions (300ms duration)
- Hover scale effects
- Shadow changes on hover
- Active state feedback

## Future Enhancements

- Connect to real backend API
- Add user authentication
- Implement data persistence
- Add more chart types
- Include export functionality
- Add dark mode support

## Credits

Inspired by modern fintech apps like Walnut and CRED.
