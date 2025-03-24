const express = require("express");
const router = express.Router();

const { 
  signup, 
  login, 
  logout, 
  savePreference, 
  changePassword, 
  sendVerifyOtp, 
  verifyEmail, 
  sendResetOTP, 
  resetPassword 
} = require('../controller/auth.controller');

const { protectRoute } = require("../middleware/protectRoute");

// Authentication Routes

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.post('/auth/save-preferences', protectRoute, savePreference);
router.post('/auth/send-verify-otp', sendVerifyOtp);
router.post('/auth/verify-email', verifyEmail);
router.post('/auth/send-reset-otp', sendResetOTP);
router.post('/auth/reset-password', resetPassword);

router.use(protectRoute);
router.patch('/auth/change-password', changePassword);

module.exports = router;
