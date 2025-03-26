import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaUserFriends,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const UserBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 4;

  // Fetch Bookings
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings/", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) {
          toast.dismiss(); // Clear previous toasts before showing a new one
          throw new Error(data.error);
        }
        if (isMounted) setBookings(data);
      } catch (error) {
        toast.dismiss();
        toast.error(error.message); // Ensures only one error message at a time
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBookings();
    return () => {
      isMounted = false; // Cleanup function to prevent memory leaks
    };
  }, []);

  // Handle Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(`/api/bookings/cancel/${bookingId}`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.dismiss();
        throw new Error(data.error);
      }
      toast.dismiss();
      toast.success("Booking cancelled successfully!");
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: "cancelled" } : booking
        )
      );


    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
    }
  };

  // Handle Confirm Booking
  const handleConfirmBooking = async (bookingId) => {
    try {
      const res = await fetch(`/api/bookings/confirm/${bookingId}`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.dismiss();
        throw new Error(data.error);
      }
      toast.dismiss();
      toast.success("Booking confirmed successfully!");
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: "confirmed" } : booking
        )
      );
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
    }
  };

  // Sort Bookings by Date
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Pagination Logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">My Bookings</h2>
        {loading ? (
          <p className="text-center text-gray-600 mt-10">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">No bookings found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl text-sm"
                >
                  <h3 className="text-lg font-semibold text-teal-700 text-center">
                    {booking.package.packageName}
                  </h3>
                  <div className="mt-2 space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="text-teal-600" />{" "}
                      <strong>Booking Date:</strong>{" "}
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaUserFriends className="text-teal-600" />{" "}
                      <strong>People:</strong> {booking.numberOfPeople}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaClock className="text-blue-600" />{" "}
                      <strong>Booking Status:</strong>{" "}
                      <span
  className={
    booking.status === "Confirmed"
      ? "text-green-600"
      : booking.status === "Pending"
      ? "text-yellow-600"
      : "text-orange-600"
  }
>
  {booking.status}
</span>
                    </p>
                  </div>
                  
                  {booking.status !== "cancelled" && booking.status === "Pending" && (
                    <button
                      className="mt-3 w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      <FaTimesCircle /> Cancel Booking
                    </button>
                  )}
                  {booking.status === "cancelled" && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      This booking has been cancelled.
                    </p>
                  )}
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center space-x-4">
                <button
                  className={`px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm ${
                    currentPage === 1 && "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-sm font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className={`px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm ${
                    currentPage === totalPages && "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UserBookings;
