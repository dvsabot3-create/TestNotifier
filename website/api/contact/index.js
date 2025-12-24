/**
 * Contact Form API Endpoint
 * Handles contact form submissions and sends emails
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');

const router = express.Router();

// Contact form rate limiting - stricter than general API
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit to 3 contact requests per 15 minutes per IP
  message: {
    error: 'Too many contact requests. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_SMTP_PORT) || 587,
    secure: process.env.EMAIL_SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASS,
    },
  });
};

// Validation middleware
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage('Name contains invalid characters'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email address is too long'),

  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters')
    .escape(),

  body('message')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters')
    .escape(),

  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high'])
    .withMessage('Priority must be low, normal, or high')
];

/**
 * POST /api/contact
 * Handle contact form submission
 */
router.post('/', contactLimiter, contactValidation, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    const { name, email, subject, message, priority = 'normal' } = req.body;

    // Sanitize HTML content
    const cleanSubject = sanitizeHtml(subject, {
      allowedTags: [],
      allowedAttributes: {}
    });

    const cleanMessage = sanitizeHtml(message, {
      allowedTags: ['p', 'br', 'strong', 'em', 'u'],
      allowedAttributes: {}
    });

    // Create email transporter
    const transporter = createTransporter();

    // Verify transporter configuration
    await transporter.verify();

    // Email to support team
    const supportMailOptions = {
      from: `"TestNotifier Contact Form" <${process.env.EMAIL_SMTP_USER}>`,
      to: process.env.SUPPORT_EMAIL || 'hello@testnotifier.co.uk',
      subject: `[${priority.toUpperCase()}] ${cleanSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #1d70b8;">New Contact Form Submission</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Priority:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${priority}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">IP Address:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${req.ip}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Timestamp:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toISOString()}</td>
            </tr>
          </table>
          <div style="margin-top: 20px;">
            <h3 style="color: #1d70b8;">Message:</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${cleanMessage}
            </div>
          </div>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This message was sent from the TestNotifier contact form.
            Reply to: ${email}
          </p>
        </div>
      `,
      text: `
New Contact Form Submission
==========================

Name: ${name}
Email: ${email}
Priority: ${priority}
IP Address: ${req.ip}
Timestamp: ${new Date().toISOString()}

Message:
${cleanMessage}

---
This message was sent from the TestNotifier contact form.
Reply to: ${email}
      `
    };

    // Confirmation email to user
    const confirmationMailOptions = {
      from: `"TestNotifier Support" <${process.env.EMAIL_SMTP_USER}>`,
      to: email,
      subject: 'We received your message - TestNotifier Support',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #1d70b8;">Thank you for contacting TestNotifier</h2>
          <p>Hi ${name},</p>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>Your message:</strong><br>
            ${cleanMessage.substring(0, 200)}${cleanMessage.length > 200 ? '...' : ''}
          </div>
          <p><strong>Priority:</strong> ${priority}</p>
          <p>We typically respond within 24 hours for normal priority requests, and within 2-4 hours for high priority issues.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            TestNotifier Support Team<br>
            hello@testnotifier.co.uk
          </p>
        </div>
      `,
      text: `
Hi ${name},

We've received your message and will get back to you as soon as possible.

Your message (summary):
${cleanMessage.substring(0, 200)}${cleanMessage.length > 200 ? '...' : ''}

Priority: ${priority}

We typically respond within 24 hours for normal priority requests, and within 2-4 hours for high priority issues.

---
TestNotifier Support Team
hello@testnotifier.co.uk
      `
    };

    // Send emails
    await transporter.sendMail(supportMailOptions);
    await transporter.sendMail(confirmationMailOptions);

    // Log successful contact
    logSecurity('Contact form submitted successfully', {
      email: email,
      priority: priority,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      ticketId: `TN${Date.now()}`,
      estimatedResponseTime: priority === 'high' ? '2-4 hours' : '24 hours'
    });

  } catch (error) {
    logError('Contact form submission failed', error, {
      email: req.body.email,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    if (error.code === 'EAUTH') {
      return res.status(500).json({
        success: false,
        message: 'Email service temporarily unavailable. Please try again later or contact us directly at hello@testnotifier.co.uk'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later or contact us directly at hello@testnotifier.co.uk'
    });
  }
});

/**
 * GET /api/contact/status
 * Check contact system status
 */
router.get('/status', async (req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();

    res.status(200).json({
      success: true,
      status: 'operational',
      message: 'Contact system is operational'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'degraded',
      message: 'Contact system is experiencing issues'
    });
  }
});

module.exports = router;