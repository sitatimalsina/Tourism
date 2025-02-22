const express = require("express");
const router = express.Router();
const { getAllMessages, deleteMessage, createMessage } = require("../controller/contact.controller");

// Create a new message
router.post("/", createMessage); // Add route for creating a new message

// Fetch all messages
router.get("/", getAllMessages); // Fetch all messages

// Delete a message
router.delete("/:messageId", deleteMessage);

module.exports = router;
