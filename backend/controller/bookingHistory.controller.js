const Booking = require("../model/Booking");
const Package = require("../model/Package");


const getBookingHistory = async (req, res) => {
  try {
    const { search } = req.query;

    // Build a query object for filtering
    const query = {};
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } }, 
        { "package.name": { $regex: search, $options: "i" } }, 
      ];
    }

    const bookings = await Booking.find(query)
      .populate("package", "packageName") 
      .lean(); 

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching booking history:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getBookingHistory };