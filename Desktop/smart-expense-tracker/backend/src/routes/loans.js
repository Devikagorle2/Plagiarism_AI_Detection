const express = require('express');
const router = express.Router();
const { createLoan, getLoans, getPendingLoans, makePayment, deleteLoan } = require('../controllers/loanController');
const { authenticateToken } = require('../middleware/auth');
const { sendReminder } = require('../utils/emailService');
const Loan = require('../models/Loan');
const User = require('../models/User');

// All loan routes require authentication
router.use(authenticateToken);

// POST /api/loans - Create a new loan
router.post('/', createLoan);

// GET /api/loans - Get all loans for user
router.get('/', getLoans);

// GET /api/loans/pending - Get pending loans
router.get('/pending', getPendingLoans);

// PUT /api/loans/:id/pay - Make a payment
router.put('/:id/pay', makePayment);

// DELETE /api/loans/:id - Delete a loan
router.delete('/:id', deleteLoan);

// POST /api/loans/:id/remind - Send manual reminder for a loan
router.post('/:id/remind', async (req, res) => {
  try {
    const { id } = req.params;
    const loan = Loan.findById(id);
    
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to send reminder for this loan' });
    }

    const user = await User.findById(loan.userId);
    const pendingAmount = loan.totalAmount - loan.paidAmount;

    const result = await sendReminder(
      user.email,
      `Payment Reminder: ${loan.name}`,
      `Dear ${user.name},\n\nThis is a reminder for your loan payment.\n\nLoan Details:\n- Name: ${loan.name}\n- Source: ${loan.source}\n- Purpose: ${loan.purpose}\n- Total Amount: $${loan.totalAmount}\n- Paid Amount: $${loan.paidAmount}\n- Pending Amount: $${pendingAmount}\n- Due Date: ${loan.dueDate || 'Not set'}\n\nPlease make your payment on time.\n\nBest regards,\nSmart Expense Tracker Team`
    );

    if (result.success) {
      res.json({ message: 'Reminder sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send reminder', details: result.error });
    }
  } catch (error) {
    console.error('Error sending manual reminder:', error);
    res.status(500).json({ error: 'Failed to send reminder' });
  }
});

module.exports = router;
