const express = require("express");
const router = express.Router();
const { createBooking, getUserBookings, getAdminNotifications, confirmBooking, getAdminBookings, cancelBooking, rejectBooking } = require("../controller/booking.controller");
const { processKhaltiPayment } = require("../controller/payment.controller"); // Import the Khalti payment handler
const { protectRoute } = require("../middleware/protectRoute");

// Existing routes
router.post("/create", protectRoute, createBooking);
router.get("/", protectRoute, getUserBookings);
router.put("/confirm/:bookingId", protectRoute, confirmBooking);
router.get("/admin", protectRoute, getAdminBookings);
router.get("/admin/notifications", protectRoute, getAdminNotifications);
router.put("/cancel/:bookingId", protectRoute, cancelBooking);
router.put("/reject/:bookingId", protectRoute, rejectBooking);

// Add Khalti payment processing route
router.post("/process-khalti", protectRoute, processKhaltiPayment); // Handle Khalti payment response

module.exports = router;