import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext"; // Import the AuthContext

const PackageDetails = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthContext();
  const isLoggedIn = !!authUser; // Check if the user is authenticated

  // Fetch Package Details
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const res = await fetch(`/api/packages/${packageId}`);
        if (!res.ok) throw new Error("Failed to fetch package details");

        const data = await res.json();
        setPackageDetails(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [packageId]);

  const handleBookNow = () => {
    if (!isLoggedIn) {
      navigate('/mode'); // Redirect to /mode if not logged in
    } else {
      navigate(`/book/${packageId}`); // Proceed to booking if logged in
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  }

  if (!packageDetails) {
    return <p className="text-center text-gray-600 mt-10">Package not found.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button className="mb-6 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all" onClick={() => navigate(-1)}>← Back</button>

      <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">{packageDetails.packageName}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packageDetails.photos.length > 0 ? (
          packageDetails.photos.map((photo, index) => (
            <img key={index} src={photo} alt={packageDetails.packageName} className="w-full h-72 object-cover rounded-lg shadow-lg" />
          ))
        ) : (
          <img src="/default-placeholder.jpg" alt="No image available" className="w-full h-72 object-cover rounded-lg shadow-lg" />
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-gray-900">Package Details</h3>
        <p className="text-gray-600"><strong>Duration:</strong> {packageDetails.duration}</p>
        <p className="text-gray-600"><strong>Price:</strong> ${packageDetails.price}</p>
        <p className="text-gray-700 leading-relaxed mt-2">{packageDetails.description}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-gray-900">Destinations</h3>
        <ul className="list-disc list-inside text-gray-700">
          {packageDetails.destinations.map((destination, index) => (
            <li key={index}>{destination.placeName} ({destination.location})</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">Itinerary</h3>
        {packageDetails.itinerary.length > 0 ? (
          packageDetails.itinerary.map((day, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm mb-3 bg-white">
              <h4 className="text-lg font-semibold text-gray-800">Day {day.day}: {day.title}</h4>
              <p className="text-gray-600">{day.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No itinerary available.</p>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleBookNow}
          className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default PackageDetails;
