const Package = require("../model/Package");
const Destination = require("../model/Destination");

const createPackage = async (req, res) => {
  try {
    const { packageName, price, duration, description, destinations, itinerary } = req.body;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only" });
    }

    if (!packageName || !price || !duration || !description || !destinations || destinations.length === 0) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const parsedItinerary = JSON.parse(itinerary); // Convert JSON string to object

    const newPackage = new Package({
      packageName,
      price,
      duration,
      description,
      destinations,
      itinerary: parsedItinerary,
      photos: req.files.map(file => file.path),
      createdBy: req.user._id,
    });

    await newPackage.save();
    res.status(201).json({ success: "Package created successfully!", package: newPackage });

  } catch (error) {
    console.error("Error creating package:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate("destinations", "placeName location");
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPackageById = async (req, res) => {
  try {
    const { packageId } = req.params;
    const packageData = await Package.findById(packageId).populate("destinations", "placeName location");

    if (!packageData) {
      return res.status(404).json({ error: "Package not found" });
    }

    res.status(200).json(packageData);
  } catch (error) {
    console.error("Error fetching package:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { packageName, price, duration, description, destinations, itinerary } = req.body;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only" });
    }

    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return res.status(404).json({ error: "Package not found" });
    }

    packageData.packageName = packageName || packageData.packageName;
    packageData.price = price || packageData.price;
    packageData.duration = duration || packageData.duration;
    packageData.description = description || packageData.description;
    packageData.destinations = destinations || packageData.destinations;

    if (itinerary) {
      packageData.itinerary = JSON.parse(itinerary);
    }

    if (req.files.length > 0) {
      packageData.photos = req.files.map(file => file.path);
    }

    await packageData.save();
    res.status(200).json({ success: "Package updated successfully!", package: packageData });

  } catch (error) {
    console.error("Error updating package:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletePackage = async (req, res) => {
  try {
    const { packageId } = req.params;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only" });
    }

    const packageData = await Package.findByIdAndDelete(packageId);
    if (!packageData) {
      return res.status(404).json({ error: "Package not found" });
    }

    res.status(200).json({ success: "Package deleted successfully!" });

  } catch (error) {
    console.error("Error deleting package:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAdminPackage = async (req, res) => {
  try {
    const userId = req.user._id;
    if(!userId || req.user.role !== "admin") {

      return res.status(404).json({error: "Invalid request."});
    }
    const packageData = await Package.find({createdBy : userId}).populate("destinations", "placeName location");

    if (!packageData) {

      return res.status(404).json({error : "no package found"});
    }

    return res.status(200).json(packageData);

    

  } catch (error) {
    console.error("Error in admin package controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { createPackage, getAllPackages, getPackageById, updatePackage, deletePackage,getAdminPackage };
