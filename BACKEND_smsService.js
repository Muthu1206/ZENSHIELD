/**
 * SMS Service for OTP Delivery
 * File: services/smsService.js
 * 
 * Uses Twilio to send OTP via SMS
 * Setup:
 * 1. Create Twilio account at twilio.com
 * 2. Get Account SID, Auth Token, and Phone Number
 * 3. Add to .env file
 */

const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send OTP via SMS using Twilio
 */
exports.sendOTPSMS = async (phoneNumber, otp) => {
  try {
    // Format phone number with country code
    const formattedPhone = `+91${phoneNumber}`;

    // Create SMS message
    const message = await client.messages.create({
      body: `Your ZenSHIELD verification code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`✅ SMS sent successfully to ${formattedPhone}. SID: ${message.sid}`);

    return {
      success: true,
      messageSid: message.sid,
      status: message.status,
    };
  } catch (error) {
    console.error('❌ SMS Send Error:', error.message);

    return {
      success: false,
      error: error.message,
      errorCode: 'TWILIO_ERROR',
    };
  }
};

/**
 * Send Welcome SMS after registration
 */
exports.sendWelcomeSMS = async (phoneNumber, userName) => {
  try {
    const formattedPhone = `+91${phoneNumber}`;

    const message = await client.messages.create({
      body: `Welcome to ZenSHIELD, ${userName}! 🛡️ Your safety companion is ready. Stay safe!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`✅ Welcome SMS sent to ${formattedPhone}`);

    return {
      success: true,
      messageSid: message.sid,
    };
  } catch (error) {
    console.error('❌ Welcome SMS Error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Alert SMS to Guardians
 */
exports.sendAlertSMS = async (phoneNumbers, message) => {
  try {
    const results = [];

    for (const phone of phoneNumbers) {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

      const result = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone,
      });

      results.push({
        phone: formattedPhone,
        messageSid: result.sid,
        status: result.status,
      });
    }

    console.log(`✅ Alert SMS sent to ${results.length} recipients`);

    return {
      success: true,
      sentCount: results.length,
      results,
    };
  } catch (error) {
    console.error('❌ Alert SMS Error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Check SMS delivery status
 */
exports.checkSMSStatus = async (messageSid) => {
  try {
    const message = await client.messages(messageSid).fetch();

    return {
      success: true,
      sid: message.sid,
      status: message.status, // 'queued', 'sending', 'sent', 'failed', 'delivered'
      to: message.to,
      from: message.from,
      sentAt: message.dateCreated,
    };
  } catch (error) {
    console.error('❌ SMS Status Check Error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Fallback: Send SMS using AWS SNS (alternative if Twilio fails)
 * Uncomment if using AWS SNS instead
 */

/*
const AWS = require('aws-sdk');

const sns = new AWS.SNS({
  region: process.env.AWS_REGION || 'ap-south-1',
});

exports.sendOTPSMS_AWS = async (phoneNumber, otp) => {
  try {
    const params = {
      Message: `Your ZenSHIELD verification code is: ${otp}. Valid for 10 minutes.`,
      PhoneNumber: `+91${phoneNumber}`,
    };

    const result = await sns.publish(params).promise();

    return {
      success: true,
      messageId: result.MessageId,
    };
  } catch (error) {
    console.error('AWS SNS Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
*/