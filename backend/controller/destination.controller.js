const mongoose = require("mongoose"); // Add this line to import mongoose
const Destination = require("../model/Destination");
const User = require("../model/User"); // Assuming you have a User model

// Add a new destination
const addDestination = async (req, res) => {
  try {
    const { placeName, location, information, category } = req.body;
    const photos = req.files.map(file => file.path); // Extract uploaded photo paths
    const createdBy = req.user._id; // Assuming `req.user` contains the logged-in user's details

    const newDestination = new Destination({
      placeName,
      location,
      photos,
      information,
      category,
      createdBy,
    });

    await newDestination.save();
    res.status(201).json({ message: "Destination added successfully", destination: newDestination });
  } catch (error) {
    console.error("Error adding destination:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all destinations
const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().populate("createdBy", "name email");
    res.json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get admin-specific destinations (e.g., created by the logged-in admin)
const getAdminDestinations = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming `req.user` contains the logged-in user's details
    const destinations = await Destination.find({ createdBy: userId }).populate("createdBy", "name email");
    res.json(destinations);
  } catch (error) {
    console.error("Error fetching admin destinations:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get details of a specific destination by ID
const getDestinationDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid destination ID" });
    }

    const destination = await Destination.findById(id)
      .populate("reviews.user", "name") // Populate user details for reviews
      .populate("createdBy", "name email");

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json(destination);
  } catch (error) {
    console.error("Error fetching destination details:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Add a review to a destination
const addReview = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id; // Assuming `req.user` contains the logged-in user's details

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(destinationId)) {
      return res.status(400).json({ error: "Invalid destination ID" });
    }

    const destination = await Destination.findById(destinationId);

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    // Add the review
    destination.reviews.push({ user: userId, rating, comment });
    await destination.save();

    res.status(201).json({ message: "Review added successfully", destination });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Edit a destination
const editDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const photos = req.files ? req.files.map(file => file.path) : undefined;

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid destination ID" });
    }

    const destination = await Destination.findById(id);

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    // Update fields
    if (photos) updates.photos = photos;
    Object.assign(destination, updates);

    await destination.save();
    res.json({ message: "Destination updated successfully", destination });
  } catch (error) {
    console.error("Error editing destination:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a destination
const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid destination ID" });
    }

    const destination = await Destination.findByIdAndDelete(id);

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error("Error deleting destination:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get highest-rated reviews across all destinations
const getHighestRatedReviews = async (req, res) => {
  try {
    const topReviews = await Destination.aggregate([
      { $unwind: "$reviews" },
      { 
        $lookup: {
          from: "users",
          localField: "reviews.user",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          destinationName: "$placeName",
          rating: "$reviews.rating",
          comment: "$reviews.comment",
          createdAt: "$reviews.createdAt",
          user: {
            name: "$userDetails.name",
            email: "$userDetails.email"
          }
        }
      },
      { $sort: { rating: -1 } },
      { $limit: 4 }
    ]);

    res.status(200).json(topReviews);
  } catch (error) {
    console.error("Error fetching highest-rated reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  addDestination,
  getAllDestinations,
  getAdminDestinations,
  getDestinationDetail,
  addReview,
  editDestination,
  deleteDestination,
  getHighestRatedReviews,
};
