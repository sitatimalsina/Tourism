import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import ChangePassword from "../../components/ChangePassword";
import Footer from "../../components/Footer"; 
import Header from "../../components/Header";

const UserProfile = () => {
  const { authUser } = useAuthContext();
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Debugging: Check if authUser has lastLogin and lastPasswordChange
  useEffect(() => {
    console.log("User Data:", authUser);
  }, [authUser]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center mt-4">
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
              <span>{authUser?.name || "Not Available"}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">Email:</span>
              <span>{authUser?.email || "Not Available"}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">Last Login:</span>
              <span>
                {authUser?.lastLogin
                  ? new Date(authUser.lastLogin).toLocaleString()
                  : "Not Available"}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">Last Password Change:</span>
              <span>
                {authUser?.lastPasswordChange
                  ? new Date(authUser.lastPasswordChange).toLocaleString()
                  : "Not Available"}
              </span>
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserProfile;
