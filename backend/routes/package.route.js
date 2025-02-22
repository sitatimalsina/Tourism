const express = require("express");
const router = express.Router();
const { createPackage, getAllPackages, getPackageById, updatePackage, deletePackage, getAdminPackage } = require("../controller/package.contoller");
const { protectRoute } = require("../middleware/protectRoute");
const upload = require("../utils/multer");

router.get("/admin",protectRoute,getAdminPackage) ;

router.get("/", getAllPackages);
router.get("/:packageId", getPackageById); 

router.post("/", protectRoute, upload.array("photos", 5), createPackage); // Create a new package
router.put("/:packageId", protectRoute, upload.array("photos", 5), updatePackage); // Update package details
router.delete("/:packageId", protectRoute, deletePackage); // Delete a package

module.exports = router;