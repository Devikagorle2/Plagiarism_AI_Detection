const express = require('express');
const router = express.Router();
const { register, login, getUserProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register - Register a new user
router.post('/register', register);

// POST /api/auth/login - Login with email and password
router.post('/login', login);

// GET /api/auth/profile - Get user profile (protected)
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;
