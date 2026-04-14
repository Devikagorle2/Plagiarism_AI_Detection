const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { createRecurring, getRecurring, deleteRecurring } = require('../controllers/recurringController');

// All routes require authentication
router.use(authenticateToken);

router.post('/', createRecurring);
router.get('/', getRecurring);
router.delete('/:id', deleteRecurring);

module.exports = router;
