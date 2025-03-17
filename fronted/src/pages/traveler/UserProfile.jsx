import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import ChangePassword from "../../components/ChangePassword";

import Footer from "../../components/Footer"; // Importing Footer component

import Header from "../../components/Header";

const UserProfile = () => {
  const { authUser } = useAuthContext();
  const [showChangePassword, setShowChangePassword] = useState(false); // State to toggle dropdown

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
<div className="flex-1 flex items-center justify-center mt-4"> {/* Added margin-top for spacing */}

        {/* Outer Box */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          {/* User Profile Header */}
          <h1 className="text-2xl font-bold text-center text-teal-600 mb-6">
            User Profile
          </h1>

          {/* User Information */}
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="font-semibold">Name: </span>
              {authUser.name}
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">Email:</span>
              <span>{authUser.email}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">Last Login:</span>
              <span>Not Available</span> {/* Replace with actual data if available */}
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">Last Password Change:</span>
              <span>Not Available</span> {/* Replace with actual data if available */}
            </p>
          </div>

          {/* Change Password Section */}
        

          <div className="mt-8">
            <button
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition"
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              {showChangePassword ? "Hide Change Password" : "Change Password"}
            </button>

            {/* Dropdown for Change Password */}
            {showChangePassword && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                <ChangePassword />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer /> 
    </div>
  );
};

export default UserProfile;
