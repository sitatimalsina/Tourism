const User = require('../model/User');
const bcrypt = require("bcryptjs");
const generateTokenAndSetCookie = require("../utils/generateToken");
const sendEmail = require('../utils/email'); // Import the email utility

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

// Save Preferences Function
const savePreference = async (req, res) => {
  try {
    const { interests } = req.body;

    // Validate preferences data
    if (!interests || !Array.isArray(interests)) {
      return res.status(400).json({ error: "Invalid preferences data" });
    }

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Update the user's preferences
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

// // Change Password Function
const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // Validate all required fields
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    // Compare the current password with the stored password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect current password." });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Use findOneAndUpdate() to update the password
    const updatedUser = await User.findOneAndUpdate(
      { email }, // The query to find the user
      { password: hashedPassword }, // The update to be applied
      { new: true } // Return the updated user object
    );

    if (!updatedUser) {
      return res.status(400).json({ error: "Failed to update the password." });
    }

    res.status(200).json({ success: "Password updated successfully!" });
  } catch (error) {
    console.error("Error in changing password:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// Export all functions
module.exports = {
  signup,
  login,
  logout,
  savePreference,
  changePassword,
};
