const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');

// Subscription routes (to be implemented)
router.get('/', authenticate, async (req, res) => {
  res.json({ message: 'Get subscriptions endpoint - to be implemented' });
});

router.post('/', authenticate, async (req, res) => {
  res.json({ message: 'Create subscription endpoint - to be implemented' });
});

module.exports = router;
