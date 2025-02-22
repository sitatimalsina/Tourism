import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminHeader from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";

const EditDestination = () => {
  const { destinationId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    placeName: "",
    location: "",
    information: "",
    category: "",
    photos: [],
  });
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await fetch(`/api/destinations/${destinationId}`);
        if (!res.ok) throw new Error("Failed to fetch destination details");

        const data = await res.json();
        setFormData({
          placeName: data.placeName,
          location: data.location,
          information: data.information,
          category: data.category,
          photos: data.photos || [],
        });
        setPreviewImages(data.photos || []);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchDestination();
  }, [destinationId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("You can upload a maximum of 5 pictures.");
      return;
    }

    setFormData({ ...formData, photos: files });
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("placeName", formData.placeName);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("information", formData.information);
      formDataToSend.append("category", formData.category);

      formData.photos.forEach((photo) => {
        formDataToSend.append("photos", photo);
      });

      const res = await fetch(`/api/destinations/edit/${destinationId}`, {
        method: "PUT",
        body: formDataToSend,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Destination updated successfully!");
      navigate("/admin/destinations");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Edit Destination</h2>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto" encType="multipart/form-data">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Place Name</label>
                <input
                  type="text"
                  name="placeName"
                  value={formData.placeName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Information</label>
                <textarea
                  name="information"
                  value={formData.information}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg resize-y"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="Mountains">Mountains</option>
                  <option value="Wildlife">Wildlife</option>
                  <option value="Heritage">Heritage</option>
                  <option value="Lakes">Lakes</option>
                  <option value="Adventure">Adventure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Upload New Pictures (Max 5)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <div className="flex gap-3 mt-3">
                  {previewImages.map((src, index) => (
                    <img key={index} src={src} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/admin/destinations")}
                className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Update Destination
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditDestination;