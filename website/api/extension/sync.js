/**
 * Extension Sync API
 * Receives stats and activity from Chrome extension
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { connectDatabase } = require('../../config/database');
const User = require('../../models/User');

const router = express.Router();

// JWT Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided'
      });
    }

    const token = authHeader.substring(7);

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    await connectDatabase();
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Extension sync auth error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

// POST /api/extension/sync - Receive extension stats
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      stats,
      monitors,
      lastActivity,
      riskLevel
    } = req.body;

    const user = req.user;

    // Update user's extension data
    if (!user.extensionData) {
      user.extensionData = {};
    }

    // Update stats
    if (stats) {
      user.extensionData.stats = {
        monitorsCount: stats.monitorsCount || 0,
        slotsFound: stats.slotsFound || 0,
        rebooksUsed: stats.rebooksUsed || 0,
        rebooksTotal: stats.rebooksTotal || 0,
        notificationsSent: stats.notificationsSent || 0,
        lastCheck: stats.lastCheck || new Date(),
        lastSync: new Date()
      };
    }

    // Update monitors
    if (monitors) {
      user.extensionData.monitors = monitors.map(m => ({
        testCentre: m.testCentre,
        active: m.active,
        lastSlotFound: m.lastSlotFound,
        slotsFoundThisWeek: m.slotsFoundThisWeek || 0
      }));
    }

    // Update risk level
    if (riskLevel) {
      user.extensionData.riskLevel = riskLevel;
    }

    // Save to database
    await user.save();

    console.log(`✅ Extension sync for user ${user.email}:`, {
      monitors: stats?.monitorsCount,
      rebooks: stats?.rebooksUsed,
      notifications: stats?.notificationsSent
    });

    res.status(200).json({
      success: true,
      message: 'Extension data synced successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Extension sync error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync extension data',
      message: error.message
    });
  }
});

// GET /api/extension/stats - Get extension stats for dashboard
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    const extensionData = user.extensionData || {};
    const stats = extensionData.stats || {};
    const monitors = extensionData.monitors || [];

    // Calculate derived metrics
    const successRate = stats.slotsFound > 0
      ? Math.round((stats.rebooksUsed / stats.slotsFound) * 100)
      : 0;

    const lastCheckTime = stats.lastCheck
      ? new Date(stats.lastCheck)
      : null;

    const minutesSinceLastCheck = lastCheckTime
      ? Math.floor((Date.now() - lastCheckTime.getTime()) / (1000 * 60))
      : null;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          monitorsCount: stats.monitorsCount || 0,
          slotsFound: stats.slotsFound || 0,
          rebooksUsed: stats.rebooksUsed || 0,
          rebooksRemaining: (stats.rebooksTotal || 0) - (stats.rebooksUsed || 0),
          notificationsSent: stats.notificationsSent || 0,
          successRate: successRate,
          lastCheck: stats.lastCheck,
          minutesSinceLastCheck: minutesSinceLastCheck,
          lastSync: stats.lastSync
        },
        monitors: monitors,
        riskLevel: extensionData.riskLevel || { level: 'low', percentage: 0 },
        extensionStatus: minutesSinceLastCheck < 10 ? 'active' : 'offline'
      }
    });

  } catch (error) {
    console.error('Get extension stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get extension stats'
    });
  }
});

module.exports = router;

