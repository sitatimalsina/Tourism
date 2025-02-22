const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5, 
    index: true // Add an index for faster sorting
  },
  comment: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const DestinationSchema = new mongoose.Schema(
  {
    placeName: {
      type: String,
      required: [true, "Place name is required"],
    },
    location: {
      type: String,
      required: true,
    },
    photos: {
      type: [String], 
      required: true, 
    },
    reviews: {
      type: [ReviewSchema],
      default: [], // Explicitly set default to an empty array
    },
    information: {
      type: String,
      required: true, 
    },
    category: {
      type: String,
      enum: ["Mountains", "Wildlife", "Heritage", "Lakes", "Adventure"],
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

const Destination = mongoose.model("Destination", DestinationSchema);
module.exports = Destination;