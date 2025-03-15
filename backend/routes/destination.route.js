const express = require("express");
const router = express.Router();
const {
  addDestination,
  getAllDestinations,
  getAdminDestinations,
  getDestinationDetail,
  addReview,
  editDestination,
  deleteDestination,
  getHighestRatedReviews, // Import the function
} = require("../controller/destination.controller");

// Existing routes
router.post("/", addDestination);
router.get("/", getAllDestinations);
router.get("/admin", getAdminDestinations);
router.get("/:id", getDestinationDetail);
router.post("/:destinationId/reviews", addReview);
router.put("/:id", editDestination);
router.delete("/:id", deleteDestination);

// Get highest rated reviews
router.get("/highest-rated-reviews", getHighestRatedReviews);

module.exports = router;
