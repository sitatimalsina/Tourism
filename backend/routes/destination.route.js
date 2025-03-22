const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middleware/protectRoute");
const upload = require("../utils/multer");
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

router.post("/add", protectRoute, upload.array("pictures", 5), addDestination);
router.get("/", getAllDestinations);
router.get("/admin", protectRoute, getAdminDestinations);
router.get("/:id", protectRoute,getDestinationDetail);
router.post("/:destinationId/reviews", protectRoute, addReview);
router.put("/edit/:id", protectRoute, upload.array("photos", 5), editDestination);
router.delete("/:id", protectRoute, deleteDestination);
router.get("/highest-rated-reviews", getHighestRatedReviews);

module.exports = router;
