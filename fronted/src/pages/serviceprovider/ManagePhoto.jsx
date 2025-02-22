import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";

const ManagePhoto = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch Photos from API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/photos/");
        setPhotos(res.data);
      } catch (err) {
        console.error("Error fetching photos:", err);
      }
    };
    fetchPhotos();
  }, []);

  // Handle File Selection
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  // Upload Image
  const handleUpload = async () => {
    if (!selectedFile || !title) {
      alert("Please select an image and enter a title");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("title", title);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/photos/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data && res.data.photo) {
        setPhotos([...photos, res.data.photo]); // Update UI
      } else {
        throw new Error("Invalid response from server");
      }
      setTitle("");
      setSelectedFile(null);
      alert("Upload successful!");
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      alert("Upload failed. Check console for details.");
    }
  };

  // Delete Image
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this photo? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setDeletingId(id); // Set the ID of the photo being deleted

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Send DELETE request to the backend
      const response = await axios.delete(`http://localhost:5000/api/photos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        // Remove the deleted photo from the UI
        setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo._id !== id));
        alert("Photo deleted successfully!");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Delete error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(`Failed to delete photo: ${error.message}. Check console for details.`);
    } finally {
      setDeletingId(null); // Reset the deleting state
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <AdminHeader />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <div className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">Manage Photos</h1>

          {/* Upload Section */}
          <div className="mb-6">
            <input
              type="file"
              onChange={handleFileChange}
              className="border p-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 flex-1 rounded-md ml-2"
            />
            <button
              onClick={handleUpload}
              className="bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 transition ml-2"
            >
              Upload
            </button>
          </div>

          {/* Photo List */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Uploaded Photos</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {photos.map((photo) => (
                  <tr key={photo._id}>
                    <td className="border p-2">
                      <img src={photo.url} alt={photo.title} className="w-20 h-20 object-cover" />
                    </td>
                    <td className="border p-2">{photo.title}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleDelete(photo._id)}
                        disabled={deletingId === photo._id}
                        className={`bg-red-500 text-white p-2 rounded-md ${
                          deletingId === photo._id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-red-700 transition"
                        }`}
                      >
                        {deletingId === photo._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePhoto;