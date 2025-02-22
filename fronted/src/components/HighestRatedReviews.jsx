import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ReviewCard = ({ review }) => {
  return (
    <div className="flip-card w-56 h-64 mx-2 perspective">
      <div className="flip-card-inner relative w-full h-full transition-transform duration-500">
        {/* Front Side */}
        <div className="flip-card-front absolute w-full h-full bg-white p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col justify-center items-center">
          <div className="w-14 h-14 rounded-full bg-gray-200 mb-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-bold text-base text-center mb-2">
            {review.user?.name || "Anonymous Traveler"}
          </h3>
          <div className="flex items-center">
            <span className="text-yellow-500 text-lg mr-2">
              {'★'.repeat(review.rating)}
            </span>
            <span className="text-gray-600">({review.rating}/5)</span>
          </div>
        </div>
        {/* Back Side */}
        <div className="flip-card-back absolute w-full h-full bg-white p-4 border border-gray-200 rounded-lg shadow-sm flex items-center justify-center">
          <p className="text-gray-700 text-center text-sm leading-relaxed px-2">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
};

const HighestRatedReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/destinations/highest-rated-reviews"); // Correct endpoint
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();

        if (data.length === 0) {
          toast("No reviews available yet. Be the first to leave a review!", { icon: "ℹ️" });
        }
        setReviews(data.slice(0, 4)); // Only show top 4 reviews
      } catch (error) {
        toast.error(error.message);
        setReviews([]);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-semibold text-center mb-6">
        What Our Customers Say
      </h2>
      <div className="flex justify-center flex-wrap px-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="flip-card-container mb-4">
              <ReviewCard review={review} />
            </div>
          ))
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">No reviews available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighestRatedReviews;