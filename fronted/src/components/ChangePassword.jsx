import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const { authUser } = useAuthContext();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for the submit button

  // Function to handle form submission
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validation: Check if any field is empty
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Validation: Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true); // Enable loading state

    try {
      const response = await fetch("http://localhost:5000/api/auth/change-password", { // Ensure the URL matches your backend route
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: authUser.email, // Send the user's email
          currentPassword, // Send the current password for validation
          newPassword, // Send the new password
        }),
      });

      const data = await response.json(); // Parse the response

      if (response.ok) {
        toast.success("Password changed successfully.");
        // Clear form fields after successful password change
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Handle specific error messages from the server
        let errorMessage = data.error || "Failed to change password. Please try again.";
        if (response.status === 400) {
          errorMessage = "Incorrect current password.";
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      if (error instanceof TypeError) {
        toast.error("Network error or CORS issue. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Error details:", error); // Log error details for debugging
    } finally {
      setIsLoading(false); // Disable loading state
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-4">
      {/* Current Password */}
      <div>
        <label htmlFor="currentPassword" className="block font-medium text-gray-700">
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          aria-label="Current Password"
          disabled={isLoading}
          className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* New Password */}
      <div>
        <label htmlFor="newPassword" className="block font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          aria-label="New Password"
          disabled={isLoading}
          className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          aria-label="Confirm New Password"
          disabled={isLoading}
          className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading} // Disable button while loading
        aria-disabled={isLoading}
        className={`bg-teal-600 text-white px-4 py-2 rounded-md transition w-full ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-700"
        }`}
      >
        {isLoading ? "Changing Password..." : "Change Password"}
      </button>
    </form>
  );
};

export default ChangePassword;
