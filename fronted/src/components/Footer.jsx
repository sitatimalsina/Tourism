import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between">
        {/* Explore Nepal Section */}
        <div className="w-1/5">
          <h2 className="text-2xl font-bold text-teal-400">Explore Nepal</h2>
          <p className="text-gray-400 mt-2">
            Your gateway to the most beautiful destinations in Nepal. Discover, book, and explore with us!
          </p>
        </div>

        {/* About Us Section */}
        <div className="w-1/5">
          <h3 className="text-xl font-semibold text-teal-400">About Us</h3>
          <p className="text-gray-400 mt-2">
            We craft unforgettable journeys with curated tour packages and expert guidance.
          </p>
          <Link to="/about" className="text-teal-400 hover:underline">
            Learn more
          </Link>
        </div>

        {/* Quick Links Section */}
        <div className="w-1/5">
          <h3 className="text-xl font-semibold text-teal-400">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link to="/" className="text-gray-400 hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/packages" className="text-gray-400 hover:text-white">
                Packages
              </Link>
            </li>
            <li>
              <Link to="/destinations" className="text-gray-400 hover:text-white">
                Destinations
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="text-gray-400 hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/terms-of-use" className="text-gray-400 hover:text-white">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white">
                Policy
              </Link></li>
          </ul>
        </div>

        {/* Follow Us & Contact Section */}
        <div className="w-1/5">
          <h3 className="text-xl font-semibold text-teal-400">Follow Us</h3>
          <div className="flex space-x-4 mt-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaInstagram size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaLinkedin size={24} />
            </a>
          </div>
          <h3 className="text-xl font-semibold text-teal-400 mt-4">Contact Us</h3>
          <p className="text-gray-400 mt-2">Email: info@explorenepal.com</p>
          <p className="text-gray-400">Phone: +977-9800000000</p>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-8 border-t border-gray-700 pt-4">
        <p>© {new Date().getFullYear()} Explore Nepal. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;