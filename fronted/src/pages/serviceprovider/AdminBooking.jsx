import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminHeader from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 8;

  // Fetch Bookings and Notifications
  useEffect(() => {
    fetchBookings();
    fetchNotifications();
  }, []);

const fetchBookings = async () => {
  console.log("Fetching bookings..."); // Debugging line to check if the function is called

    try {
      const res = await fetch("/api/bookings/admin", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch bookings");
      setBookings(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

const fetchNotifications = async () => {
  

    try {
      const res = await fetch("/api/bookings/admin/notifications", { credentials: "include" }); // Ensure this endpoint is correct

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch notifications");
      setNotifications(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Confirm Booking
  const [isConfirming, setIsConfirming] = useState(false);
  const handleConfirmBooking = async (bookingId) => {
    setIsConfirming(true);
    try {
      const res = await fetch(`/api/bookings/confirm/${bookingId}`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to confirm booking");
      toast.success("Booking confirmed successfully!");
      fetchBookings(); // Refresh bookings list
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsConfirming(false);
    }
  };

  // Reject Booking
  const [isRejecting, setIsRejecting] = useState(false);
const handleRejectBooking = async (bookingId) => {
    setIsRejecting(true);

    setIsRejecting(true);
    try {
      const res = await fetch(`/api/bookings/reject/${bookingId}`, {

        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reject booking");
      toast.success("Booking rejected successfully!");
      fetchBookings(); // Refresh bookings list
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsRejecting(false);
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

  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Manage Bookings</h2>

          {/* Notifications Section */}
          {notifications.length > 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800">New Notifications</h3>
              {notifications.map((notification) => (
                <p key={notification._id} className="text-gray-700">
                  <strong>{notification.user?.name}</strong> has booked{" "}
                  <strong>{notification.package?.packageName}</strong>
                </p>
              ))}
            </div>
          )}

          {/* Bookings List */}
          {currentBookings.length === 0 ? (
            <p className="text-gray-600 text-center">No bookings found.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentBookings.map((booking) => (
                <div key={booking._id} className="bg-white p-5 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold">{booking.package?.packageName}</h3>
                  <p className="text-gray-600">Booked by: {booking.user?.name}</p>
                  <p className="text-gray-600">
                    Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">People: {booking.numberOfPeople}</p>
                  <p className="text-gray-600">Total Price: ${booking.amountPaid}</p>
                  <p
                    className={`mt-2 font-semibold ${
                      booking.status === "confirmed" ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    Booking Status: {booking.status}
                  </p>

                  {/* Action Buttons */}
                  {booking.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleConfirmBooking(booking._id)}
                        disabled={isConfirming}
                        className={`mt-4 px-4 py-2 ${
                          isConfirming
                            ? "bg-teal-400 cursor-wait"
                            : "bg-teal-600 hover:bg-teal-700"
                        } text-white rounded-lg transition flex items-center justify-center w-full`}
                      >
                        {isConfirming ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Confirming...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </button>

                      <button
                        onClick={() => handleRejectBooking(booking._id)}
                        disabled={isRejecting}
                        className={`mt-4 px-4 py-2 ${
                          isRejecting
                            ? "bg-red-400 cursor-wait"
                            : "bg-red-600 hover:bg-red-700"
                        } text-white rounded-lg transition flex items-center justify-center w-full`}
                      >
                        {isRejecting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Rejecting...
                          </>
                        ) : (
                          "Reject Booking"
                        )}
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {bookings.length > bookingsPerPage && (
            <div className="mt-6 flex justify-center space-x-3">
              <button
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-lg font-semibold text-gray-700">
                Page {currentPage} of {Math.ceil(bookings.length / bookingsPerPage)}
              </span>
              <button
                className={`px-4 py-2 rounded-lg ${
                  indexOfLastBooking >= bookings.length
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
                onClick={() =>
                  setCurrentPage((prev) =>
                    indexOfLastBooking < bookings.length ? prev + 1 : prev
                  )
                }
                disabled={indexOfLastBooking >= bookings.length}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminBookings;
