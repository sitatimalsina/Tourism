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
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      const data = text?JSON.parse(text) : {};
      if (data.error) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("users", JSON.stringify(data));
      setAuthUser(data);

      toast.success("Login successful!");
      return true; 
    } catch (error) {
      toast.error(error.message);
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

  return true;
}