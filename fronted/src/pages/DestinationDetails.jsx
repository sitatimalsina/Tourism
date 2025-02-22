import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AddReview from "../components/AddReview";
import ReviewCard from "../components/HighestRatedReviews";

import Header from "../components/Header";
import Footer from "../components/Footer";

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [relatedPackages, setRelatedPackages] = useState([]);
  const [highestRatedReview, setHighestRatedReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await fetch(`/api/destinations/${id}`);
        if (!res.ok) {
          if (res.status === 400 || res.status === 404) {
            setError("Invalid destination ID");
            return;
          }
          throw new Error("Failed to fetch destination details");
        }

        const data = await res.json();
        setDestination(data);
        fetchRelatedPackages(data.placeName);
        
        // Fetch highest rated review
        const reviewRes = await fetch(`/api/destinations/${id}/highest-rated-review`);
        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          setHighestRatedReview(reviewData);
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }

    };

    fetchDestination();
  }, [id, navigate]);

  const fetchRelatedPackages = async (destinationName) => {
    try {
      const res = await fetch(`/api/packages`);
      if (!res.ok) throw new Error("Failed to fetch related packages");

      const data = await res.json();
      const matchingPackages = data.filter((pkg) =>
        pkg.destinations.some((dest) => dest.placeName === destinationName)
      );

      setRelatedPackages(matchingPackages);
    } catch (error) {
      console.error("Error fetching related packages:", error.message);
    }
  };

  const handleReviewAdded = (updatedDestination) => {
    setDestination(updatedDestination);
  };

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/destinations')}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all"
            >
              Browse Destinations
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return <p className="text-center text-gray-600 mt-10">Destination not found.</p>;
  }



  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow max-w-6xl mx-auto px-6 py-10">
        <button className="mb-6 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">{destination.placeName}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {destination.photos.length > 0 ? (
            destination.photos.map((photo, index) => (
              <img key={index} src={photo} alt={destination.placeName} className="w-full h-72 object-cover rounded-lg shadow-lg" />
            ))
          ) : (
            <img src="/default-placeholder.jpg" alt="No image available" className="w-full h-72 object-cover rounded-lg shadow-lg" />
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-900">Location</h3>
          <p className="text-gray-600">{destination.location}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl font-semibold text-gray-900">About</h3>
          <p className="text-gray-700 leading-relaxed">{destination.information}</p>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Reviews</h3>
          
          {highestRatedReview && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Highest Rated Review
              </h4>
              <ReviewCard review={highestRatedReview} />
            </div>
          )}

          {destination.reviews.length > 0 ? (
            destination.reviews.map((review, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-sm mb-3 bg-white">
                <p className="text-gray-800">
                  <strong>{review.user?.name}</strong> ⭐ {review.rating}/5
                </p>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No reviews yet.</p>
          )}
        </div>

        <AddReview destinationId={id} onReviewAdded={handleReviewAdded} />

        {relatedPackages.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Related Packages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPackages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white rounded-lg shadow-lg p-5 transition-transform transform hover:scale-105 cursor-pointer"
                  onClick={() => navigate(`/package/${pkg._id}`)}
                >
                  <img
                    src={pkg.photos[0] || "/default-placeholder.jpg"}
                    alt={pkg.packageName}
                    className="w-full h-56 object-cover rounded-lg"
                  />

                  <div className="p-4">
                    <h3 className="text-2xl font-semibold text-gray-900">{pkg.packageName}</h3>
                    <p className="text-gray-600">Duration: {pkg.duration}</p>
                    <p className="text-gray-600">Price: ${pkg.price}</p>

                    <button className="mt-4 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all w-full">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DestinationDetails;
