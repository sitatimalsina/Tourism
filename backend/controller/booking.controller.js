const Booking = require("../model/Booking");
const Package = require("../model/Package");
const axios = require("axios");

// Create Booking (with Khalti payment logic)
const createBooking = async (req, res) => {
  try {
    const { packageId, numberOfPeople, bookingDate, userName, userEmail, userPhone, userAddress, paymentMethod } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. Please login." });
    }

    // Check if booking date is in the past
    const currentDate = new Date();
    const selectedDate = new Date(bookingDate);
    if (selectedDate < currentDate) {
      return res.status(400).json({ error: "Booking date cannot be in the past." });
    }

    // Fetch package details
    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Calculate total price based on the number of people
    const totalPrice = packageData.price * numberOfPeople;

    // Create a new booking
    const newBooking = new Booking({
      transactionId: paymentMethod === "khalti" ? "generated-transaction-id" : null, // Set transactionId based on payment method


      user: req.user._id,
      package: packageId,
      numberOfPeople,
      bookingDate,
      userName,
      userEmail,
      userPhone,
      userAddress,
      amountPaid: paymentMethod === "khalti" ? 0 : totalPrice, // Set amountPaid if using cash
      status: "pending",
      paymentMethod,
      paymentStatus: paymentMethod === "khalti" ? "pending" : "paid", // Mark as paid for cash payments
    });

    await newBooking.save();
    
    // No need to assign transactionId here as it's already set during booking creation



    // If payment method is Khalti, return Khalti payload for frontend integration
    if (paymentMethod === "khalti") {
      const khaltiPayload = {
        return_url: `${process.env.FRONTEND_URL}/payment-response`, // Redirect URL after payment
        website_url: process.env.FRONTEND_URL,
        purchase_order_id: newBooking._id.toString(),
        purchase_order_name: packageData.packageName,
        amount: totalPrice * 100, // Amount in paisa (Khalti requires this format)
        customer_info: {
          name: userName,
          email: userEmail,
          phone: userPhone,
        },
      };

      return res.status(201).json({
        success: "Booking created! Redirecting to Khalti...",
        booking: newBooking,
        khaltiPayload,
      });
    }

    // For cash payments, confirm the booking immediately
    res.status(201).json({ success: "Booking created!", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get User's Bookings
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

// Get All Bookings (Admin)
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

// Confirm Booking
const confirmBooking = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only" });
    }

    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update booking status
    booking.status = "confirmed";
    await booking.save();

    res.status(200).json({ success: "Booking confirmed successfully!", booking });
  } catch (error) {
    console.error("Error confirming booking:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reject Booking (Admin)
const rejectBooking = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only" });
    }

    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate("package", "packageName");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update booking status
    booking.status = "rejected";
    await booking.save();

    // Simulate sending a rejection message
    const message = `Dear ${booking.userName}, your booking for ${booking.package?.packageName || "the package"} has been rejected as the package is currently unavailable.`;
    console.log(`Sent message to ${booking.userEmail}: ${message}`);

    res.status(200).json({ success: "Booking rejected and message sent.", booking });
  } catch (error) {
    console.error("Error rejecting booking:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Cancel Booking (User)
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Only allow cancellation if booking is pending
    if (booking.status !== "pending") {
      return res.status(400).json({ error: "Booking can only be cancelled while pending" });
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ success: "Booking cancelled successfully!", booking });
  } catch (error) {
    console.error("Error cancelling booking:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin Notifications (Ensure this function is properly defined)
const getAdminNotifications = async (req, res) => {
  try {
    // Logic for fetching admin notifications
    res.status(200).json({ notifications: [] }); // Example response
  } catch (error) {
    console.error("Error fetching admin notifications:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Process Khalti Payment Response
const processKhaltiPayment = async (req, res) => {
  try {
    const { pidx } = req.body;

    // Verify the payment with Khalti
    const khaltiResponse = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { status, transaction_id, total_amount } = khaltiResponse.data;

    if (status === "Completed") {
      // Find the booking associated with the transaction ID
      const booking = await Booking.findOne({ _id: transaction_id });

      if (!booking) {
        return res.status(404).json({ error: "Booking not found for the given transaction ID" });
      }

      // Update the booking and payment status
      booking.paymentStatus = "paid";
      booking.status = "confirmed";
      booking.paymentDetails = { transaction_id, total_amount }; // Store Khalti's response
      await booking.save();

      return res.status(200).json({ success: "Payment confirmed successfully!", booking });
    } else {
      return res.status(400).json({ error: "Payment failed or was not completed" });
    }
  } catch (error) {
    console.error("Error processing Khalti payment:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAdminBookings,
  confirmBooking,
  rejectBooking,
  cancelBooking,
  getAdminNotifications,
  processKhaltiPayment, // Add the new function here
};
