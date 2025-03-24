import React, { useState } from 'react';
import axios from 'axios';

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/send-verify-otp', { userId: email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Verify Your Email</h2>
      <form onSubmit={handleVerifyEmail}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Verification OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyEmail;
