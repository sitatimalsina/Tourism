const express = require("express");
const router = express.Router();
const { 
  addDestination, 
  getAllDestinations, 
  addReview,
  getAdminDestinations, 
  getDestinationDetail,
  editDestination,
  deleteDestination,
  getHighestRatedReviews 
} = require("../controller/destination.controller");
const { protectRoute } = require("../middleware/protectRoute");
const upload = require("../utils/multer");

router.post("/add", protectRoute, upload.array("pictures", 5), addDestination);
router.get("/", getAllDestinations);
router.get("/admin", protectRoute, getAdminDestinations);

router.get("/:id", getDestinationDetail);
router.post("/:destinationId/reviews", protectRoute, addReview);
router.put("/edit/:id", protectRoute, upload.array("photos", 5), editDestination);
router.delete("/:id", protectRoute, deleteDestination);
router.get("/highest-rated-reviews", getHighestRatedReviews); // Route for highest-rated reviews

module.exports = router;