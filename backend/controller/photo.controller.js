const Photo = require("../model/Photo");
const cloudinary = require("../utils/cloudinary");

// Upload and Store Image URL
const uploadPhoto = async (req, res) => {
  try {
    console.log("Received upload request");
    console.log("File:", req.file);
    console.log("Title:", req.body.title);

    // Upload image to Cloudinary
    console.log("Uploading to Cloudinary...");
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "photos",
    });
    console.log("Cloudinary upload successful:", result);

    // Create new photo with Cloudinary URL
    const newPhoto = new Photo({
      url: result.secure_url,
      title: req.body.title,
    });
    await newPhoto.save();
    console.log("Saving to MongoDB:", newPhoto);

    res.json({ message: "Photo added successfully!", photo: newPhoto });
  } catch (error) {
    console.error("Upload error:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      error: "Failed to upload photo",
      details: error.message,
    });
  }
};

// Get All Photos from MongoDB
const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find();
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Photo
const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the photo by ID
    const photo = await Photo.findById(id);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Extract public_id from Cloudinary URL
    const publicId = photo.url.split("/").pop().split(".")[0];

    // Delete the photo from Cloudinary
    await cloudinary.uploader.destroy(`photos/${publicId}`);

    // Delete the photo from MongoDB
    await Photo.findByIdAndDelete(id);

    res.json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      error: "Failed to delete photo",
      details: error.message,
    });
  }
};

// Export all controller functions
module.exports = {
  uploadPhoto,
  getPhotos,
  deletePhoto,
};