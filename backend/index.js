const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const { connectDb } = require("./db/connectDB");

const app = express();
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true 
}));
app.use(cookieParser());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/api/', require("./routes/auth.route"));
app.use('/api/destinations', require("./routes/destination.route"));
app.use("/api/packages", require("./routes/package.route"));
app.use("/api/bookings", require("./routes/booking.route"));
app.use("/api/payments", require("./routes/payment.route"));
app.use("/api/admin", require("./routes/admin.route")); // Admin routes
app.use("/api/users", require("./routes/user.route"));
app.use("/api/contact", require("./routes/contact.route"));
app.use("/api/booking-history", require("./routes/bookingHistory.route"));
app.use("/api/photos",require("./routes/photo.route"))

const port = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDb();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
