const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Register extension installation
// @route   POST /api/extension/register
// @access  Private
router.post('/register', protect, async (req, res) => {
  res.json({
    success: true,
    message: 'Extension registration endpoint - implementation pending',
    data: {}
  });
});

// @desc    Get extension data for user
// @route   GET /api/extension/data
// @access  Private
router.get('/data', protect, async (req, res) => {
  res.json({
    success: true,
    message: 'Extension data endpoint - implementation pending',
    data: {
      extension: req.user.extension
    }
  });
});

// @desc    Update Twilio settings
// @route   PUT /api/extension/twilio-settings
// @access  Private
router.put('/twilio-settings', protect, async (req, res) => {
  res.json({
    success: true,
    message: 'Twilio settings endpoint - implementation pending',
    data: {}
  });
});

module.exports = router;