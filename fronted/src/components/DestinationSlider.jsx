import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const DestinationSlider = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const { authUser } = useAuthContext();

  const categoryMap = {
    "Mountains & Trekking": "Mountains",
    "Wildlife Safari": "Wildlife",
    "Heritage & Temples": "Heritage",
    "Lakes & Rivers": "Lakes",
    "Adventure Sports": "Adventure",
  };

  useEffect(() => {
    if (!authUser || !authUser.interests) return;

    const fetchDestinations = async () => {
      try {
        const res = await fetch("/api/destinations");
        if (!res.ok) throw new Error("Failed to fetch destinations");

        const data = await res.json();
        const userCategories = authUser.interests.map((interest) => categoryMap[interest]);

        const filteredDestinations = data.filter((destination) =>
          userCategories.includes(destination.category)
        );

        setDestinations(filteredDestinations);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchDestinations();
  }, [authUser]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Recommended Destinations</h2>
        <Link
          to="/destinations"
          className="text-teal-600 underline hover:text-teal-700 text-lg font-medium"
        >
          Explore More Destinations
        </Link>
      </div>

      <p className="text-gray-600 text-center mb-4">
        Showing destinations based on your preferences.
      </p>

      {destinations.length === 0 ? (
        <p className="text-gray-600 text-center">No destinations match your preferences.</p>
      ) : (
        <Swiper
          modules={[Navigation]}
          spaceBetween={15}
          slidesPerView={1}
          navigation
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="rounded-xl overflow-hidden"
        >
          {destinations.map((destination) => (
            <SwiperSlide key={destination._id}>
              <div className="bg-white rounded-xl shadow-md border border-gray-200 transition-transform transform hover:scale-105 cursor-pointer">
                <div className="relative p-2">
                  <img
                    src={destination.photos?.[0] || "/default-placeholder.jpg"}
                    alt={destination.placeName}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{destination.placeName}</h3>
                  <p className="text-gray-600 mt-1">{destination.location}</p>

                  <button
                    className="mt-3 px-5 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all shadow-md hover:shadow-lg"
                    onClick={() => navigate(`/destination/${destination._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default DestinationSlider;