const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');

describe('Authentication Endpoints', () => {
  let server;
  let testUser;

  beforeAll(async () => {
    server = app.listen(5003);
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(async () => {
    // Create a test user
    testUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      password: 'TestPassword123!',
      dataProcessingConsent: true,
      isEmailVerified: true,
      subscription: {
        tier: 'free',
        status: 'active'
      }
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@test.com',
        password: 'SecurePass123!',
        dataProcessingConsent: true,
        marketingConsent: false
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.message).toContain('successfully');

      // Verify user was created in database
      const createdUser = await User.findOne({ email: newUser.email });
      expect(createdUser).toBeTruthy();
      expect(createdUser.firstName).toBe(newUser.firstName);
      expect(createdUser.lastName).toBe(newUser.lastName);
    });

    it('should fail registration with duplicate email', async () => {
      const duplicateUser = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'john.doe@test.com', // Same as testUser
        password: 'SecurePass123!',
        dataProcessingConsent: true
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUser)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should fail registration with invalid email', async () => {
      const invalidUser = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'invalid-email',
        password: 'SecurePass123!',
        dataProcessingConsent: true
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should fail registration with weak password', async () => {
      const weakPasswordUser = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@test.com',
        password: 'weak',
        dataProcessingConsent: true
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(weakPasswordUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should fail registration without data processing consent', async () => {
      const noConsentUser = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@test.com',
        password: 'SecurePass123!',
        dataProcessingConsent: false
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(noConsentUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'john.doe@test.com',
        password: 'TestPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.message).toBe('Login successful');
    });

    it('should fail login with invalid password', async () => {
      const loginData = {
        email: 'john.doe@test.com',
        password: 'WrongPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should fail login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@test.com',
        password: 'TestPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should fail login with invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'TestPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user profile with valid token', async () => {
      const token = testUser.getJWTToken();

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.firstName).toBe(testUser.firstName);
      expect(response.body.data.user.lastName).toBe(testUser.lastName);
    });

    it('should fail without authentication token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized');
    });
  });

  describe('PUT /api/auth/update-profile', () => {
    it('should update user profile successfully', async () => {
      const token = testUser.getJWTToken();
      const updateData = {
        firstName: 'Johnny',
        lastName: 'Smith',
        phoneNumber: '+447700900123'
      };

      const response = await request(app)
        .put('/api/auth/update-profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.firstName).toBe(updateData.firstName);
      expect(response.body.data.user.lastName).toBe(updateData.lastName);
      expect(response.body.data.user.phoneNumber).toBe(updateData.phoneNumber);
    });

    it('should fail without authentication token', async () => {
      const updateData = {
        firstName: 'Johnny',
        lastName: 'Smith'
      };

      const response = await request(app)
        .put('/api/auth/update-profile')
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid phone number format', async () => {
      const token = testUser.getJWTToken();
      const updateData = {
        phoneNumber: 'invalid-phone'
      };

      const response = await request(app)
        .put('/api/auth/update-profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/auth/change-password', () => {
    it('should change password successfully', async () => {
      const token = testUser.getJWTToken();
      const passwordData = {
        currentPassword: 'TestPassword123!',
        newPassword: 'NewSecurePass456!'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('successfully');

      // Verify new password works
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john.doe@test.com',
          password: 'NewSecurePass456!'
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    it('should fail with incorrect current password', async () => {
      const token = testUser.getJWTToken();
      const passwordData = {
        currentPassword: 'WrongCurrentPassword',
        newPassword: 'NewSecurePass456!'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('incorrect');
    });

    it('should fail with weak new password', async () => {
      const token = testUser.getJWTToken();
      const passwordData = {
        currentPassword: 'TestPassword123!',
        newPassword: 'weak'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should send password reset email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'john.doe@test.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('sent successfully');

      // Verify reset token was generated
      const user = await User.findOne({ email: 'john.doe@test.com' });
      expect(user.passwordResetToken).toBeDefined();
      expect(user.passwordResetExpires).toBeDefined();
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@test.com' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No user found');
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.environment).toBe('test');
    });
  });
});