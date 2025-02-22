import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-teal-700 text-white h-full p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-4">
        <button onClick={() => navigate("/admin-dashboard")} className="hover:bg-teal-600 p-2 rounded-lg">
          Dashboard
        </button>
        <button onClick={() => navigate("/admin/userslist")} className="hover:bg-teal-600 p-2 rounded-lg">
          Manage Users
        </button>
        <button onClick={() => navigate("/admin/destinations")} className="hover:bg-teal-600 p-2 rounded-lg">
          Manage Destinations
        </button>
        <button onClick={() => navigate("/admin/bookings")} className="hover:bg-teal-600 p-2 rounded-lg">
          Manage Bookings
        </button>
        <button onClick={() => navigate("/admin/bookinghistory")} className="hover:bg-teal-600 p-2 rounded-lg">
          Booking History 
        </button>
        <button onClick={() => navigate("/admin/package")} className="hover:bg-teal-600 p-2 rounded-lg">
          Manage Packages
        </button>
        <button onClick={() => navigate("/admin/manage-messages")} className="hover:bg-teal-600 p-2 rounded-lg">
  Manage Enquiry
</button>
<button onClick={() => navigate("/admin/manage-photos")} className="hover:bg-teal-600 p-2 rounded-lg">
  Manage Photos
</button>
      </nav>
    </aside>
  );
};

export default Sidebar;