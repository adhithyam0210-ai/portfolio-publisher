const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Public route to view a published portfolio by slug
router.get('/portfolio/:slug', publicController.getPublicPortfolio);

module.exports = router;
