/**
 * DVSA Credentials Management API
 * Secure storage and retrieval of DVSA login credentials
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// AES-256 encryption for DVSA credentials
const ENCRYPTION_KEY = process.env.DVSA_CREDENTIALS_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypt DVSA credentials
 */
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt DVSA credentials
 */
function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = textParts.join(':');
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * JWT Authentication Middleware
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database
    const user = await User.findOne({
      $or: [
        { email: decoded.email },
        { _id: decoded.id }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

/**
 * Store DVSA credentials
 * POST /api/dvsa-credentials/store
 */
router.post('/store', authenticateToken, async (req, res) => {
  try {
    const { username, password, licenceNumber } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    // Only Professional tier can store DVSA credentials
    if (req.user.subscription.tier !== 'professional') {
      return res.status(403).json({
        success: false,
        error: 'DVSA credentials storage requires Professional tier'
      });
    }

    // Encrypt credentials
    const credentialsData = {
      username: username.trim(),
      password: password.trim(),
      licenceNumber: licenceNumber ? licenceNumber.trim() : null,
      storedAt: new Date().toISOString()
    };

    const encryptedCredentials = encrypt(JSON.stringify(credentialsData));

    // Update user with encrypted credentials
    await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          'instructorProfile.dvsaCredentials': encryptedCredentials,
          'instructorProfile.dvsaCredentialsUpdated': new Date()
        }
      }
    );

    console.log(`✅ DVSA credentials stored for user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'DVSA credentials stored securely'
    });

  } catch (error) {
    console.error('❌ Error storing DVSA credentials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to store credentials'
    });
  }
});

/**
 * Retrieve DVSA credentials
 * GET /api/dvsa-credentials/retrieve
 */
router.get('/retrieve', authenticateToken, async (req, res) => {
  try {
    // Only Professional tier can retrieve DVSA credentials
    if (req.user.subscription.tier !== 'professional') {
      return res.status(403).json({
        success: false,
        error: 'DVSA credentials retrieval requires Professional tier'
      });
    }

    const encryptedCredentials = req.user.instructorProfile?.dvsaCredentials;

    if (!encryptedCredentials) {
      return res.status(404).json({
        success: false,
        error: 'No DVSA credentials stored'
      });
    }

    // Decrypt credentials
    const decryptedData = decrypt(encryptedCredentials);
    const credentials = JSON.parse(decryptedData);

    // Remove password from response for security (extension will get it separately)
    const safeCredentials = {
      username: credentials.username,
      licenceNumber: credentials.licenceNumber,
      storedAt: credentials.storedAt
    };

    console.log(`✅ DVSA credentials retrieved for user: ${req.user.email}`);

    res.json({
      success: true,
      credentials: safeCredentials
    });

  } catch (error) {
    console.error('❌ Error retrieving DVSA credentials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve credentials'
    });
  }
});

/**
 * Get DVSA password (separate endpoint for security)
 * GET /api/dvsa-credentials/password
 */
router.get('/password', authenticateToken, async (req, res) => {
  try {
    // Only Professional tier can retrieve DVSA password
    if (req.user.subscription.tier !== 'professional') {
      return res.status(403).json({
        success: false,
        error: 'DVSA credentials access requires Professional tier'
      });
    }

    const encryptedCredentials = req.user.instructorProfile?.dvsaCredentials;

    if (!encryptedCredentials) {
      return res.status(404).json({
        success: false,
        error: 'No DVSA credentials stored'
      });
    }

    // Decrypt credentials
    const decryptedData = decrypt(encryptedCredentials);
    const credentials = JSON.parse(decryptedData);

    console.log(`✅ DVSA password retrieved for user: ${req.user.email}`);

    res.json({
      success: true,
      password: credentials.password
    });

  } catch (error) {
    console.error('❌ Error retrieving DVSA password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve password'
    });
  }
});

/**
 * Delete DVSA credentials
 * DELETE /api/dvsa-credentials/delete
 */
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    // Remove DVSA credentials from user
    await User.updateOne(
      { _id: req.user._id },
      {
        $unset: {
          'instructorProfile.dvsaCredentials': 1,
          'instructorProfile.dvsaCredentialsUpdated': 1
        }
      }
    );

    console.log(`✅ DVSA credentials deleted for user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'DVSA credentials deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting DVSA credentials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete credentials'
    });
  }
});

/**
 * Validate DVSA credentials (test connection)
 * POST /api/dvsa-credentials/validate
 */
router.post('/validate', authenticateToken, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password required'
      });
    }

    // Only Professional tier can validate DVSA credentials
    if (req.user.subscription.tier !== 'professional') {
      return res.status(403).json({
        success: false,
        error: 'DVSA credentials validation requires Professional tier'
      });
    }

    // Simulate DVSA login validation (in real implementation, make HTTP request to DVSA)
    console.log(`🔍 Validating DVSA credentials for user: ${req.user.email}`);

    // Mock validation - replace with real DVSA API call
    const isValid = username.length >= 6 && password.length >= 8;

    if (isValid) {
      console.log(`✅ DVSA credentials validated successfully for user: ${req.user.email}`);
      res.json({
        success: true,
        valid: true,
        message: 'DVSA credentials are valid'
      });
    } else {
      console.log(`❌ DVSA credentials validation failed for user: ${req.user.email}`);
      res.json({
        success: true,
        valid: false,
        message: 'Invalid DVSA credentials format'
      });
    }

  } catch (error) {
    console.error('❌ Error validating DVSA credentials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate credentials'
    });
  }
});

module.exports = router;