const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { createGoal, getGoals, addToGoal, deleteGoal } = require('../controllers/savingsController');

// All routes require authentication
router.use(authenticateToken);

router.post('/', createGoal);
router.get('/', getGoals);
router.put('/:id/add', addToGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
