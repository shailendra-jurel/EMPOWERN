// src/utils/twilio.js

// Example function to send OTP via your backend API
export const sendOtp = async (phoneNumber) => {
    try {
      const response = await fetch('/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      if (response.ok) {
        alert('OTP sent successfully!');
      } else {
        alert('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };
  
  // Example function to verify OTP via your backend API
  export const verifyOtp = async (phoneNumber, otp) => {
    try {
      const response = await fetch('/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp }),
      });
      if (response.ok) {
        alert('OTP verified successfully!');
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };
  