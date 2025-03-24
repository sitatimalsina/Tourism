// Load environment variables
require("dotenv").config();

// Core Modules
const path = require("path");

// Third-Party Modules
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

// Local Modules
const { connectDb } = require("./db/connectDB");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true 
}));
app.use(cookieParser());

// Serve Static Files (Move above middleware for better performance)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/api/', require("./routes/auth.route"));
app.use('/api/destinations', require("./routes/destination.route"));
app.use("/api/packages", require("./routes/package.route"));
app.use("/api/bookings", require("./routes/booking.route"));
app.use("/api/admin", require("./routes/admin.route"));
app.use("/api/users", require("./routes/user.route"));
app.use("/api/contact", require("./routes/contact.route"));
app.use("/api/booking-history", require("./routes/bookingHistory.route"));
app.use("/api/photos", require("./routes/photo.route"));

// Define Port
const port = process.env.PORT || 5000;

// Connect to Database & Start Server
const startServer = async () => {
    try {
        await connectDb();
        app.listen(port, () => console.log(`✅ Server running on port ${port}`));
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
