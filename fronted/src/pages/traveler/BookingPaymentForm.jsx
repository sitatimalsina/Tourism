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
  const [loading, setLoading] = useState(false); // Prevent multiple submissions
  const [formData, setFormData] = useState({
    userName: authUser.name,
    userEmail: authUser.email,
    userPhone: "",
    userAddress: "",
    numberOfPeople: 1,
    bookingDate: "",
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
    const { name, value } = e.target;

    // Phone number validation (must be 10 digits and start with 9)
    if (name === "userPhone") {
      const phoneRegex = /^9\d{9}$/; // Must start with 9 and have exactly 10 digits
      if (!phoneRegex.test(value)) {
        toast.error("Phone number must be 10 digits and start with 9");
        return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Booking Submission
  const handleBooking = async () => {
    // Prevent multiple clicks
    if (loading) return;
    setLoading(true);

    const today = new Date().toISOString().split("T")[0]; // Get today's date

    if (formData.bookingDate < today) {
      toast.error("Booking date cannot be in the past!");
      setLoading(false);
      return;
    }

    if (!formData.userPhone || !formData.userAddress || !formData.bookingDate) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending booking request", JSON.stringify({ ...formData, packageId }));
      
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, packageId }),
      });

      const data = await res.json();
      console.log("Response received", data);

      if (!res.ok) throw new Error(data.error);

      toast.success("Booking successful!");
      navigate("/my-bookings");
    } catch (error) {
      console.error("Booking error", error);
      toast.error(error.message);
    } finally {
      setLoading(false); // Enable button again
    }
  };

  // Show loading text while fetching package details
  if (!packageDetails) {
    return (
      <p className="text-center text-gray-600 mt-10">Loading package details...</p>
    );
  }

  // Calculate Total Price
  const totalPrice = packageDetails.price * formData.numberOfPeople;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-lg mx-auto px-6 py-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Book Now</h2>

      {/* Package Info */}
      <div className="border rounded-lg p-4 bg-gray-100">
        <h3 className="text-xl font-semibold">{packageDetails.packageName}</h3>
        <p className="text-gray-600">Duration: {packageDetails.duration}</p>
        <p className="text-gray-600">Price: ${packageDetails.price} per person</p>
        <p className="text-lg font-semibold text-gray-900 mt-2">Total Price: ${totalPrice}</p>
      </div>

      {/* User Inputs */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" name="userName" value={authUser.name} readOnly className="w-full p-2 border rounded-lg mt-1" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="userEmail" value={authUser.email} readOnly className="w-full p-2 border rounded-lg mt-1" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="text" name="userPhone" value={formData.userPhone} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input type="text" name="userAddress" value={formData.userAddress} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Booking Date</label>
          <input type="date" name="bookingDate" min={today} value={formData.bookingDate} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Number of People</label>
          <input type="number" name="numberOfPeople" min="1" value={formData.numberOfPeople} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" required />
        </div>
      </div>

      {/* Confirm Booking Button */}
      <button
        onClick={handleBooking}
        disabled={loading} // Disable while submitting
        className={`mt-6 px-6 py-3 text-white font-semibold rounded-lg transition w-full ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
        }`}
      >
        {loading ? "Processing..." : "Confirm Booking"}
      </button>
    </div>
  );
};

export default BookingPaymentForm;
