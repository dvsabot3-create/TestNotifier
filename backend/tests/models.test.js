const mongoose = require('mongoose');
const User = require('../src/models/User');
const Subscription = require('../src/models/Subscription');

describe('Database Models', () => {
  beforeEach(async () => {
    // Clear collections before each test
    await User.deleteMany({});
    await Subscription.deleteMany({});
  });

  describe('User Model', () => {
    it('should create a valid user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'SecurePassword123!',
        dataProcessingConsent: true,
        subscription: {
          tier: 'free',
          status: 'active'
        }
      };

      const user = await User.create(userData);

      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.email).toBe(userData.email);
      expect(user.subscription.tier).toBe('free');
      expect(user.isEmailVerified).toBe(false);
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should hash password before saving', async () => {
      const password = 'TestPassword123!';
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: password,
        dataProcessingConsent: true
      });

      // Password should be hashed (not equal to original)
      expect(user.password).not.toBe(password);
      expect(user.password.length).toBeGreaterThan(50); // Hashed passwords are longer

      // Verify password comparison works
      const isValid = await user.comparePassword(password);
      expect(isValid).toBe(true);

      const isInvalid = await user.comparePassword('wrongpassword');
      expect(isInvalid).toBe(false);
    });

    it('should generate valid JWT token', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'TestPassword123!',
        dataProcessingConsent: true
      });

      const token = user.getJWTToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate email verification token', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'TestPassword123!',
        dataProcessingConsent: true
      });

      const verificationToken = user.generateEmailVerificationToken();
      expect(verificationToken).toBeDefined();
      expect(typeof verificationToken).toBe('string');
      expect(user.emailVerificationToken).toBe(verificationToken);
      expect(user.emailVerificationExpires).toBeDefined();
      expect(user.emailVerificationExpires.getTime()).toBeGreaterThan(Date.now());
    });

    it('should generate password reset token', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'TestPassword123!',
        dataProcessingConsent: true
      });

      const resetToken = user.generatePasswordResetToken();
      expect(resetToken).toBeDefined();
      expect(typeof resetToken).toBe('string');
      expect(user.passwordResetToken).toBe(resetToken);
      expect(user.passwordResetExpires).toBeDefined();
      expect(user.passwordResetExpires.getTime()).toBeGreaterThan(Date.now());
    });

    it('should enforce email uniqueness', async () => {
      await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'TestPassword123!',
        dataProcessingConsent: true
      });

      await expect(User.create({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john.doe@test.com', // Same email
        password: 'TestPassword123!',
        dataProcessingConsent: true
      })).rejects.toThrow();
    });

    it('should validate required fields', async () => {
      await expect(User.create({
        // Missing required fields
      })).rejects.toThrow();
    });

    it('should validate email format', async () => {
      await expect(User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'TestPassword123!',
        dataProcessingConsent: true
      })).rejects.toThrow();
    });

    it('should validate password strength', async () => {
      await expect(User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'weak', // Too short
        dataProcessingConsent: true
      })).rejects.toThrow();
    });

    it('should have correct virtual properties', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'TestPassword123!',
        dataProcessingConsent: true
      });

      expect(user.fullName).toBe('John Doe');
      expect(user.isLocked).toBe(false);
    });

    it('should have correct static methods', async () => {
      await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'TestPassword123!',
        dataProcessingConsent: true
      });

      const foundByEmail = await User.findByEmail('john.doe@test.com');
      expect(foundByEmail).toBeTruthy();
      expect(foundByEmail.email).toBe('john.doe@test.com');

      const activeUsers = await User.findActiveUsers();
      expect(activeUsers).toBeInstanceOf(Array);
      expect(activeUsers.length).toBe(1);

      const freeUsers = await User.getUsersBySubscription('free');
      expect(freeUsers).toBeInstanceOf(Array);
      expect(freeUsers.length).toBe(1);
    });

    it('should handle account locking', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'TestPassword123!',
        dataProcessingConsent: true
      });

      // Increment login attempts
      await user.incrementLoginAttempts();
      expect(user.loginAttempts).toBe(1);

      // Reset login attempts
      await user.resetLoginAttempts();
      expect(user.loginAttempts).toBe(0);
      expect(user.lockUntil).toBeUndefined();
    });
  });

  describe('Subscription Model', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'TestPassword123!',
        dataProcessingConsent: true
      });
    });

    it('should create a valid subscription', async () => {
      const subscriptionData = {
        userId: testUser._id,
        tier: 'starter',
        status: 'active',
        price: {
          amount: 25,
          currency: 'gbp',
          interval: 'month'
        },
        stripe: {
          customerId: 'cus_test123',
          subscriptionId: 'sub_test123'
        },
        currentPeriod: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        },
        limits: {
          pupils: 3,
          checksPerMonth: -1,
          notificationsPerMonth: -1
        },
        features: {
          smsNotifications: true,
          whatsappNotifications: false,
          emailNotifications: true,
          autoRebooking: false,
          prioritySupport: false,
          advancedAnalytics: false
        }
      };

      const subscription = await Subscription.create(subscriptionData);

      expect(subscription.userId.toString()).toBe(testUser._id.toString());
      expect(subscription.tier).toBe('starter');
      expect(subscription.status).toBe('active');
      expect(subscription.price.amount).toBe(25);
      expect(subscription.stripe.customerId).toBe('cus_test123');
      expect(subscription.limits.pupils).toBe(3);
      expect(subscription.features.smsNotifications).toBe(true);
      expect(subscription.features.whatsappNotifications).toBe(false);
    });

    it('should validate subscription tier', async () => {
      await expect(Subscription.create({
        userId: testUser._id,
        tier: 'invalid-tier',
        status: 'active',
        price: { amount: 25, currency: 'gbp', interval: 'month' },
        currentPeriod: { start: new Date(), end: new Date() },
        limits: { pupils: 3 }
      })).rejects.toThrow();
    });

    it('should validate subscription status', async () => {
      await expect(Subscription.create({
        userId: testUser._id,
        tier: 'starter',
        status: 'invalid-status',
        price: { amount: 25, currency: 'gbp', interval: 'month' },
        currentPeriod: { start: new Date(), end: new Date() },
        limits: { pupils: 3 }
      })).rejects.toThrow();
    });

    it('should have correct instance methods', async () => {
      const subscription = await Subscription.create({
        userId: testUser._id,
        tier: 'starter',
        status: 'active',
        price: { amount: 25, currency: 'gbp', interval: 'month' },
        stripe: { customerId: 'cus_test123' },
        currentPeriod: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        limits: { pupils: 3 },
        features: { smsNotifications: true }
      });

      expect(subscription.isActive()).toBe(true);
      expect(subscription.canCancel()).toBe(true);

      // Test usage tracking
      subscription.incrementUsage('pupilsCount');
      expect(subscription.usage.pupilsCount).toBe(1);

      // Test usage limit checking
      expect(subscription.checkUsageLimit('pupilsCount')).toBe(true);

      // Test usage percentage
      const usagePercentage = subscription.usagePercentage;
      expect(usagePercentage.pupilsCount.current).toBe(1);
      expect(usagePercentage.pupilsCount.limit).toBe(3);
      expect(usagePercentage.pupilsCount.percentage).toBe(33);
    });

    it('should have correct static methods', async () => {
      const subscription = await Subscription.create({
        userId: testUser._id,
        tier: 'starter',
        status: 'active',
        price: { amount: 25, currency: 'gbp', interval: 'month' },
        stripe: { customerId: 'cus_test123' },
        currentPeriod: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        limits: { pupils: 3 }
      });

      const activeSubscription = await Subscription.findActiveSubscription(testUser._id);
      expect(activeSubscription).toBeTruthy();
      expect(activeSubscription._id.toString()).toBe(subscription._id.toString());

      const byStripeId = await Subscription.findByStripeCustomerId('cus_test123');
      expect(byStripeId).toBeTruthy();
      expect(byStripeId._id.toString()).toBe(subscription._id.toString());
    });

    it('should handle unlimited usage correctly', async () => {
      const subscription = await Subscription.create({
        userId: testUser._id,
        tier: 'professional',
        status: 'active',
        price: { amount: 80, currency: 'gbp', interval: 'month' },
        stripe: { customerId: 'cus_test456' },
        currentPeriod: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        limits: { pupils: -1 } // Unlimited
      });

      subscription.usage.pupilsCount = 1000;
      expect(subscription.checkUsageLimit('pupilsCount')).toBe(true); // Should allow unlimited

      const usagePercentage = subscription.usagePercentage;
      expect(usagePercentage.pupilsCount.current).toBe(1000);
      expect(usagePercentage.pupilsCount.limit).toBe('unlimited');
      expect(usagePercentage.pupilsCount.percentage).toBe(0);
    });

    it('should handle subscription cancellation', async () => {
      const subscription = await Subscription.create({
        userId: testUser._id,
        tier: 'starter',
        status: 'active',
        price: { amount: 25, currency: 'gbp', interval: 'month' },
        stripe: { customerId: 'cus_test789' },
        currentPeriod: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        limits: { pupils: 3 }
      });

      expect(subscription.canCancel()).toBe(true);

      // Update to cancelled status
      subscription.status = 'cancelled';
      expect(subscription.canCancel()).toBe(false);
    });
  });

  describe('Model Relationships', () => {
    it('should properly reference user in subscription', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'TestPassword123!',
        dataProcessingConsent: true
      });

      const subscription = await Subscription.create({
        userId: user._id,
        tier: 'starter',
        status: 'active',
        price: { amount: 25, currency: 'gbp', interval: 'month' },
        stripe: { customerId: 'cus_test123' },
        currentPeriod: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        limits: { pupils: 3 }
      });

      // Test population
      const populatedSubscription = await Subscription.findById(subscription._id).populate('userId');
      expect(populatedSubscription.userId).toBeDefined();
      expect(populatedSubscription.userId.firstName).toBe('John');
      expect(populatedSubscription.userId.email).toBe('john.doe@test.com');
    });
  });
});