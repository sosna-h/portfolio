const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// @route   GET /api/stats
// @desc    Retrieve portfolio metrics and database connectivity status
// @access  Public
router.get('/', statsController.getStats);

module.exports = router;
