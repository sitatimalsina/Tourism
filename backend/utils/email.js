const nodemailer = require("nodemailer");
require("dotenv").config();
const validator = require("validator");
// Create a transporter using Gmail's SMTP service
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Ensure this is set correctly
    pass: process.env.EMAIL_PASS, // Ensure this is set correctly
  }
});

// Function to send email

const sendEmail = async (mailOptions) => {
  const { from, to, subject, text } = mailOptions;

  // Validate recipient email
  if (!to || !validator.isEmail(to.trim())) {
    throw new Error("Invalid recipient email");
  }

  // Create transporter (Gmail example)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send email
  await transporter.sendMail({
    from: `Tourease <${from}>`,
    to: to.trim(), // Trim email
    subject,
    text,
  });
};

module.exports = sendEmail;
