import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";

const ManagePhoto = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // New state to track upload progress

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
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("File selected:", file); // Debugging
  };

  // Helper function to get token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found.");
      alert("Session expired! Please log in again.");
      return null;
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };
  };

  // Upload Image
  const handleUpload = async () => {
    if (!selectedFile || !title) {
      alert("Please select an image and enter a title");
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("title", title);

    setIsUploading(true); // Set isUploading to true to disable button

    try {
      console.log("Uploading..."); // Debugging
      const res = await axios.post("http://localhost:5000/api/photos/upload", formData, {
        headers: headers,
      });

      if (res.data && res.data.photo) {
        console.log("Upload success:", res.data.photo); // Debugging
        setPhotos([...photos, res.data.photo]); // Update UI
        setTitle("");
        setSelectedFile(null);
        alert("Upload successful!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      alert("Upload failed. Check console for details.");
    } finally {
      setIsUploading(false); // Reset isUploading to false after upload
    }
  };

  // Delete Image
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this photo?");
    if (!confirmDelete) return;

    setDeletingId(id); // Set deleting state

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/photos/${id}`, {
        headers: headers,
      });

      if (response.status === 200) {
        setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo._id !== id));
        alert("Photo deleted successfully!");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      console.log("hello")
      alert(`Failed to delete photo: ${error.message}. Check console for details.`);
    } finally {
      setDeletingId(null); // Reset deleting state
    }
  };

  return (
    <>
      {/* Header */}
      <AdminHeader />
   
    <div className="flex flex-row    min-h-screen">

      <div>
      <Sidebar />
      </div>
      

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
              disabled={isUploading} // Disable the button when uploading
              className={`bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 transition ml-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? 'Uploading...' : 'Upload'} {/* Change text when uploading */}
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
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-20 h-20 object-cover"
                      />
                    </td>
                    <td className="border p-2">{photo.title}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleDelete(photo._id)}
                        disabled={deletingId === photo._id}
                        className={`bg-red-500 text-white p-2 rounded-md ${deletingId === photo._id
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
    </>
  );
};

export default ManagePhoto;
