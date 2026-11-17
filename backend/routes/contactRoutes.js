const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validateContactMessage } = require('../validators/contactValidator');

// @route   POST /api/contact
// @desc    Submit a new contact message
// @access  Public
router.post('/', validateContactMessage, contactController.createContactMessage);

// @route   GET /api/contact
// @desc    Get recent contact messages
// @access  Public
router.get('/', contactController.getContactMessages);

// @route   DELETE /api/contact/:id
// @desc    Delete a contact message by ID
// @access  Public
router.delete('/:id', contactController.deleteContactMessage);

// @route   DELETE /api/contact
// @desc    Clear all contact messages
// @access  Public
router.delete('/', contactController.clearAllContactMessages);

module.exports = router;

