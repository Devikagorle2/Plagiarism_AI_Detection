const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { addAsset, addLiability, getNetWorth, deleteAsset, deleteLiability } = require('../controllers/networthController');

// All routes require authentication
router.use(authenticateToken);

router.post('/asset', addAsset);
router.post('/liability', addLiability);
router.get('/', getNetWorth);
router.delete('/asset/:id', deleteAsset);
router.delete('/liability/:id', deleteLiability);

module.exports = router;
