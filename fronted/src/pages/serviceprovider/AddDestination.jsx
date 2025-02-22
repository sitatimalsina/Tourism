import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const categories = ["Mountains", "Wildlife", "Heritage", "Lakes", "Adventure"];

const AddDestination = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        placeName: "",
        location: "",
        information: "",
        pictures: [],  
        category: "",
    });

    const [previewImages, setPreviewImages] = useState([]); 

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

        setFormData({ ...formData, pictures: files });

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

            formData.pictures.forEach((picture) => {
                formDataToSend.append("pictures", picture);  
            });

            const res = await fetch("/api/destinations/add", {
                method: "POST",
                body: formDataToSend,
                credentials: "include",
            });
             
            const text = await res.text();
            const data = text?JSON.parse(text) : {};
            if (!res.ok) throw new Error(data.error);

            toast.success("Destination added successfully!");
            navigate("/admin/destinations");  
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1">
                <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                    <h1 className="text-2xl font-semibold text-gray-700 mb-6">Add Destination</h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
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
                                <label className="block text-sm font-medium text-gray-700 resize-none overflow-y-auto">Information</label>
                                <textarea
                                    name="information"
                                    value={formData.information}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg resize-y min-h-[100px] overflow-auto"
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
                                    <option value="" disabled>Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Multiple Image Uploads */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Upload Pictures (Max 5)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name = "pictures"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                                <div className="flex gap-3 mt-2">
                                    {previewImages.map((src, index) => (
                                        <img key={index} src={src} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="w-full mt-6 p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                            Add Destination
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default AddDestination;