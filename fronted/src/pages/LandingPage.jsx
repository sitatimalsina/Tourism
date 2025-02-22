import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-white text-black px-10 justify-center items-center">
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-16 py-12 rounded-2xl shadow-2xl flex flex-col items-center">
        <h1 className="text-5xl font-bold tracking-wide shadow-md drop-shadow-lg">
          Explore<span className="text-yellow-300">Nepal</span>
        </h1>
        <p className="mt-4 text-lg font-light opacity-90 text-center max-w-2xl">
          Discover the breathtaking landscapes, rich culture, and hidden gems of Nepal. Whether you're looking for adventure, relaxation, or cultural immersion, TourEase helps you plan the perfect trip with ease.
        </p>

        <div className="flex flex-col justify-center gap-3 items-center mt-10 shadow-lg p-8 bg-white text-black bg-opacity-20 rounded-xl w-full max-w-md">
          <h2 className="text-2xl font-semibold tracking-wide shadow-md drop-shadow-lg">
            Continue as
          </h2>

          <div className="flex flex-col gap-4 mt-4">
            <button
              className="p-4 w-72 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-semibold"
              onClick={() => navigate("/user-login")}
            >
              Traveler
            </button>
            <button
              className="p-4 w-72 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              onClick={() => navigate("/service-provider-login")}
            >
              Service Provider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;