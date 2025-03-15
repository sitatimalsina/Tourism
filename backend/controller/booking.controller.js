const Booking = require("../model/Booking");



// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { packageId, userId, bookingDate, numberOfPeople } = req.body;
    
    const booking = await Booking.create({
      package: packageId,
      user: userId,
      bookingDate,
      numberOfPeople,
      status: "pending"
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("package user");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("package user");
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Confirm booking
const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      booking.status = "confirmed";
      const confirmedBooking = await booking.save();
      res.json(confirmedBooking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject booking
const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      booking.status = "rejected";
      const rejectedBooking = await booking.save();
      res.json(rejectedBooking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      booking.status = "cancelled";
      const cancelledBooking = await booking.save();
      res.json(cancelledBooking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Get notifications
const getNotifications = async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      status: { $in: ["confirmed", "rejected", "cancelled"] } 
    }).populate("package user");
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  confirmBooking,
  rejectBooking,
  cancelBooking,
  getNotifications,
  getAdminNotifications,
};
