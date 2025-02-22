import React, { useState } from "react";
import toast from "react-hot-toast";
import Header from "../components/Header"; 
import Footer from "../components/Footer"; 

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format.");
      return;
    }

    try {
      // Send the form data to the backend API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      // Success message
      toast.success("Your message has been sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear the form
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <div className="p-6">
 
        {/* Section 1: Map and Contact Details */}
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side: Map */}
            <div className="flex-1 h-[400px] rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.279961234567!2d84.435921!3d27.681739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ebaceb3a8f3b27%3A0x6e7c5a4d8b8b8b8b!2sBharatpur%2C%20Chitwan!5e0!3m2!1sen!2snp!4v1696950847084!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Map of Bharatpur, Chitwan"
              ></iframe>
            </div>

            {/* Right Side: Contact Details */}
            <div className="flex-1 space-y-4 justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-7">Contact Us</h2>
              <div className="space-y-2 text-gray-700">
                <p>Email: <span className="font-medium">info@explorenepal.com</span></p>
                <p>Phone: <span className="font-medium">+977 123 456 789</span></p>
                <p>Address: <span className="font-medium">Bharatpur, Chitwan, Nepal</span></p>
              </div>
              <p className="text-gray-700">
                We welcome all visitors to experience the natural beauty and cultural richness of Nepal. Feel free to reach out to us for any inquiries or assistance!
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Form */}
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter the subject of your message"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Write your message here..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                required
              ></textarea>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Contact;