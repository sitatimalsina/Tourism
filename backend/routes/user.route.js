const express = require("express");
const router = express.Router();
const { getUsers, getUserById, deleteUser } = require("../controller/user.controller");

// Fetch all users (admin only)
router.get("/", getUsers);

// Fetch a single user by ID
router.get("/:id", getUserById);

// Delete a user by ID
router.delete("/:id", deleteUser);

module.exports = router;