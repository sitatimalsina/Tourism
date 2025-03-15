import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";

const BookingPaymentForm = () => {
  const {authUser} = useAuthContext();
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [packageDetails, setPackageDetails] = useState(null);
  const [formData, setFormData] = useState({
    userName: authUser.name,
    userEmail: authUser.email,
    userPhone: "",
    userAddress: "",
    numberOfPeople: 1,
    bookingDate: "",
  });
  const [otp, setOtp] = useState("");
  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    // ✅ Fetch Package Details
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookingAndPayment = async () => {
    if (!formData.userName || !formData.userEmail || !formData.userPhone || !formData.userAddress || !formData.bookingDate) {
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

      setTransactionId(data.booking.transactionId);
      toast.success("Booking created! Enter OTP to confirm payment.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      const res = await fetch(`/api/payments/complete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Payment successful! Your booking is confirmed.");
      navigate("/my-bookings");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!packageDetails) {
    return <p className="text-center text-gray-600 mt-10">Loading package details...</p>;
  }

  const totalPrice = packageDetails.price * formData.numberOfPeople;

  return (
    <div className="max-w-lg mx-auto px-6 py-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Book & Pay</h2>

      {/* ✅ Package Info */}
      <div className="border rounded-lg p-4 bg-gray-100">
        <h3 className="text-xl font-semibold">{packageDetails.packageName}</h3>
        <p className="text-gray-600">Duration: {packageDetails.duration}</p>
        <p className="text-gray-600">Price: ${packageDetails.price} per person</p>
        <p className="text-lg font-semibold text-gray-900 mt-2">Total Price: ${totalPrice}</p>
      </div>

      {/* ✅ User Inputs */}
      <input type="text" name="userName" placeholder="Full Name" value={authUser.name} readOnly className="w-full p-2 border rounded-lg mt-4" required />
      <input type="email" name="userEmail" placeholder="Email" value={authUser.email} readOnly className="w-full p-2 border rounded-lg mt-4" required />
      <input type="text" name="userPhone" placeholder="Phone Number" onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-4" required />
      <input type="text" name="userAddress" placeholder="Address" onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-4" required />
      <input type="date" name="bookingDate" onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-4" required />
      <input type="number" name="numberOfPeople" min="1" value={formData.numberOfPeople} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-4" required />

      {/* ✅ Confirm Booking Button */}
      {!transactionId ? (
        <button
          onClick={handleBookingAndPayment}
          className="mt-4 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition w-full"
        >
          Confirm Booking & Generate Payment
        </button>
      ) : (
        <>
          {/* ✅ OTP Input */}
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold">Enter OTP (123456 for test)</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded-lg mt-2"
              required
            />
          </div>

          {/* ✅ Confirm Payment Button */}
          <button
            onClick={handleConfirmPayment}
            className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-full"
          >
            Confirm Payment
          </button>
        </>
      )}
    </div>
  );
};

export default BookingPaymentForm;