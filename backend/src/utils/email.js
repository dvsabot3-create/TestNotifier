const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Use a real email service in production
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Use ethereal.email for development
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'testnotifier.dev@ethereal.email',
        pass: 'development-password'
      }
    });
  }
};

// Send email
const sendEmail = async ({ to, subject, template, data }) => {
  try {
    const transporter = createTransporter();

    // Email templates
    const templates = {
      'email-verification': {
        subject: 'Verify your TestNotifier account',
        html: `
          <h2>Welcome to TestNotifier, ${data.firstName}!</h2>
          <p>Please click the link below to verify your email address:</p>
          <p><a href="${data.verificationUrl}" style="background: #1d70b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
          <p>Or copy and paste this link into your browser:</p>
          <p><code>${data.verificationUrl}</code></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account with us, please ignore this email.</p>
        `
      },
      'password-reset': {
        subject: 'Reset your TestNotifier password',
        html: `
          <h2>Password Reset Request</h2>
          <p>Hi ${data.firstName},</p>
          <p>We received a request to reset your password. Click the link below to reset it:</p>
          <p><a href="${data.resetUrl}" style="background: #1d70b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
          <p>Or copy and paste this link into your browser:</p>
          <p><code>${data.resetUrl}</code></p>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        `
      },
      'subscription-welcome': {
        subject: 'Welcome to TestNotifier Premium!',
        html: `
          <h2>Welcome to ${data.tierName}, ${data.firstName}!</h2>
          <p>Thank you for subscribing to TestNotifier. Your subscription is now active.</p>
          <p><strong>Subscription Details:</strong></p>
          <ul>
            <li>Tier: ${data.tierName}</li>
            <li>Price: £${data.price}</li>
            <li>Next billing date: ${data.nextBillingDate}</li>
          </ul>
          <p>You can now enjoy all the benefits of your subscription tier.</p>
          <p><a href="${process.env.CLIENT_URL}/dashboard" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a></p>
        `
      },
      'subscription-renewal': {
        subject: 'Your TestNotifier subscription is about to expire',
        html: `
          <h2>Subscription Expiring Soon</h2>
          <p>Hi ${data.firstName},</p>
          <p>Your TestNotifier subscription will expire on ${data.expirationDate}.</p>
          <p>To continue enjoying uninterrupted service, please renew your subscription.</p>
          <p><a href="${process.env.CLIENT_URL}/pricing" style="background: #ffc107; color: #212529; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Renew Subscription</a></p>
        `
      }
    };

    const emailTemplate = templates[template] || templates['email-verification'];

    const mailOptions = {
      from: `${process.env.EMAIL_FROM || 'TestNotifier'} <${process.env.EMAIL_USER || 'hello@testnotifier.co.uk'}>`,
      to,
      subject: subject || emailTemplate.subject,
      html: emailTemplate.html
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    if (process.env.NODE_ENV === 'development') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
};