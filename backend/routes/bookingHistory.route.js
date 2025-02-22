const express = require("express");
const router = express.Router();
const { getBookingHistory } = require("../controller/bookingHistory.controller");

// Fetch booking history
router.get("/", getBookingHistory);

module.exports = router;