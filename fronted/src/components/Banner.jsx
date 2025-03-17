import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Banner = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch photos from backend
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get("/api/photos");
        const photoUrls = response.data.map(photo => photo.url);
        setImages(photoUrls);
      } catch (err) {
        setError("Failed to load photos");
        console.error("Error fetching photos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto Slide Logic (optional if you have only one image)
  useEffect(() => {
    let interval;
    if (isHovered && images.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, 3000);
    }
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isHovered, images, currentIndex]);

  return (
    <div 
      className="relative w-full h-[500px] overflow-hidden"

      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-full">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold block">Error Loading Photos</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      ) : images.length > 0 ? (

          // Display Images
          <motion.img
            key={images[currentIndex]}
            src={images[currentIndex]}
            alt="Nepal Scenery"
            className="w-full h-full object-cover absolute inset-0"

            initial={{ opacity: 0, scale: 1.00 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.00 }}
            transition={{ duration: 0.8 }}
          />
        ) : (
          // No Photos Available
          <div className="flex justify-center items-center h-full">
            <div
              className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold block">No Photos Available</strong>
              <span className="block sm:inline">
                No photos found — Please check back later
              </span>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400 opacity-70"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
