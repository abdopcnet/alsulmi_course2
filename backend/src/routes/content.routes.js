const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');

// Content routes (to be implemented)
router.get('/course/:courseId', authenticate, async (req, res) => {
  res.json({ message: 'Get course content endpoint - to be implemented' });
});

router.post('/', authenticate, async (req, res) => {
  res.json({ message: 'Create content endpoint - to be implemented' });
});

module.exports = router;
