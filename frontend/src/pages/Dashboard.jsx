import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../services/socket";
import Navbar from "../components/Navbar";

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
        <div className="w-full max-w-6xl mx-auto">
          {/* User Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {" "}
            <h1 className="text-gray-800 dark:text-white">
              {" "}
              Welcome, {user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
            <p className="mt-2">
              Role:
              <span className="ml-2 font-semibold text-blue-600">
                {user?.role}
              </span>
            </p>
            {/* Notification Bell */}
            <div className="absolute top-6 right-6">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-2xl"
              >
                🔔
                {unreadCount > 0 && (
                  <span
                    className="
                    absolute
                    -top-2
                    -right-2
                    bg-red-500
                    text-white
                    text-xs
                    rounded-full
                    px-2
                  "
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6">
              <h2 className="font-bold mb-3 dark:text-white"></h2>
              {notifications.length === 0 ? (
                <p className="dark:text-white">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => !n.read && markAsRead(n._id)}
                    className={`
                    border-b
                    py-2
                    cursor-pointer
                    hover:bg-gray-50
                    px-2
                    rounded
                    ${!n.read ? "font-semibold" : ""}
                  `}
                  >
                    <p>{n.title}</p>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition duration-300">
              <h2 className="text-lg font-semibold">💼 Total Jobs</h2>

              <p className="text-4xl font-bold mt-2">{stats.totalJobs}</p>
            </div>

            <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition duration-300">
              <h2 className="text-lg font-semibold">📄 Applications</h2>

              <p className="text-4xl font-bold mt-2">
                {stats.totalApplications}
              </p>
            </div>

            <div className="bg-yellow-500 text-white p-6 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition duration-300">
              <h2 className="text-lg font-semibold">⭐ Shortlisted</h2>

              <p className="text-4xl font-bold mt-2">{stats.shortlisted}</p>
            </div>

            <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition duration-300">
              <h2 className="text-lg font-semibold">🎯 Selected</h2>

              <p className="text-4xl font-bold mt-2">{stats.selected}</p>
            </div>
          </div>

          {/* Dashboard Summary */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Dashboard Summary
            </h2>

            {user?.role === "admin" || user?.role === "recruiter" ? (
              <div>
                <p className="mb-2">📌 Jobs Posted: {stats.totalJobs}</p>

                <p className="mb-2">
                  📄 Total Applications: {stats.totalApplications}
                </p>

                <p className="mb-2">
                  ⭐ Shortlisted Candidates: {stats.shortlisted}
                </p>

                <p>🎯 Selected Candidates: {stats.selected}</p>
              </div>
            ) : (
              <div>
                <p className="mb-2">📌 Available Jobs: {stats.totalJobs}</p>

                <p className="mb-2">
                  📄 Applications Sent: {stats.totalApplications}
                </p>

                <p className="mb-2">⭐ Shortlisted: {stats.shortlisted}</p>

                <p>🎯 Selected: {stats.selected}</p>
              </div>
            )}
          </div>

          {/* Analytics Overview */}
          <div className="mt-8bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Analytics Overview</h2>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

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
