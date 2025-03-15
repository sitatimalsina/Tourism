import React from "react";
import { useNavigate } from "react-router-dom";
// Import icons from React Icons
import {
  FaTachometerAlt, // Dashboard
  FaUsers,         // Manage Users
  FaMapMarkerAlt,  // Manage Destinations
  FaCalendarCheck, // Manage Bookings
  FaHistory,       // Booking History
  FaBox,           // Manage Packages
  FaEnvelope,      // Manage Enquiry
  FaImages,        // Manage Photos
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <aside className="w-64 bg-teal-700 text-white h-full p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
     Admin Panel
      </h2>
      <nav className="flex flex-col space-y-4">
        {/* Dashboard */}
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="hover:bg-teal-600 p-2 rounded-lg flex items-center"
        >
          <FaTachometerAlt className="mr-2" /> Dashboard
        </button>

        {/* Manage Users */}
        <button
          onClick={() => navigate("/admin/userslist")}
          className="hover:bg-teal-600 p-2 rounded-lg flex items-center"
        >
          <FaUsers className="mr-2" /> Manage Users
        </button>

        {/* Manage Destinations */}
        <button
          onClick={() => navigate("/admin/destinations")}
          className="hover:bg-teal-600 p-2 rounded-lg flex items-center"
        >
          <FaMapMarkerAlt className="mr-2" /> Manage Destinations
        </button>

        {/* Manage Bookings */}
        <button
          onClick={() => navigate("/admin/bookings")}
          className="hover:bg-teal-600 p-2 rounded-lg flex items-center"
        >
          <FaCalendarCheck className="mr-2" /> Manage Bookings
        </button>

        {/* Booking History */}
        <button
          onClick={() => navigate("/admin/bookinghistory")}
          className="hover:bg-teal-600 p-2 rounded-lg flex items-center"
        >
          <FaHistory className="mr-2" /> Booking History
        </button>

        {/* Manage Packages */}
        <button
          onClick={() => navigate("/admin/package")}
          className="hover:bg-teal-600 p-2 rounded-lg flex items-center"
        >
          <FaBox className="mr-2" /> Manage Packages
        </button>

        {/* Manage Enquiry */}
        <button
          onClick={() => navigate("/admin/manage-messages")}
          className="hover:bg-teal-600 p-2 rounded-lg flex items-center"
        >
          <FaEnvelope className="mr-2" /> Manage Enquiry
        </button>

        {/* Manage Photos */}
        <button
          onClick={() => navigate("/admin/manage-photos")}
          className="hover:bg-teal-600 p-2 rounded-lg flex items-center"
        >
          <FaImages className="mr-2" /> Manage Photos
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;