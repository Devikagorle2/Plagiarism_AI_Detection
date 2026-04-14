const Loan = require('../models/Loan');
const User = require('../models/User');

const createLoan = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, source, purpose, totalAmount, dueDate } = req.body;

    if (!name || !source || !purpose || !totalAmount) {
      return res.status(400).json({ error: 'Name, source, purpose, and total amount are required' });
    }

    const loan = Loan.create({
      userId,
      name,
      source,
      purpose,
      totalAmount: parseFloat(totalAmount),
      paidAmount: 0,
      dueDate: dueDate || null
    });

    res.status(201).json({
      message: 'Loan created successfully',
      loan
    });
  } catch (error) {
    console.error('Create loan error:', error);
    res.status(500).json({ error: 'Failed to create loan' });
  }
};

const getLoans = async (req, res) => {
  try {
    const { userId } = req.user;
    const loans = Loan.findByUser(userId);
    res.json(loans);
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
};

const getPendingLoans = async (req, res) => {
  try {
    const { userId } = req.user;
    const loans = Loan.getPending(userId);
    res.json(loans);
  } catch (error) {
    console.error('Get pending loans error:', error);
    res.status(500).json({ error: 'Failed to fetch pending loans' });
  }
};

const makePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }

    const loan = Loan.findById(id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to make payment on this loan' });
    }

    Loan.updatePayment(id, parseFloat(amount));

    res.json({ message: 'Payment recorded successfully' });
  } catch (error) {
    console.error('Make payment error:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
};

const deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = Loan.findById(id);

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this loan' });
    }

    Loan.delete(id);

    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error('Delete loan error:', error);
    res.status(500).json({ error: 'Failed to delete loan' });
  }
};

module.exports = {
  createLoan,
  getLoans,
  getPendingLoans,
  makePayment,
  deleteLoan
};
