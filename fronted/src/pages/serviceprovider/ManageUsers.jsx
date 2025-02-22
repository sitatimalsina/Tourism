import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import AdminHeader from "../../components/Admin/Header";
import toast from "react-hot-toast";

const ManageUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch users from the server
    const fetchUsers = useCallback(async () => {
        try {
            console.log("Fetching users...");
            const res = await fetch(`/api/users?search=${encodeURIComponent(searchTerm)}`, {
                credentials: "include"
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            console.log("Fetched users:", data);
            if (!Array.isArray(data)) {
                throw new Error("Invalid data format received from server");
            }
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(error.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    // Fetch users on component mount and when search term changes
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Handle user deletion
    const handleDelete = async (id) => {
        if (!id) {
            toast.error("Invalid user ID");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            console.log(`Attempting to delete user with ID: ${id}`);
            const res = await fetch(`/api/users/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to delete user");
            }

            // Optimistic update
            setUsers((prev) => prev.filter((user) => user._id !== id));
            toast.success("User deleted successfully!");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error.message || "Error deleting user");
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600">Loading users...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <AdminHeader />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-700">Manage Users</h1>
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                        />
                    </div>
                    <div className="bg-white p-4 shadow-lg rounded-lg overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-3 text-left">Name</th>
                                    <th className="p-3 text-left">Email</th>
                                    <th className="p-3 text-left">Role</th>
                                    <th className="p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => {
                                        if (!user._id) {
                                            console.error("User missing ID:", user);
                                            return null;
                                        }
                                        return (
                                            <tr key={user._id} className="border-b hover:bg-gray-100">
                                                <td className="p-3">{user.name}</td>
                                                <td className="p-3">{user.email}</td>
                                                <td className="p-3 capitalize">{user.role}</td>
                                                <td className="p-3 flex gap-4">
                                                    
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        className="px-3 py-1 text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center p-3 text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManageUsers;