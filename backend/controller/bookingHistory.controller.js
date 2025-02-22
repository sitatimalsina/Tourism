const Booking = require("../model/Booking");
const Package = require("../model/Package");

// Fetch booking history with optional search
const getBookingHistory = async (req, res) => {
  try {
    const { search } = req.query;

    // Build a query object for filtering
    const query = {};
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: "i" } }, // Case-insensitive search by user name
        { userEmail: { $regex: search, $options: "i" } }, // Case-insensitive search by email
        { "package.title": { $regex: search, $options: "i" } }, // Case-insensitive search by package title
      ];
    }

    // Fetch bookings and populate the package field
    const bookings = await Booking.find(query)
      .populate("package", "title") // Populate only the `title` field of the package
      .lean(); // Optional: Convert documents to plain JavaScript objects

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching booking history:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getBookingHistory };