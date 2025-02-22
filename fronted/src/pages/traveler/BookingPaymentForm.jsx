import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";

const BookingPaymentForm = () => {
  const { authUser } = useAuthContext();
  const { packageId } = useParams();
  const navigate = useNavigate();

  // State for package details and form data
  const [packageDetails, setPackageDetails] = useState(null);
  const [formData, setFormData] = useState({
    userName: authUser.name,
    userEmail: authUser.email,
    userPhone: "",
    userAddress: "",
    numberOfPeople: 1,
    bookingDate: "", // This will store the selected date
  });

  // Fetch Package Details
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`/api/packages/${packageId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setPackageDetails(data);
      } catch (error) {
        toast.error(error.message);
        navigate("/packages");
      }
    };
    fetchPackage();
  }, [packageId, navigate]);

  // Handle Form Input Changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Booking Submission
  const handleBooking = async () => {
    // Validate that the selected date is not in the past
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    if (formData.bookingDate < today) {
      toast.error("Booking date cannot be in the past!");
      return;
    }

    // Validate that all fields are filled
    if (
      !formData.userName ||
      !formData.userEmail ||
      !formData.userPhone ||
      !formData.userAddress ||
      !formData.bookingDate
    ) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, packageId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Booking successful!");
      navigate("/my-bookings");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Loading State
  if (!packageDetails) {
    return (
      <p className="text-center text-gray-600 mt-10">
        Loading package details...
      </p>
    );
  }

  // Calculate Total Price
  const totalPrice = packageDetails.price * formData.numberOfPeople;

  // Get Today's Date for Min Attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-lg mx-auto px-6 py-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Book Now</h2>

      {/* ✅ Package Info */}
      <div className="border rounded-lg p-4 bg-gray-100">
        <h3 className="text-xl font-semibold">
          {packageDetails?.packageName || "Loading Package Name..."}
        </h3>
        <p className="text-gray-600">
          Duration: {packageDetails?.duration || "Loading Duration..."}
        </p>
        <p className="text-gray-600">
          Price: $
          {packageDetails?.price ? packageDetails.price : "Loading Price..."}{" "}
          per person
        </p>
        <p className="text-lg font-semibold text-gray-900 mt-2">
          Total Price: ${totalPrice ? totalPrice : "Calculating Total Price..."}
        </p>
      </div>

      {/* ✅ User Inputs */}
      <div className="mt-6 space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="userName"
            value={authUser.name}
            readOnly
            className="w-full p-2 border rounded-lg mt-1"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="userEmail"
            value={authUser.email}
            readOnly
            className="w-full p-2 border rounded-lg mt-1"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="userPhone"
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg mt-1"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="userAddress"
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg mt-1"
            required
          />
        </div>

        {/* Booking Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Booking Date
          </label>
          <input
            type="date"
            name="bookingDate"
            min={today} // Restrict selection to today or future dates
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg mt-1"
            required
          />
        </div>

        {/* Number of People */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Number of People
          </label>
          <input
            type="number"
            name="numberOfPeople"
            min="1"
            value={formData.numberOfPeople}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg mt-1"
            required
          />
        </div>
      </div>

      {/* ✅ Confirm Booking Button */}
      <button
        onClick={handleBooking}
        className="mt-6 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition w-full"
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingPaymentForm;