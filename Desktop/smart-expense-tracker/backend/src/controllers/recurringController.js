const RecurringExpense = require('../models/RecurringExpense');
const Expense = require('../models/Expense');

const createRecurring = async (req, res) => {
  try {
    RecurringExpense.create({ ...req.body, userId: req.user.id });
    res.json({ message: 'Created' });
  } catch (error) {
    console.error('Error creating recurring expense:', error);
    res.status(500).json({ error: 'Failed to create recurring expense' });
  }
};

const getRecurring = async (req, res) => {
  try {
    res.json(RecurringExpense.findByUser(req.user.id));
  } catch (error) {
    console.error('Error getting recurring expenses:', error);
    res.status(500).json({ error: 'Failed to get recurring expenses' });
  }
};

const deleteRecurring = async (req, res) => {
  try {
    RecurringExpense.delete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting recurring expense:', error);
    res.status(500).json({ error: 'Failed to delete recurring expense' });
  }
};

const processRecurringExpenses = async () => {
  try {
    const due = RecurringExpense.getDueToday();
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
    console.log(`Processed ${due.length} recurring expenses`);
  } catch (error) {
    console.error('Error processing recurring expenses:', error);
  }
};

module.exports = {
  createRecurring,
  getRecurring,
  deleteRecurring,
  processRecurringExpenses
};
