import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import useSignup from "../../hooks/useSignup";
const UserSignup = () => {
  const navigate = useNavigate();
  const { signup } = useSignup();

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await signup(inputs);
    if (success) navigate("/preferences");  // ✅ Navigate only if signup is successful
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Traveler Sign Up
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              name="name"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              placeholder="Full Name"
              className="p-3 pl-10 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              placeholder="Email"
              className="p-3 pl-10 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
              placeholder="Password"
              className="p-3 pl-10 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"  // ✅ Changed from type="button" to type="submit"
            className="p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-semibold"
          >
            Sign Up
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            className="text-teal-500 font-semibold cursor-pointer"
            onClick={() => navigate("/user-login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;