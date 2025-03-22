const jwt = require("jsonwebtoken");
const User = require("../model/User");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; 
    if (!token) {
      return res.status(401).json({ error: "Access denied. Please login." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); 
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

module.exports = { protectRoute };