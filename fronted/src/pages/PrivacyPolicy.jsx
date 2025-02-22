import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header"; // Import the Header component
import Footer from "../components/Footer"; // Import the Footer component

const PrivacyPolicy = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          At Explore Nepal, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information Collection</h2>
        <p className="text-gray-700 mb-4">
          We collect information such as your name, email address, and contact details when you register or make a booking on our platform.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Use of Information</h2>
        <p className="text-gray-700 mb-4">
          The information we collect is used to provide and improve our services, communicate with you, and personalize your experience.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Data Security</h2>
        <p className="text-gray-700 mb-4">
          We implement industry-standard security measures to protect your data from unauthorized access or disclosure.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Third-Party Disclosure</h2>
        <p className="text-gray-700 mb-4">
          We do not sell, trade, or transfer your personal information to third parties without your consent, except as required by law.
        </p>
        <p className="text-gray-700 mt-6">
          For further information, please contact us at{" "}
          <Link to="/contact-us" className="text-teal-500 hover:underline">
            Contact Us
          </Link>
          .
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;