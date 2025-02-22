import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const AllPackages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages");
        if (!res.ok) throw new Error("Failed to fetch packages");

        const data = await res.json();
        setPackages(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Explore Travel Packages</h2>

        {packages.length === 0 ? (
          <p className="text-gray-600 text-center">No travel packages available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div 
                key={pkg._id} 
                className="bg-white rounded-lg shadow-lg p-5 transition-transform transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/package/${pkg._id}`)}
              >
                <img src={pkg.photos[0] || "/default-placeholder.jpg"} alt={pkg.packageName} className="w-full h-56 object-cover rounded-lg" />
                
                <div className="p-4">
                  <h3 className="text-2xl font-semibold text-gray-900">{pkg.packageName}</h3>
                  <p className="text-gray-600"><strong>Duration:</strong> {pkg.duration} days</p>
                  <p className="text-gray-600"><strong>Price:</strong> ${pkg.price}</p>

                  <button className="mt-4 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all w-full">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AllPackages;