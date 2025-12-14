const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');

// Payment routes (to be implemented)
router.post('/initiate', authenticate, async (req, res) => {
  res.json({ message: 'Initiate payment endpoint - to be implemented' });
});

router.post('/verify', authenticate, async (req, res) => {
  res.json({ message: 'Verify payment endpoint - to be implemented' });
});

module.exports = router;
