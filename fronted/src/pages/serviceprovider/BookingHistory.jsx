import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import AdminHeader from "../../components/Admin/Header";
import toast from "react-hot-toast";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Fetch booking history from the server
  const fetchBookingHistory = async () => {
    try {
      console.log("Fetching booking history...");
      const res = await fetch(`/api/booking-history?search=${encodeURIComponent(searchTerm)}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Fetched booking history:", data);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching booking history:", error);
      toast.error(error.message || "Failed to fetch booking history");
    } finally {
      setLoading(false);
    }
  };

  // Format date into a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch booking history on component mount and when search term changes
  useEffect(() => {
    fetchBookingHistory();
  }, [searchTerm]);

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading booking history...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-gray-700 mb-6">Booking History</h1>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by user name, email, or package title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="bg-white p-4 shadow-lg rounded-lg overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-center">#</th> {/* Number column */}
                  <th className="p-3 text-center">UserName</th>
                  <th className="p-3 text-center">Email</th>
                  <th className="p-3 text-center">PhoneNo.</th>
                  <th className="p-3 text-center">Package</th>
                  <th className="p-3 text-center">Booking Date</th>
                  <th className="p-3 text-center">Number of People</th>
                  <th className="p-3 text-center">Booking Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-100">
                      <td className="p-3 text-center">{index + 1}</td> {/* Display row number */}
                      <td className="p-3 text-center">{booking.userName || "Unknown"}</td>
                      <td className="p-3 text-center">{booking.userEmail || "Unknown"}</td>
                      <td className="p-3 text-center">{booking.userPhone || "Unknown"}</td>
                      <td className="p-3 text-center">{booking.package?.packageName || "Unknown"}</td>
                      <td className="p-3 text-center">{formatDate(booking.bookingDate)}</td>
                      <td className="p-3 text-center">{booking.numberOfPeople}</td>
                      <td className="p-3 capitalize text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-white ${
                            booking.status === "Pending"
                              ? "bg-yellow-400"
                              : booking.status === "Confirmed"
                              ? "bg-green-500"
                      :booking.status ===  "Cancelled"

                              ? "bg-blue-500"
                              : "bg-red-500"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-3 text-gray-500">
                      No booking history found
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

export default BookingHistory;
