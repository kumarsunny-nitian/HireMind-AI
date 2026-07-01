import { useEffect, useState } from "react";
import api from "../services/api";

function RecentApplications() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchRecentApplications();
  }, []);

  const fetchRecentApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/applications/recent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data.applications || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const query = search.toLowerCase();

    const matchesSearch =
      app.candidate?.name?.toLowerCase().includes(query) ||
      app.job?.title?.toLowerCase().includes(query) ||
      app.job?.company?.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        📄 Recent Applications
      </h2>

      {applications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">
          No recent applications
        </p>
      ) : (
        <>
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search candidate, job or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                md:w-96
                px-4
                py-3
                rounded-xl
                border
                dark:bg-gray-700
                dark:text-white
                dark:border-gray-600
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {["all", "pending", "shortlisted", "selected", "rejected"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    statusFilter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ),
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4 dark:text-white">Candidate</th>
                  <th className="py-3 px-4 dark:text-white">Job</th>
                  <th className="py-3 px-4 dark:text-white">Company</th>
                  <th className="py-3 px-4 dark:text-white">ATS</th>
                  <th className="py-3 px-4 dark:text-white">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((app) => (
                  <tr
                    key={app._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-4 px-4 font-semibold dark:text-white">
                      {app.candidate?.name}
                    </td>

                    <td className="py-4 px-4 dark:text-gray-300">
                      {app.job?.title}
                    </td>

                    <td className="py-4 px-4 dark:text-gray-300">
                      {app.job?.company}
                    </td>

                    <td className="py-4 px-4 font-bold text-blue-600">
                      {app.atsScore}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === "selected"
                            ? "bg-green-100 text-green-700"
                            : app.status === "shortlisted"
                              ? "bg-yellow-100 text-yellow-700"
                              : app.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default RecentApplications;
