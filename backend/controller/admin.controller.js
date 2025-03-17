const Booking = require("../model/Booking");
const Package = require("../model/Package");
const User = require("../model/User");
const Destination = require("../model/Destination");
const Contact = require("../model/Contact"); // Import the Contact model

// Fetch admin dashboard stats
const getAdminDashboardStats = async (req, res) => {
  try {
    // Validate user role
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only" });
    }

    // Fetch package IDs created by the logged-in admin
    const adminPackages = await Package.find({ createdBy: req.user._id }).select("_id");
    const packageIds = adminPackages.map(pkg => pkg._id);

    // If no packages exist, return default stats
    if (packageIds.length === 0) {
      return res.status(200).json({
        totalNumberOfPeople: 0,
        totalBookings: 0,
        totalRevenue: 0,
        canceledBookings: 0,
        totalCanceledPackages: 0,
        totalUsers: 0,
        totalDestinations: 0,
        totalPackages: 0,
        totalMessages: 0, // Default value for totalMessages
      });
    }

    // Use MongoDB aggregation with $facet to calculate multiple metrics in one query
    const stats = await Booking.aggregate([
      { $match: { package: { $in: packageIds } } },
      {
        $facet: {
          totalNumberOfPeople: [
            { $group: { _id: null, total: { $sum: "$numberOfPeople" } } }
          ],
          totalBookings: [
            { $count: "count" }
          ],
          totalRevenue: [
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, total: { $sum: "$amountPaid" } } }
          ],
          canceledBookings: [
            { $match: { status: "Cancelled" } },
            { $group: { _id: null, total: { $sum: 1 } } } // Count distinct canceled bookings

          ],
          totalCanceledPackages: [
            { $match: { status: "Cancelled" } }, // Updated to match the correct status
            { $count: "count" }
          ]
        }
      }
    ]);

    // Extract results from the aggregation
    const totalNumberOfPeople = stats[0].totalNumberOfPeople[0]?.total || 0;
    const totalBookings = stats[0].totalBookings[0]?.count || 0;
    const totalRevenue = stats[0].totalRevenue[0]?.total || 0;
    const canceledBookings = stats[0].canceledBookings[0]?.total || 0;
    const totalCanceledPackages = stats[0].totalCanceledPackages[0]?.count || 0;

    // Fetch additional stats
    const totalUsers = await User.countDocuments();
    const totalDestinations = await Destination.countDocuments();
    const totalPackages = await Package.countDocuments();

    // Fetch total messages (enquiries)
    const totalMessages = await Contact.countDocuments();

    // Return the calculated stats
    res.status(200).json({
      totalNumberOfPeople,
      totalBookings,
      totalRevenue,
      canceledBookings,
      totalCanceledPackages,
      totalUsers,
      totalDestinations,
      totalPackages,
      totalMessages, // Include totalMessages in the response
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAdminDashboardStats };
