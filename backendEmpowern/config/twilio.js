// config/twilio.js
import dotenv from 'dotenv';
dotenv.config();

const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER
};

// Validation
const validateTwilioConfig = () => {
  if (!twilioConfig.accountSid || !twilioConfig.accountSid.startsWith('AC')) {
    throw new Error('Invalid or missing TWILIO_ACCOUNT_SID. Must start with "AC"');
  }
  if (!twilioConfig.authToken) {
    throw new Error('Missing TWILIO_AUTH_TOKEN');
  }
  if (!twilioConfig.verifyServiceSid || !twilioConfig.verifyServiceSid.startsWith('VA')) {
    throw new Error('Invalid or missing TWILIO_VERIFY_SERVICE_SID. Must start with "VA"');
  }
  if (!twilioConfig.phoneNumber) {
    throw new Error('Missing TWILIO_PHONE_NUMBER');
  }
};

export { twilioConfig, validateTwilioConfig };