import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const AdminAddEditPackage = () => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const isEditing = Boolean(packageId);

  const [formData, setFormData] = useState({
    packageName: "",
    price: "",
    duration: "",
    description: "",
    selectedDestinations: [],
    itinerary: [{ day: 1, title: "", description: "" }],
    photos: [],
  });

  const [availableDestinations, setAvailableDestinations] = useState([]);

  // ✅ Fetch Available Destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch("/api/destinations");
        if (!res.ok) throw new Error("Failed to fetch destinations");
        const data = await res.json();
        setAvailableDestinations(data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchDestinations();
  }, []);

  // ✅ Fetch Package Details if Editing
  useEffect(() => {
    if (isEditing) {
      const fetchPackage = async () => {
        try {
          const res = await fetch(`/api/packages/${packageId}`);
          if (!res.ok) throw new Error("Failed to fetch package");

          const data = await res.json();
          setFormData({
            packageName: data.packageName,
            price: data.price,
            duration: data.duration,
            description: data.description,
            selectedDestinations: data.destinations.map((dest) => dest._id),
            itinerary: data.itinerary.length > 0 ? data.itinerary : [{ day: 1, title: "", description: "" }],
            photos: [],
          });
        } catch (error) {
          toast.error(error.message);
        }
      };
      fetchPackage();
    }
  }, [packageId, isEditing]);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle Destination Selection
  const handleDestinationChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, selectedDestinations: selectedIds });
  };

  // ✅ Handle Itinerary Input
  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index][field] = value;
    setFormData({ ...formData, itinerary: newItinerary });
  };

  // ✅ Add a New Day to Itinerary
  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: "", description: "" }],
    });
  };

  // ✅ Handle File Selection
  const handleFileChange = (e) => {
    setFormData({ ...formData, photos: e.target.files });
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // ✅ Convert Itinerary to JSON String
    const formattedItinerary = JSON.stringify(formData.itinerary);

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "photos") {
        for (let i = 0; i < value.length; i++) {
          formDataToSend.append("photos", value[i]);
        }
      } else if (key === "itinerary") {
        formDataToSend.append("itinerary", formattedItinerary);
      } else if (key === "selectedDestinations") {
        value.forEach((destId) => formDataToSend.append("destinations", destId));
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const res = await fetch(isEditing ? `/api/packages/${packageId}` : "/api/packages", {
        method: isEditing ? "PUT" : "POST",
        credentials: "include",
        body: formDataToSend,
      });
        
      if (!res.ok) throw new Error("Failed to submit package");

      toast.success(`Package ${isEditing ? "updated" : "created"} successfully!`);
      navigate("/admin/package");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{isEditing ? "Edit Package" : "Add Package"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="packageName" placeholder="Package Name" value={formData.packageName} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
        <input type="text" name="duration" placeholder="Duration (e.g. 5 Days, 4 Nights)" value={formData.duration} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full p-3 border rounded-lg"></textarea>

        <label className="block text-sm font-medium text-gray-700">Destinations</label>
        <select multiple name="selectedDestinations" onChange={handleDestinationChange} className="w-full p-3 border rounded-lg">
          {availableDestinations.map((dest) => (
            <option key={dest._id} value={dest._id}>
              {dest.placeName} ({dest.location})
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700">Itinerary</label>
        {formData.itinerary.map((day, index) => (
          <div key={index} className="p-3 border rounded-lg bg-gray-50">
            <input
              type="text"
              placeholder={`Day ${day.day} Title`}
              value={day.title}
              onChange={(e) => handleItineraryChange(index, "title", e.target.value)}
              required
              className="w-full p-2 border rounded-lg mb-2"
            />
            <textarea
              placeholder={`Day ${day.day} Description`}
              value={day.description}
              onChange={(e) => handleItineraryChange(index, "description", e.target.value)}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
        ))}
        <button type="button" onClick={addItineraryDay} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
          + Add Another Day
        </button>

        <input type="file" multiple onChange={handleFileChange} className="w-full p-3 border rounded-lg" />

        <button type="submit" className="w-full mt-6 p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          {isEditing ? "Update Package" : "Create Package"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddEditPackage;