import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Verification Code, Step 3: New Password

  const handleSendCode = async (e) => {
    e.preventDefault();
    // Logic to send verification code to the email
    // After sending, move to the next step
    setStep(2);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    // Logic to verify the code
    // If verified, move to the next step
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    // Logic to reset the password
    // After resetting, navigate to login page
    navigate("/user-login");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Forgot Password
        </h2>
        {step === 1 && (
          <form onSubmit={handleSendCode} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <button
              type="submit"
              className="p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-semibold"
            >
              Send Verification Code
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <button
              type="submit"
              className="p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-semibold"
            >
              Verify Code
            </button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <button
              type="submit"
              className="p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-semibold"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
