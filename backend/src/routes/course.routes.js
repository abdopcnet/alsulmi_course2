const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Course routes (to be implemented)
router.get('/', optionalAuth, async (req, res) => {
  res.json({ message: 'Get all courses endpoint - to be implemented' });
});

router.get('/:id', optionalAuth, async (req, res) => {
  res.json({ message: 'Get course by ID endpoint - to be implemented' });
});

router.post('/', authenticate, async (req, res) => {
  res.json({ message: 'Create course endpoint - to be implemented' });
});

module.exports = router;
