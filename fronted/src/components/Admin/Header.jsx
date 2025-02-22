import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext(); 

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });

      localStorage.clear();
      sessionStorage.clear();
      setAuthUser(null); 

      toast.success("Logged out successfully");
      navigate("/"); 
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-lg">
      <button
        onClick={() => navigate("/")}
        className="text-2xl font-bold hover:text-gray-300"
      >
        ExploreNepal
      </button>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;