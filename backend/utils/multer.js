
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

if (!cloudinary || !cloudinary.uploader) {
  throw new Error("Cloudinary is not properly configured. Check your API keys.");
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "destinations",
    allowed_formats: ["jpeg","jpg","png"],
  },
});

const upload = multer({ storage });

module.exports = upload;