const User = require('../model/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateTokenAndSetCookie = require("../utils/generateToken");
const sendEmail = require('../utils/email'); // Import the email utility
const validator = require('validator'); // Add the validator library

// Signup Function
// Signup Function
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long, contain a special character, a number, and a capital letter' });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // let hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      password: hashedPassword,

      password: hashedPassword,

      name,
      email,
      password,
      role: role || "user",
    });

    // Save the user and generate a JWT token
    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      interests: newUser.preferences.interests,
    });
  } catch (err) {
    console.error("Error in signup controller:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Login Function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Compare the provided password with the hashed password
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(400).json({ error: 'Invalid  password' });
    }
    // if(password==user.password){
    //   res.send({message:"password match"})
    // }

    // else{
    //   res.send({message:"password dont match"})
    // }

    // Update lastLogin field
    user.lastLogin = new Date(); // Set the lastLogin to the current date
    await user.save(); // Save the updated user information

    console.log("User login data:", {
      lastLogin: user.lastLogin,
      lastPasswordChange: user.lastPasswordChange,
    }); // Log the lastLogin and lastPasswordChange for debugging

    // Generate a JWT token and set it as a cookie


    const token = generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      name: user.name,
      email: user.email,
      _id: user._id,
      role: user.role,
      interests: user.preferences.interests,
      token, // Include the token in the response
    });
  } catch (err) {
    console.log("Error in login controller", err.message);
    res.status(500).json({ error: "Internal server error" });
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
      return res.status(400).json({ error: "All fields required" });
    }

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.resetOtp !== otp || user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ error: "Invalid/expired OTP" });
    }

    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Use findOneAndUpdate to update the password and reset OTP fields
    const updatedUser = await User.findOneAndUpdate(
      { email: trimmedEmail }, // Query to find the user
      {
        password: hashedPassword, // Update password
        resetOtp: null, // Clear OTP
        resetOtpExpireAt: null, // Clear OTP expiry
      },
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      return res.status(500).json({ error: "Password reset failed" });
    }

    res.status(200).json({ success: true, message: "Password reset successful" });

  } catch (error) {
    console.error("Password reset error:", error.message);
    res.status(500).json({ error: "Password reset failed" });
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