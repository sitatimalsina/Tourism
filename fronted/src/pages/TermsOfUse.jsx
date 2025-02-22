import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header"; // Import the Header component
import Footer from "../components/Footer"; // Import the Footer component

const TermsOfUse = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Use</h1>
        <p className="text-gray-700 mb-4">
          Welcome to Explore Nepal! These terms and conditions outline the rules
          and regulations for the use of our website and services.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          1. Acceptance of Terms
        </h2>
        <p className="text-gray-700 mb-4">
          By accessing this website, you agree to be bound by these terms and
          conditions. If you do not agree, please refrain from using our
          services.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          2. Use of Services
        </h2>
        <p className="text-gray-700 mb-4">
          You agree to use our services only for lawful purposes and in
          accordance with these terms. Any misuse of the website or its services
          may result in termination of access.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          3. Intellectual Property
        </h2>
        <p className="text-gray-700 mb-4">
          All content on this website, including text, images, and logos, is the
          property of Explore Nepal and is protected by intellectual property
          laws.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          4. Limitation of Liability
        </h2>
        <p className="text-gray-700 mb-4">
          Explore Nepal shall not be liable for any damages arising from the use
          or inability to use our services.
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

export default TermsOfUse;