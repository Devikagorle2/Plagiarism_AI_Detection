const cron = require('node-cron');
const db = require('../config/mongodb');
const { sendReminder } = require('../utils/messaging');
const Loan = require('../models/Loan');
const RecurringExpense = require('../models/RecurringExpense');
const Expense = require('../models/Expense');
const User = require('../models/User');

const checkLoanDueDates = async () => {
  try {
    console.log('Running daily reminder check...');
    
    const dueLoans = Loan.getDueLoansToday();
    console.log(`Found ${dueLoans.length} loans due today`);
    
    for (const loan of dueLoans) {
      const pendingAmount = loan.totalAmount - loan.paidAmount;
      const user = User.findById(loan.userId);
      
      await sendReminder(
        user,
        user.reminderChannel,
        `🔔 Loan Due Today: ${loan.name}`,
        `Dear ${user.name},\n\nYour loan "${loan.name}" is due today.\nPending amount: $${pendingAmount}\nPurpose: ${loan.purpose}\nSource: ${loan.source}\n\nPlease make the payment as soon as possible.\n\nBest regards,\nExpense Tracker`
      );
      
      Loan.updateReminderSent(loan.id);
    }
    
  } catch (error) {
    console.error('Error in reminder job:', error);
  }
};

const processRecurringExpenses = async () => {
  try {
    console.log('Processing recurring expenses...');
    const due = RecurringExpense.getDueToday();
    console.log(`Found ${due.length} recurring expenses due today`);
    
    for (const rec of due) {
      Expense.create({
        userId: rec.userId,
        amount: rec.amount,
        category: rec.category,
        description: rec.description,
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString()
      });
      
      // Calculate next due date
      let next = new Date(rec.nextDue);
      if (rec.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
      else if (rec.frequency === 'weekly') next.setDate(next.getDate() + 7);
      else if (rec.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);
      RecurringExpense.updateNextDue(rec.id, next.toISOString().slice(0, 10));
    }
  } catch (error) {
    console.error('Error processing recurring expenses:', error);
  }
};

// Schedule the job to run daily at 8 AM
cron.schedule('0 8 * * *', () => {
  console.log('Running daily reminder check at 8 AM');
  checkLoanDueDates();
  processRecurringExpenses();
});

// Also run on startup for testing (comment out in production)
// checkLoanDueDates();
// processRecurringExpenses();

console.log('Reminder job scheduled to run daily at 8 AM');

module.exports = { checkLoanDueDates, processRecurringExpenses };
