import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import AdminHeader from "../../components/Admin/Header";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";

const ManageDestinations = () => {
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // State for search input
    const { authUser } = useAuthContext();

    // Fetch destinations from the server
    const fetchDestinations = useCallback(async () => {
        try {
            if (!authUser || authUser.role !== "admin") {
                navigate("/service-provider-login");
                return;
            }
            console.log("Fetching destinations...");
            const res = await fetch(`/api/destinations?search=${encodeURIComponent(searchTerm)}`, { 
                credentials: "include" 
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            console.log("Fetched destinations:", data);
            if (!Array.isArray(data)) {
                throw new Error("Invalid data format received from server");
            }
            setDestinations(data);
        } catch (error) {
            console.error("Error fetching destinations:", error);
            toast.error(error.message || "Failed to fetch destinations");
        } finally {
            setLoading(false);
        }
    }, [authUser, navigate, searchTerm]); // Add searchTerm as a dependency

    // Fetch destinations on component mount and when search term changes
    useEffect(() => {
        fetchDestinations();
    }, [fetchDestinations]);

    // Handle destination deletion
    const handleDelete = async (id) => {
        if (!id) {
            toast.error("Invalid destination ID");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this destination?")) return;
        try {
            console.log(`Attempting to delete destination with ID: ${id}`);
            const res = await fetch(`/api/destinations/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) {
                throw new Error(`Failed to delete destination. Status: ${res.status}`);
            }
            // Optimistic update
            setDestinations(prev => {
                const updatedDestinations = prev.filter(dest => dest._id !== id);
                if (updatedDestinations.length === 0) {
                    fetchDestinations(); // Refresh if all items are deleted
                }
                return updatedDestinations;
            });
            
            toast.success("Destination deleted successfully!");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error.message || "Error deleting destination");
            fetchDestinations(); // Refresh on error to maintain consistency
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600">Loading destinations...</p>
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
                        <h1 className="text-2xl font-semibold text-gray-700">Manage Destinations</h1>
                        <div className="flex gap-4">
                            {/* Search Bar */}
                            <input
                                type="text"
                                placeholder="Search destinations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                            />
                            {/* Add Destination Button */}
                            <button
                                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
                                onClick={() => navigate("/admin/add-destination")}
                            >
                                + Add Destination
                            </button>
                        </div>
                    </div>
                    <div className="bg-white p-4 shadow-lg rounded-lg overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-3 text-left">Place Name</th>
                                    <th className="p-3 text-left">Location</th>
                                    <th className="p-3 text-left">Category</th>
                                    <th className="p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {destinations.length > 0 ? (
                                    destinations.map((destination) => {
                                        if (!destination._id) {
                                            console.error("Destination missing ID:", destination);
                                            return null;
                                        }
                                        return (
                                            <tr key={destination._id} className="border-b hover:bg-gray-100">
                                                <td className="p-3">{destination.placeName}</td>
                                                <td className="p-3">{destination.location}</td>
                                                <td className="p-3 capitalize">{destination.category}</td>
                                                <td className="p-3 flex gap-4">
                                                    <button
                                                        onClick={() => {
                                                            if (!destination._id) {
                                                                toast.error("Invalid destination ID");
                                                                return;
                                                            }
                                                            navigate(`/admin/edit-destination/${destination._id}`);
                                                        }}
                                                        className="px-3 py-1 text-blue-600 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(destination._id)}
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
                                            No destinations found
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

export default ManageDestinations;