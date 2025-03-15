import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import useLogin from "../../hooks/useLogin";

const ServiceProviderLogin = () => {
  const navigate = useNavigate();
  const { login } = useLogin();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(inputs);
    if (success) {
      // Assuming `login` returns the token
      const token = success.token; // Modify this if your `login` hook works differently

      // Store the token in localStorage
      localStorage.setItem("token", token);

      // Navigate to the dashboard
      navigate("/admin-dashboard"); 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Service Provider Login
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              placeholder="Email"
              className="p-3 pl-10 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
              placeholder="Password"
              className="p-3 pl-10 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceProviderLogin;
