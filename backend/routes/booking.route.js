const express = require("express");
const router = express.Router();
const { 
  createBooking, 
  getBookings, 
  getBookingById, 
  confirmBooking,
  rejectBooking,
  cancelBooking,
  deleteBooking,
} = require("../controller/booking.controller");

const { protectRoute } = require("../middleware/protectRoute");

// Create a new booking
router.post("/", protectRoute, createBooking);

// Get all bookings
router.get("/", protectRoute, getBookings);

// Get a single booking by ID
router.get("/:id", protectRoute, getBookingById);

// Confirm booking
router.put("/:id/confirm", protectRoute, confirmBooking);

// Reject booking
router.put("/:id/reject", protectRoute, rejectBooking);

// Cancel booking
router.put("/:id/cancel", protectRoute, cancelBooking);


// Delete a booking
router.delete("/:id", protectRoute, deleteBooking);

module.exports = router;
