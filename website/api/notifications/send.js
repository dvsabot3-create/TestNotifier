const express = require('express');
const router = express.Router();

// Notification service integrations
const sendEmail = async (to, subject, html) => {
  // Check if SendGrid is configured
  if (process.env.SENDGRID_API_KEY) {
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      await sgMail.send({
        to,
        from: process.env.SENDGRID_FROM_EMAIL || 'hello@testnotifier.co.uk',
        subject,
        html
      });
      
      return { success: true, service: 'SendGrid' };
    } catch (error) {
      console.error('SendGrid error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Fallback to Nodemailer if configured
  if (process.env.SMTP_HOST) {
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'hello@testnotifier.co.uk',
        to,
        subject,
        html
      });
      
      return { success: true, service: 'SMTP' };
    } catch (error) {
      console.error('SMTP error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // No email service configured
  console.warn('⚠️ No email service configured. Set SENDGRID_API_KEY or SMTP credentials.');
  return { success: false, error: 'Email service not configured' };
};

const sendSMS = async (to, message) => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('⚠️ Twilio not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.');
    return { success: false, error: 'SMS service not configured' };
  }
  
  try {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    return { success: true, service: 'Twilio', messageId: result.sid };
  } catch (error) {
    console.error('Twilio SMS error:', error);
    return { success: false, error: error.message };
  }
};

const sendWhatsApp = async (to, message) => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('⚠️ Twilio not configured for WhatsApp. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.');
    return { success: false, error: 'WhatsApp service not configured' };
  }
  
  try {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // WhatsApp requires 'whatsapp:' prefix
    const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER || `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;
    
    const result = await client.messages.create({
      body: message,
      from: whatsappFrom,
      to: whatsappTo
    });
    
    return { success: true, service: 'Twilio WhatsApp', messageId: result.sid };
  } catch (error) {
    console.error('Twilio WhatsApp error:', error);
    return { success: false, error: error.message };
  }
};

// Main notification endpoint
router.post('/', async (req, res) => {
  try {
    const {
      type,
      monitorId,
      monitorName,
      email,
      phone,
      slot,
      notificationTypes,
      subscriptionTier
    } = req.body;
    
    // Validation
    if (!type || !notificationTypes || notificationTypes.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Notification type and channels required' 
      });
    }
    
    const results = {
      email: { sent: false },
      sms: { sent: false },
      whatsapp: { sent: false }
    };
    
    // Prepare message content based on notification type
    let emailSubject, emailHtml, smsMessage, whatsappMessage;
    
    if (type === 'slot_found') {
      emailSubject = `🎉 Earlier Test Slot Found for ${monitorName}!`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1d70b8 0%, #2e8bc0 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">TestNotifier Alert!</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1d70b8; margin-top: 0;">Earlier Test Slot Available 🎉</h2>
            <p style="font-size: 16px; color: #374151;">We found an earlier test slot for <strong>${monitorName}</strong>!</p>
            
            <div style="background: white; border: 2px solid #1d70b8; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${slot.date}</p>
              <p style="margin: 5px 0;"><strong>🕐 Time:</strong> ${slot.time}</p>
              <p style="margin: 5px 0;"><strong>📍 Centre:</strong> ${slot.centre}</p>
            </div>
            
            <p style="color: #6b7280;">Open your TestNotifier extension to view all available slots and book now!</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://testnotifier.co.uk/dashboard" style="background: #1d70b8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                View Dashboard
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>TestNotifier - Never miss an earlier test slot</p>
            <p>Email: hello@testnotifier.co.uk</p>
          </div>
        </div>
      `;
      
      smsMessage = `TestNotifier: Earlier slot found for ${monitorName}! ${slot.date} at ${slot.time} - ${slot.centre}. Open extension to book.`;
      whatsappMessage = `🎉 *TestNotifier Alert*\n\nEarlier slot found for *${monitorName}*!\n\n📅 Date: ${slot.date}\n🕐 Time: ${slot.time}\n📍 Centre: ${slot.centre}\n\nOpen your TestNotifier extension to book now!`;
    } else if (type === 'booking_confirmation') {
      emailSubject = `✅ Booking Confirmed for ${monitorName}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Booking Confirmed! ✅</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #28a745; margin-top: 0;">Successfully Booked Test Slot!</h2>
            <p style="font-size: 16px; color: #374151;">Great news! We've successfully booked an earlier test slot for <strong>${monitorName}</strong>.</p>
            
            <div style="background: white; border: 2px solid #28a745; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📅 New Date:</strong> ${slot.date}</p>
              <p style="margin: 5px 0;"><strong>🕐 Time:</strong> ${slot.time}</p>
              <p style="margin: 5px 0;"><strong>📍 Centre:</strong> ${slot.centre}</p>
            </div>
            
            <p style="color: #6b7280;">Please check your DVSA account to confirm the booking details.</p>
          </div>
          <div style="background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>TestNotifier - Automated booking service</p>
          </div>
        </div>
      `;
      
      smsMessage = `TestNotifier: Booking confirmed for ${monitorName}! ${slot.date} at ${slot.time} - ${slot.centre}. Check your DVSA account.`;
      whatsappMessage = `✅ *Booking Confirmed!*\n\n${monitorName} test slot booked:\n\n📅 ${slot.date}\n🕐 ${slot.time}\n📍 ${slot.centre}\n\nPlease verify in your DVSA account.`;
    }
    
    // Send notifications based on requested types and tier permissions
    const promises = [];
    
    // Email (all tiers)
    if (notificationTypes.includes('email') && email) {
      promises.push(
        sendEmail(email, emailSubject, emailHtml)
          .then(result => { results.email = result; })
          .catch(err => { results.email = { success: false, error: err.message }; })
      );
    }
    
    // SMS (Starter+)
    if (notificationTypes.includes('sms') && phone && 
        ['starter', 'premium', 'professional'].includes(subscriptionTier)) {
      promises.push(
        sendSMS(phone, smsMessage)
          .then(result => { results.sms = result; })
          .catch(err => { results.sms = { success: false, error: err.message }; })
      );
    }
    
    // WhatsApp (Professional only)
    if (notificationTypes.includes('whatsapp') && phone && subscriptionTier === 'professional') {
      promises.push(
        sendWhatsApp(phone, whatsappMessage)
          .then(result => { results.whatsapp = result; })
          .catch(err => { results.whatsapp = { success: false, error: err.message }; })
      );
    }
    
    // Wait for all notifications to complete
    await Promise.all(promises);
    
    // Count successes
    const emailSent = results.email.sent || results.email.success;
    const smsSent = results.sms.sent || results.sms.success;
    const whatsappSent = results.whatsapp.sent || results.whatsapp.success;
    
    const successCount = [emailSent, smsSent, whatsappSent].filter(Boolean).length;
    
    // Return results
    res.status(200).json({
      success: successCount > 0,
      emailSent,
      smsSent,
      whatsappSent,
      details: results,
      message: `${successCount} notification(s) sent successfully`
    });
    
  } catch (error) {
    console.error('Notification send error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send notifications',
      details: error.message
    });
  }
});

module.exports = router;

