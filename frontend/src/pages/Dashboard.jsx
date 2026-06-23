import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    selected: 0,
  });

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/jobs");

      console.log("JOBS:", res.data.jobs);

      const totalApplications =
        res.data.jobs.reduce(
          (total, job) =>
            total + (job.applicationCount || 0),
          0
        );

      setStats({
        totalJobs: res.data.jobs.length,
        totalApplications,
        shortlisted: 0,
        selected: 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6">
          Dashboard
        </h1>

        <div className="space-y-4">
          <p>
            <strong>Name:</strong>{" "}
            {user?.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user?.email}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {user?.role}
          </p>

          <p>
            <strong>Total Jobs:</strong>{" "}
            {stats.totalJobs}
          </p>

          <p>
            <strong>Total Applications:</strong>{" "}
            {stats.totalApplications}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;