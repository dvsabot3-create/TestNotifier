import jwt from 'jsonwebtoken';

// Mock database - in production this would connect to your actual database
const users = [
  {
    id: '1',
    email: 'test@testnotifier.co.uk',
    firstName: 'Test',
    lastName: 'User',
    subscriptionStatus: 'active',
    subscriptionTier: 'premium',
    isEmailVerified: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export async function me(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    console.log('Verifying token for /me endpoint');

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Find user (in production, query your database)
    const user = users.find(u => u.id === decoded.userId && u.email === decoded.email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Return user data without sensitive information
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionTier: user.subscriptionTier,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    console.log('User data retrieved for:', user.email);

    res.status(200).json({
      user: userResponse,
      authenticated: true
    });

  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}