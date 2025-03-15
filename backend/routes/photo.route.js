const express = require("express");
const router = express.Router();
const Photo = require("../model/Photo");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const { uploadPhoto, getPhotos, deletePhoto } = require("../controller/photo.controller");

const { protectRoute } = require("../middleware/protectRoute");

// Upload photo
router.post("/upload", upload.single("image"), uploadPhoto);

// Get all photos
router.get("/", getPhotos);

// Delete photo
router.delete("/:id", deletePhoto);


module.exports = router;
