const User = require('../model/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateTokenAndSetCookie = require("../utils/generateToken");
const sendEmail = require('../utils/email'); // Import the email utility
const validator = require('validator'); // Add the validator library

// Signup Function
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const trimmedEmail = email?.trim();

    // Validate email format
    if (!trimmedEmail || !validator.isEmail(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password validation
    const passwordErrors = [];
    if (password.length < 8) passwordErrors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) passwordErrors.push('one uppercase letter');
    if (!/[0-9]/.test(password)) passwordErrors.push('one number');
    if (!/[!@#$%^&*]/.test(password)) passwordErrors.push('one special character');
    
    if (passwordErrors.length > 0) {
      return res.status(400).json({ 
        error: `Password must contain: ${passwordErrors.join(', ')}` 
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: trimmedEmail,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: trimmedEmail,
      subject: "Welcome to Our Service!",
      text: `Hello ${name},\n\nThank you for signing up!`,
    };
    await sendEmail(mailOptions);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Login Function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email?.trim();

    if (!trimmedEmail || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Logout Function
const logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie("jwt", '', { maxAge: 0 });
    res.status(200).json("User logged out successfully");
  } catch (err) {
    console.error("Error in logout controller:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Email Verification: Send OTP
const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account Already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email.trim(), // Use trimmed email
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}, verify your account using this OTP`,
    };

    await sendEmail(mailOptions);
    return res.json({ success: true, message: "Verification OTP sent to your email." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Email Verification: Check OTP
const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await User.findById(userId);

    if (!user || user.verifyOtp !== otp || user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "Invalid or Expired OTP" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email Verified Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Change Password Function
const changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  // Validate email using validator
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Validate all required fields
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect current password." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: "Password updated successfully!" });
  } catch (error) {
    console.error("Error in changing password:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// Save Preferences Function
const savePreference = async (req, res) => {
  const { interests } = req.body;

  // Validate preferences data
  if (!interests || !Array.isArray(interests)) {
    return res.status(400).json({ error: "Invalid preferences data" });
  }

  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { "preferences.interests": interests },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ success: "Preferences saved successfully!", preferences: user.preferences });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Send Reset OTP
const sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const trimmedEmail = email?.trim();

    if (!trimmedEmail || !validator.isEmail(trimmedEmail)) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(404).json({ error: 'Email not registered' });
    }

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 600000; // 10 minutes
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: trimmedEmail,
      subject: "Password Reset OTP",
      text: `Your OTP code is: ${otp}\nValid for 10 minutes.`,
    };
    
    await sendEmail(mailOptions);
    res.json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error("OTP send error:", error.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Reset Password Function
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const trimmedEmail = email?.trim();

    if (!trimmedEmail || !otp || !newPassword) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.resetOtp !== otp || user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ error: 'Invalid/expired OTP' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpireAt = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });

  } catch (error) {
    console.error("Password reset error:", error.message);
    res.status(500).json({ error: 'Password reset failed' });
  }
};

// Export all functions
module.exports = {
  signup,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  changePassword,
  savePreference,
  sendResetOTP,
  resetPassword,
};