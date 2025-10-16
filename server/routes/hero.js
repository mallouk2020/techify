/**
 * Hero Section Routes
 */

const express = require('express');
const router = express.Router();
const { getHero, updateHero, createHero } = require('../controllers/hero');

// Public route - Get hero section
router.get('/', getHero);

// Admin routes - Create/Update hero section
router.post('/', createHero);
router.put('/:id', updateHero);

module.exports = router;