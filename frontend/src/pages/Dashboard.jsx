import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../services/socket";
import Navbar from "../components/Navbar";
import QuickActions from "../dashboard/QuickActions";
import StatsCards from "../dashboard/StatsCards";
import WelcomeCard from "../dashboard/WelcomeCard";
import Notifications from "../dashboard/Notifications";
import AnalyticsChart from "../dashboard/AnalyticsChart";
import DashboardSummary from "../dashboard/DashboardSummary";
import RecentApplications from "../dashboard/RecentApplications";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    selected: 0,
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const user = JSON.parse(localStorage.getItem("user"));

  const chartData = [
    {
      name: "Applications",
      value: stats.totalApplications,
    },
    {
      name: "Shortlisted",
      value: stats.shortlisted,
    },
    {
      name: "Selected",
      value: stats.selected,
    },
  ];

  useEffect(() => {
    fetchStats();
    fetchNotifications();

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED:", socket.id);
    });

    if (user?.id) {
      socket.emit("join", user.id);
      console.log("Joined notification room:", user.id);
    }

    socket.on("notification", (data) => {
      console.log("NEW NOTIFICATION:", data);

      setNotifications((prev) => [
        {
          _id: Date.now().toString(),
          title: data.title || "New Notification",
          message: data.message,
          read: false,
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("notification");
      socket.off("connect");
    };
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("DASHBOARD RESPONSE:", res.data);

      setStats({
        totalJobs: Number(res.data.totalJobs),
        totalApplications: Number(res.data.totalApplications),
        shortlisted: Number(res.data.shortlisted),
        selected: Number(res.data.selected),
      });
    } catch (error) {
      console.log("DASHBOARD ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold">Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-6 py-6">
          <WelcomeCard
            user={user}
            unreadCount={unreadCount}
            setShowNotifications={setShowNotifications}
          />

          <Notifications
            notifications={notifications}
            showNotifications={showNotifications}
            markAsRead={markAsRead}
          />

          {/* Quick Actions */}
          <QuickActions />

          <StatsCards stats={stats} />

          {(user?.role === "recruiter" || user?.role === "admin") && (
            <RecentApplications />
          )}

          <DashboardSummary stats={stats} />
          <AnalyticsChart chartData={chartData} />

          {/* Logout Button */}
          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
