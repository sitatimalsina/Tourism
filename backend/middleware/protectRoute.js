const jwt = require("jsonwebtoken");
const User = require("../model/User");

const protectRoute = async (req, res, next) => {
  try {
const token = req.cookies.jwt; // Use consistent token retrieval

    if (!token) {
      return res.status(401).json({ error: "Not Authorized, Login Again" });

    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // Retrieve user info

    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid or expired token" });

  }
};

module.exports = { protectRoute };
