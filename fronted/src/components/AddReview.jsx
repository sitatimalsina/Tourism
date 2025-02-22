import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const AddReview = ({ destinationId, onReviewAdded }) => {
  const { authUser } = useAuthContext(); 
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) {
      return toast.error("You must be logged in to add a review.");
    }

    if (!rating || !comment.trim()) {
      return toast.error("Please provide both rating and comment.");
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/destinations/${destinationId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Review added successfully!");
      setComment("");
      setRating(5);
      onReviewAdded(data.destination); 
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Add a Review</h3>

      <form onSubmit={handleSubmit}>
        <label className="block text-gray-700 font-medium mb-2">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
        >
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>{num} ⭐</option>
          ))}
        </select>

        {/* 📝 Comment Input */}
        <label className="block text-gray-700 font-medium mt-4 mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
          rows="4"
          placeholder="Write your experience..."
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all shadow-md hover:shadow-lg w-full"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default AddReview;