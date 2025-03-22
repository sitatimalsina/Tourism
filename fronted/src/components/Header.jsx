import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCog } from "react-icons/fa";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import ExploreNepalLogo from "../Images/final logo.jpg";

const Header = () => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuthContext();
  const [showMenu, setShowMenu] = useState(false);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu")) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    console.log("Auth User:", authUser);
  }, [authUser]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      localStorage.clear();
      sessionStorage.clear();
      setAuthUser(null);
      toast.success("Logged Out Successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-teal-600 text-white shadow-lg">
      {/* Logo & Branding */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
          <img
            src={ExploreNepalLogo}
            alt="ExploreNepal Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-2xl font-bold">ExploreNepal</span>
      </div>

      {/* Navigation Menu */}
      <nav className="hidden md:flex space-x-6">
        <button
          onClick={() => navigate("/")}
          className="hover:text-gray-300"
          aria-label="Home"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/my-bookings")}
          className="hover:text-gray-300"
          aria-label="My Bookings"
        >
          My Bookings
        </button>
        <button
          onClick={() => navigate("/packages")}
          className="hover:text-gray-300"
          aria-label="Packages"
        >
          Packages
        </button>
        <button
          onClick={() => navigate("/destinations")}
          className="hover:text-gray-300"
          aria-label="Destinations"
        >
          Destinations
        </button>
        <button
          onClick={() => navigate("/contact-us")}
          className="hover:text-gray-300"
          aria-label="Contact Us"
        >
          Contact
        </button>
      </nav>

      {/* User Menu */}
      <div className="relative user-menu">
        {authUser ? (
          <>
            <FaUserCog
              className="text-2xl cursor-pointer hover:text-gray-300"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="User Menu"
            />
            {showMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg p-4 z-50">
                {/* View Profile Button */}
                <button
                  className="block w-full text-left p-2 hover:bg-gray-200 rounded-md"
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/user-profile");
                  }}
                  aria-label="View Profile"
                >
                  View Profile
                </button>
                {/* Logout Button */}
                <button
                  className="block w-full text-left p-2 bg-red-600 rounded-md mt-2"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  Logout
                </button>
                {/* Admin Panel Button (if admin) */}
                {authUser?.role === "admin" && (
                  <button
                    className="block w-full text-left p-2 bg-red-500 text-white hover:bg-red-600 rounded-md mt-2"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/admin-dashboard");
                    }}
                    aria-label="Admin Panel"
                  >
                    Admin Panel
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => navigate("/mode")}
            className="px-4 py-2 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            aria-label="Login"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;