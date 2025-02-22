const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  activityPhotos: {
    type: [String], 
  },
});

const PackageSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: [true, "Package name is required"],
    },
    price: {
      type: Number,
      required: [true, "Package price is required"],
      min: 0,
    },
    duration: {
      type: String, 
      required: [true, "Package duration is required"],
    },
    description: {
      type: String,
      required: [true, "Package description is required"],
    },
    destinations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Destination",
        required: true,
      },
    ],
    itinerary: [ItinerarySchema], 
    photos: {
      type: [String], 
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", PackageSchema);
module.exports = Package;