const Contact = require("../model/Contact");

// Fetch all messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a message by ID
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await Contact.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json({ success: "Message deleted successfully!" });
  } catch (error) {
    console.error("Error deleting message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    res.status(201).json({ success: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAllMessages, deleteMessage, createMessage };
