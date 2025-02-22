const User = require("../model/User"); // Import your User model

// Fetch all users with optional search
const getUsers = async (req, res) => {
    try {
        const { search } = req.query;

        // Build a query object for filtering
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } }
            ];
        }

        // Fetch users from the database
        const users = await User.find(query);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Fetch a single user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the user from the database
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user
        await User.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getUsers, getUserById, deleteUser };