import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import { 
  FaUser, FaCalendarCheck, FaDollarSign, 
  FaGlobe, FaBox, FaTimesCircle, FaEnvelope 
} from "react-icons/fa";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { authUser } = useAuthContext();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    canceledBookings: 0,
    totalDestinations: 0,
    totalPackages: 0,
    totalMessages: 0,
  });

  // Redirect if not admin
  useEffect(() => {
    if (!authUser || authUser.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [authUser, navigate]);

  // Fetch Dashboard Stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setStats(data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchDashboardStats();
  }, []);

  // Dashboard Stats with Icons & Colors
  const dashboardStats = useMemo(
    () => [
      { title: "Users", value: stats.totalUsers, bgColor: "bg-red-200", textColor: "text-white", icon: <FaUser /> },
      { title: "Bookings", value: stats.totalBookings, bgColor: "bg-blue-200", textColor: "text-white", icon: <FaCalendarCheck /> },
      { title: "Destinations", value: stats.totalDestinations, bgColor: "bg-lime-200", textColor: "text-white", icon: <FaGlobe /> },
      { title: "Packages", value: stats.totalPackages, bgColor: "bg-purple-200", textColor: "text-white", icon: <FaBox /> },
      { title: "Cancelled Booking", value: stats.canceledBookings, bgColor: "bg-pink-200", textColor: "text-white", icon: <FaTimesCircle /> },
      { title: "Enquiries", value: stats.totalMessages, bgColor: "bg-orange-200", textColor: "text-white", icon: <FaEnvelope /> },
    ],
    [stats]
  );

  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <h1 className="text-3xl font-semibold text-gray-700 mb-6">Admin Dashboard</h1>

          {/* Dashboard Stats Section */}
          {currentView === "dashboard" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dashboardStats.map((stat, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg shadow-md flex flex-col items-center justify-center transition-transform transform hover:scale-105 ${stat.bgColor}`}
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <h2 className={`text-lg font-semibold ${stat.textColor}`}>{stat.title}</h2>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
