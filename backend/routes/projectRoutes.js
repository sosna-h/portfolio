const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');

// @route   GET /api/projects
// @desc    Retrieve all portfolio projects with optional category and search filters
// @access  Public
router.get('/', projectsController.getAllProjects);

// @route   GET /api/projects/:slug
// @desc    Retrieve a single project by slug
// @access  Public
router.get('/:slug', projectsController.getProjectBySlug);

module.exports = router;
