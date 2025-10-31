import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Mock database - in production this would connect to your actual database
const users = [
  {
    id: '1',
    email: 'test@testnotifier.co.uk',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'Test',
    lastName: 'User',
    subscriptionStatus: 'active',
    subscriptionTier: 'premium',
    isEmailVerified: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export async function login(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user (in production, query your database)
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        provider: 'local'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

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

    console.log('Login successful for:', email);

    res.status(200).json({
      token: accessToken,
      refreshToken: refreshToken,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}