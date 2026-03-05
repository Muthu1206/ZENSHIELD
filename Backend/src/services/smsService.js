/**
 * SMS Service - Twilio Integration
 */

const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send OTP via SMS
 */
exports.sendOTPSMS = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your ZenSHIELD verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`,
    });

    console.log(`📧 SMS sent to ${phoneNumber}: ${message.sid}`);

    return {
      success: true,
      messageId: message.sid,
    };
  } catch (error) {
    console.error('Twilio SMS Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send SOS Alert SMS
 */
exports.sendSOSSMS = async (guardianPhone, userData) => {
  try {
    const messageBody = `
🚨 SOS ALERT From ${userData.name || 'User'}!
📍 Location: ${userData.latitude}, ${userData.longitude}
🚗 Ride Status: Active
⏰ Time: ${new Date().toLocaleTimeString()}

Open ZenSHIELD app for live tracking.
    `.trim();

    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${guardianPhone}`,
    });

    console.log(`🚨 SOS SMS sent to ${guardianPhone}: ${message.sid}`);

    return {
      success: true,
      messageId: message.sid,
    };
  } catch (error) {
    console.error('SOS SMS Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send Ride Alert SMS
 */
exports.sendRideAlertSMS = async (guardianPhone, rideData) => {
  try {
    const messageBody = `
✅ Ride Started!
👤 User: ${rideData.userName}
📍 From: ${rideData.startLocation || 'Unknown'}
⏰ Time: ${new Date().toLocaleTimeString()}

Open ZenSHIELD to track live location.
    `.trim();

    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${guardianPhone}`,
    });

    return {
      success: true,
      messageId: message.sid,
    };
  } catch (error) {
    console.error('Ride Alert SMS Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
