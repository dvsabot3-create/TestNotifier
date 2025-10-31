import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Mock database - in production this would connect to your actual database
const users = [];

// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation function
const validatePassword = (password) => {
  return password.length >= 6;
};

export async function register(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name, firstName, lastName } = req.body;

    console.log('Registration attempt for:', email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists (in production, query your database)
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (in production, insert into database)
    const newUser = {
      id: Date.now().toString(), // Simple ID generation
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName || name?.split(' ')[0] || '',
      lastName: lastName || name?.split(' ').slice(1).join(' ') || '',
      subscriptionStatus: 'free',
      subscriptionTier: 'free',
      isEmailVerified: false, // Would need email verification in production
      isActive: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate JWT tokens
    const accessToken = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        provider: 'local'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data without sensitive information
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      subscriptionStatus: newUser.subscriptionStatus,
      subscriptionTier: newUser.subscriptionTier,
      isEmailVerified: newUser.isEmailVerified,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt
    };

    console.log('Registration successful for:', email);

    res.status(201).json({
      token: accessToken,
      refreshToken: refreshToken,
      user: userResponse,
      message: 'Registration successful. Please verify your email to access all features.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}