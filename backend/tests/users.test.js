const request = require('supertest');
const app = require('../src/server');
const User = require('../src/models/User');

describe('User Management Endpoints', () => {
  let server;
  let adminToken;
  let userToken;
  let testUser;
  let adminUser;

  beforeAll(async () => {
    server = app.listen(5004);

    // Create admin user (professional tier)
    adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: 'AdminPass123!',
      dataProcessingConsent: true,
      isEmailVerified: true,
      subscription: {
        tier: 'professional',
        status: 'active'
      }
    });
    adminToken = adminUser.getJWTToken();

    // Create regular user
    testUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      password: 'TestPassword123!',
      dataProcessingConsent: true,
      isEmailVerified: true,
      subscription: {
        tier: 'starter',
        status: 'active'
      }
    });
    userToken = testUser.getJWTToken();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('GET /api/users', () => {
    it('should get all users for admin', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeInstanceOf(Array);
      expect(response.body.data.users.length).toBeGreaterThan(0);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should fail for non-admin users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not authorized');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users.length).toBe(1);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by ID for admin', async () => {
      const response = await request(app)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.firstName).toBe(testUser.firstName);
    });

    it('should fail for non-admin users', async () => {
      const response = await request(app)
        .get(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail for invalid user ID', async () => {
      const response = await request(app)
        .get('/api/users/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user for admin', async () => {
      const updateData = {
        firstName: 'Johnny',
        lastName: 'Smith',
        phoneNumber: '+447700900123'
      };

      const response = await request(app)
        .put(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.firstName).toBe(updateData.firstName);
      expect(response.body.data.user.lastName).toBe(updateData.lastName);
      expect(response.body.data.user.phoneNumber).toBe(updateData.phoneNumber);
    });

    it('should fail for non-admin users', async () => {
      const updateData = {
        firstName: 'Johnny'
      };

      const response = await request(app)
        .put(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const updateData = {
        firstName: 'Johnny'
      };

      const response = await request(app)
        .put(`/api/users/${testUser._id}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should prevent admin from deleting themselves', async () => {
      const updateData = {
        isActive: false
      };

      const response = await request(app)
        .put(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('cannot delete your own account');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user for admin', async () => {
      // Create a user to delete
      const userToDelete = await User.create({
        firstName: 'Delete',
        lastName: 'Me',
        email: 'delete.me@test.com',
        password: 'DeletePass123!',
        dataProcessingConsent: true,
        subscription: {
          tier: 'free',
          status: 'active'
        }
      });

      const response = await request(app)
        .delete(`/api/users/${userToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');

      // Verify user was actually deleted
      const deletedUser = await User.findById(userToDelete._id);
      expect(deletedUser).toBeNull();
    });

    it('should fail for non-admin users', async () => {
      const response = await request(app)
        .delete(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUser._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/stats/overview', () => {
    it('should get user statistics for admin', async () => {
      const response = await request(app)
        .get('/api/users/stats/overview')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalUsers).toBeGreaterThan(0);
      expect(response.body.data.activeUsers).toBeDefined();
      expect(response.body.data.verifiedUsers).toBeDefined();
      expect(response.body.data.subscriptionStats).toBeInstanceOf(Array);
      expect(response.body.data.recentUsers).toBeInstanceOf(Array);
      expect(response.body.data.monthlyGrowth).toBeInstanceOf(Array);
    });

    it('should fail for non-admin users', async () => {
      const response = await request(app)
        .get('/api/users/stats/overview')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});