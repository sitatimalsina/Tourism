const Booking = require("../model/Booking");
const Package = require("../model/Package");
const crypto = require("crypto");
const sendEmail = require('../utils/email'); // Import the email utility

// Function to send confirmation email
const sendConfirmationEmail = async (booking) => {
  const message = `Dear ${booking.userName}, your booking has been confirmed for the date ${booking.bookingDate}. Please visit the office for further details.`;
  await sendEmail(booking.userEmail, "Booking Confirmed", message);
};

// Function to send rejection email
const sendRejectionEmail = async (booking) => {
  const message = `Dear ${booking.userName}, your booking for ${booking.package?.packageName || "the package"} has been rejected as the package is currently unavailable.`;
  await sendEmail(booking.userEmail, "Booking Rejected", message);
};

const createBooking = async (req, res) => {
  try {
    const { packageId, numberOfPeople, bookingDate, userName, userEmail, userPhone, userAddress } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. Please login." });
    }

    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return res.status(404).json({ error: "Package not found" });
    }

    const totalAmount = packageData.price * numberOfPeople;
    const transactionId = crypto.randomBytes(8).toString("hex");

    const newBooking = new Booking({
      user: req.user._id,
      package: packageId,
      numberOfPeople,
      bookingDate,
      userName,
      userEmail,
      userPhone,
      userAddress,
      amountPaid: totalAmount,
      paymentStatus: "pending",
      transactionId,
    });

    await newBooking.save();

    res.status(201).json({ success: "Booking created!", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("package", "packageName price duration");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAdminBookings = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only" });
    }

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate({
        path: "package",
        match: { createdBy: req.user._id },
        select: "packageName price",
      });

    const filteredBookings = bookings.filter((b) => b.package !== null);
    res.status(200).json(filteredBookings);
  } catch (error) {
    console.error("Error fetching admin bookings:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const rejectBooking = async (req, res) => {
  try {
    // Ensure only admins can reject bookings
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only" });
    }

    const { bookingId } = req.params;

    // Find the booking and populate the package details
    const booking = await Booking.findById(bookingId).populate("package", "packageName");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update booking status to "Rejected"
    booking.status = "Rejected";
    await booking.save();

    // Send rejection email to the user
    try {
      await sendRejectionEmail(booking);
    } catch (emailError) {
      console.error("Error sending rejection email:", emailError.message);
      // Log the error but do not fail the entire process
    }

    res.status(200).json({ success: "Booking rejected and notification sent.", booking });
  } catch (error) {
    console.error("Error rejecting booking:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
const confirmBooking = async (req, res) => {
  try {
    // Ensure only admins can confirm bookings
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only" });
    }

    const { bookingId } = req.params;

    // Find the booking and populate the package details
    const booking = await Booking.findById(bookingId).populate("package", "packageName");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update booking status to "Confirmed"
    booking.status = "Confirmed";
    await booking.save();

    // Send confirmation email to the user
    try {
      await sendConfirmationEmail(booking);
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError.message);
      // Log the error but do not fail the entire process
    }

    res.status(200).json({ success: "Booking confirmed successfully!", booking });
  } catch (error) {
    console.error("Error confirming booking:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAdminNotifications = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only" });
    }

    const notifications = await Booking.find({ status: "pending" })
      .populate("user", "name email")
      .populate("package", "packageName");

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Fixed cancelBooking function
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id; // Assuming authentication middleware sets req.user

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Ensure the logged-in user is the owner of the booking
    if (booking.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to cancel this booking" });
    }

    // Only allow canceling if the booking is still pending
    if (booking.status !== "Pending") {
      return res.status(400).json({ error: "Only pending bookings can be canceled" });
    }

    // Update status to "Cancelled"
    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking has been canceled successfully" });
  } catch (error) {
    console.error("Error canceling booking:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createBooking ,getUserBookings, getAdminBookings, confirmBooking, getAdminNotifications,cancelBooking,rejectBooking };
