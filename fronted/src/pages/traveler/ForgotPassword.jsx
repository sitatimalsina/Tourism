import React, { useState } from 'react';
import axios from 'axios';
import validator from 'validator';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSending, setIsSending] = useState(false); // To track API call status

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; 
const handleSendResetOtp = async (e) => {
  e.preventDefault();
  setErrorMessage("");
  setSuccessMessage("");

  if (!validator.isEmail(email)) {
    setErrorMessage("Invalid email format.");
    return;
  }

  try {
    setIsSending(true);
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/send-reset-otp`, // Verify endpoint URL
      { email },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      }
    );
    setSuccessMessage(response.data.message);
  } catch (error) {
    let message = "Failed to send OTP. Please try again.";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    setErrorMessage(message);
  } finally {
    setIsSending(false);
  }
};

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Reset previous messages
    setErrorMessage('');
    setSuccessMessage('');

    // Basic validation for OTP and newPassword
    if (!otp || !newPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      setIsSending(true); // Start sending request
      const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { email, otp, newPassword });

      setIsSending(false); // Request completed
      setSuccessMessage(response.data.message); // Show success message
    } catch (error) {
      setIsSending(false); // Request failed
      if (error.response) {
        setErrorMessage(error.response.data.message || 'An error occurred');
      } else if (error.request) {
        setErrorMessage('No response received from the server. Please check your internet connection.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };
  
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
          
          {/* Send OTP Form */}
          <form onSubmit={handleSendResetOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSending ? 'Sending OTP...' : 'Send Reset OTP'}
            </button>
          </form>
  
          {/* Reset Password Form */}
          <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isSending ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
  
          {/* Status Messages */}
          {successMessage && (
            <p className="mt-4 text-center text-green-600">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="mt-4 text-center text-red-600">{errorMessage}</p>
          )}
        </div>
      </div>
    );
  };
  
  export default ForgotPassword;