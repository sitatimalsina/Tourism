import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const login = async ({ email, password }) => {
    const success = handleInputErrors({ email, password });
    if (!success) return false;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json(); // Parsing directly as JSON for better handling

      if (res.status !== 200) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("users", JSON.stringify(data));
      setAuthUser(data);

      toast.success("Login successful!");
      navigate("/dashboard"); // Redirect after successful login (optional)
      return true;
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
      return false;
    }
  };

  return { login };
};

export default useLogin;

function handleInputErrors({ email, password }) {
  if (!email || !password) {
    toast.error("Please fill in all fields");
    return false;
  }

  // Additional validation for email format could go here (optional)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address");
    return false;
  }

  return true;
}
