import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminHeader from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";
import { useAuthContext } from "../../context/AuthContext";

const AdminManagePackages = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    if (!authUser || authUser.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [authUser, navigate]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages/admin");
        if (!res.ok) throw new Error("Failed to fetch packages");

        const data = await res.json();
        setPackages(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchPackages();
  }, []);

  const handleDelete = async (packageId) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      const res = await fetch(`/api/packages/${packageId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete package");

      setPackages(packages.filter((pkg) => pkg._id !== packageId));
      toast.success("Package deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <AdminHeader />

      <div className="flex flex-1">
        <div className="w-64 bg-gray-800 text-white">
          <Sidebar />
        </div>

        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-700">Manage Packages</h1>
            <button
              onClick={() => navigate("/admin/add-package")}
              className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all"
            >
              + Add New Package
            </button>
          </div>

          {packages.length === 0 ? (
            <p className="text-gray-600 text-center">No packages found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg._id} className="bg-white rounded-lg shadow-md p-5 transition-transform transform hover:scale-105">
                  <h3 className="text-2xl font-semibold text-gray-900">{pkg.packageName}</h3>
                  <p className="text-gray-600">Duration: {pkg.duration}</p>
                  <p className="text-gray-600">Price: ${pkg.price}</p>

                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => navigate(`/admin/edit-package/${pkg._id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManagePackages;
  