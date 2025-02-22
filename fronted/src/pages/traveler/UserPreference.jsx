import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";

const UserPreferences = () => {
  const navigate = useNavigate();
  const {authUser} = useAuthContext();
  const [preferences, setPreferences] = useState({
    interests: [],
  });

  const handleCheckboxChange = (interest) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!authUser) {
        toast.error("User not authenticated!");
        navigate("/user-login");
        return;
      }

      const res = await fetch("/api/auth/save-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(preferences),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem("interests", JSON.stringify(data.preferences.interests));
      toast.success("Preferences saved successfully!");
      navigate("/"); 
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        What places in Nepal do you like?
      </h2>
      <p className="text-gray-600 text-center mb-4">Select all that apply</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              "Mountains & Trekking",
              "Wildlife Safari",
              "Heritage & Temples",
              "Lakes & Rivers",
              "Adventure Sports"
            ].map((interest) => (
              <label key={interest} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={interest}
                  checked={preferences.interests.includes(interest)}
                  onChange={() => handleCheckboxChange(interest)}
                  className="form-checkbox text-teal-500"
                />
                <span>{interest}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 transition"
        >
          Continue to Explore Nepal
        </button>
      </form>
    </div>
  );
};

export default UserPreferences;