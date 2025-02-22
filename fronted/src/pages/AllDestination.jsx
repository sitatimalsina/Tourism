import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AllDestinations = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        console.log("Fetching destinations...");

        const res = await fetch("http://localhost:5000/api/destinations");
        if (!res.ok) throw new Error("Failed to fetch destinations");

        const data = await res.json();
        console.log("Fetched Data:", data);

        if (!Array.isArray(data)) throw new Error("Invalid data format received");

        setDestinations(data);
      } catch (error) {
        console.error("Error fetching destinations:", error.message);
        toast.error(error.message || "Something went wrong fetching destinations.");
      }
    };

    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch =
      destination.placeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory
      ? destination.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-4xl text-center font-bold text-gray-900 mb-8">
          Explore All Destinations
        </h2>

        {/* Search Input */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="mb-12 flex justify-center space-x-4">
          {[
            { label: "Mountains & Trekking", category: "Mountains" },
            { label: "Wildlife Safari", category: "Wildlife" },
            { label: "Heritage & Temples", category: "Heritage" },
            { label: "Lakes & Rivers", category: "Lakes" },
            { label: "Adventure Sports", category: "Adventure" },
            { label: "All", category: "" },
          ].map(({ label, category }) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg border border-black shadow-md transition-all hover:shadow-lg ${
                selectedCategory === category
                  ? "bg-gray-300 text-black"
                  : "bg-white text-black hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Display Filtered Destinations */}
        {filteredDestinations.length === 0 ? (
          <p className="text-gray-600 text-center">No destinations found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <div
                key={destination._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => {
                  if (!destination._id) {
                    toast.error("Invalid destination ID");
                    return;
                  }
                  navigate(`/destination/${destination._id}`);
                }}
              >
                <img
                  src={destination.photos?.[0] || "/default-placeholder.jpg"}
                  alt={destination.placeName}
                  className="w-full h-56 object-cover rounded-t-lg"
                />

                <div className="p-5 text-center">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {destination.placeName}
                  </h3>
                  <p className="text-gray-600 mt-1">{destination.location}</p>

                  <button
                    className="mt-4 px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all shadow-md hover:shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!destination._id) {
                        toast.error("Invalid destination ID");
                        return;
                      }
                      navigate(`/destination/${destination._id}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AllDestinations;
