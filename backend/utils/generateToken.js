const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "Strict",
    maxAge: 1 * 60 * 60 * 1000,
  });

  return token;
};

module.exports = generateTokenAndSetCookie;