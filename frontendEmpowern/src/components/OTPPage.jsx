import React, { useState } from 'react';
import axios from 'axios';

const OTPPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async () => {
    try {
      await axios.post('/send-otp', { phoneNumber });
      setMessage('OTP sent!');
    } catch (error) {
      setMessage('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.post('/verify-otp', { phoneNumber, otp });
      setMessage('OTP verified!');
    } catch (error) {
      setMessage('Invalid OTP');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <button onClick={handleSendOtp} className="bg-blue-600 text-white p-2 rounded">
        Send OTP
      </button>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="mt-4 p-2 border rounded"
      />
      <button onClick={handleVerifyOtp} className="bg-green-600 text-white p-2 rounded mt-2">
        Verify OTP
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default OTPPage;
