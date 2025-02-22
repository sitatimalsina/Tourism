import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useState } from "react";
import useLogin from "../../hooks/useLogin";

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email : "",
    password : "",
  })

  const {login} = useLogin();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const sucsess = await login(formData);
    if(sucsess){
     navigate("/");
    }
  
   }


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Traveler Login
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email} 
              onChange={(e) => setFormData({...formData,email:e.target.value})}
              className="p-3 pl-10 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password} 
              onChange={(e) => setFormData({...formData,password:e.target.value})}
              className="p-3 pl-10 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-semibold"
          >
            Login
          </button>
        </form>

        {/* Redirect to Signup */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <span
            className="text-teal-500 font-semibold cursor-pointer"
            onClick={() => navigate("/user-signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;