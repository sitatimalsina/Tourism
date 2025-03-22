import React from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import DestinationSlider from "../components/DestinationSlider";
// import HighestRatedReviews from "../components/HighestRatedReviews";
import WhatWeOffer from "../components/WhatWeOffer";
import Footer from "../components/Footer";


const ExploreNepal = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Banner */}
      <Banner />

      {/* Main Content */}
      <div className="p-6 flex-grow">
        {/* Title and Subtitle */}
        <h1 className="text-3xl font-semibold text-center text-teal-700">
          Explore Nepal
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Find amazing destinations and plan your adventure with us.
        </p>

        {/* What We Offer Section */}
        <div className="mt-12">
          <WhatWeOffer />
        </div>

        {/* About Us Section with Image and Text */}
        <div className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center">
          {/* Image Section */}
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://res.cloudinary.com/dyowslbun/image/upload/v1740229499/photos/gri3y7esmwa7nlczhytb.jpg"


              alt="Explore Nepal"
              className="rounded-lg shadow-md w-full md:w-[400px] h-[250px] object-cover"
            />
          </div>

          {/* Text Section */}
          <div className="md:w-1/2 text-center md:text-left px-6">
            <h2 className="text-2xl font-semibold text-teal-700 mb-4">About Us</h2>
            <p className="text-gray-600 mb-4">
              Discover the beauty of Nepal with our expert guides and carefully curated 
              travel experiences. We're dedicated to providing unforgettable journeys 
              that showcase the best of Nepal's culture, nature, and adventure.
            </p>
            <a
              href="/about"
              className="inline-block bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Destination Slider */}
      <div className="mt-10 mb-10">
        <DestinationSlider />
      </div>

      {/* Highest Rated Reviews */}
      {/* <HighestRatedReviews /> */}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ExploreNepal;
