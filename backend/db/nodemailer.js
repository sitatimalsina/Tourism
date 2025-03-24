import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Updated to Gmail SMTP server

  port: 587,
  auth: {
    user: process.env.EMAIL_USER, // Updated to use EMAIL_USER
    pass: process.env.EMAIL_PASS, // Updated to use EMAIL_PASS
  },

});

export default transporter;
