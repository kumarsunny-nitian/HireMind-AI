import { useEffect, useState } from "react";
import api from "../services/api";

function Applicants() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("ats");

  useEffect(() => {
    fetchApplicants();
  }, [statusFilter, sortBy]);

  const exportCSV = () => {
    const headers = ["Name", "Email", "ATS Score", "Status"];

    const rows = applications.map((app) => [
      app.candidate?.name || "",
      app.candidate?.email || "",
      app.atsScore || 0,
      app.status || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "applicants.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const updateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/applications/status/${applicationId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchApplicants();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");

      const jobId = "6a3a37f66c703e0fce51c607";

      const res = await api.get(
        `/applications/job/${jobId}?status=${statusFilter}&sortBy=${sortBy}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setApplications(res.data.applications || []);
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  };

  const totalApplicants = applications.length;

  const shortlistedCount = applications.filter(
    (app) => app.status === "shortlisted",
  ).length;

  const selectedCount = applications.filter(
    (app) => app.status === "selected",
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status === "rejected",
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Applicants Management
        </h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Manage, review, and track all applicants for this job.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Applicants */}
        <div
          onClick={() => setStatusFilter("all")}
          className="
    bg-white
    dark:bg-gray-800
    shadow-lg
    rounded-xl
    p-5
    cursor-pointer
    hover:shadow-2xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
        >
          {" "}
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            👥 Total Applicants
          </p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {totalApplicants}
          </h2>
        </div>

        {/* Shortlisted */}
        <div
          onClick={() => setStatusFilter("all")}
          className="
    bg-white
    dark:bg-gray-800
    shadow-lg
    rounded-xl
    p-5
    cursor-pointer
    hover:shadow-2xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
        >
          {" "}
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Shortlisted
          </p>
          <h2 className="text-3xl font-bold text-yellow-500 mt-2">
            {shortlistedCount}
          </h2>
        </div>

        {/* Selected */}
        <div
          onClick={() => setStatusFilter("all")}
          className="
    bg-white
    dark:bg-gray-800
    shadow-lg
    rounded-xl
    p-5
    cursor-pointer
    hover:shadow-2xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
        >
          {" "}
          <p className="text-gray-500 dark:text-gray-400 text-sm">Selected</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {selectedCount}
          </h2>
        </div>

        {/* Rejected */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Rejected</p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {rejectedCount}
          </h2>
        </div>
      </div>

      {/* Filters + Export */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="
              border
              rounded-lg
              px-4
              py-2
              bg-white
              dark:bg-gray-800
              dark:text-white
            "
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="
              border
              rounded-lg
              px-4
              py-2
              bg-white
              dark:bg-gray-800
              dark:text-white
            "
          >
            <option value="ats">Highest ATS</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="match">Highest Match %</option>
          </select>
        </div>

        <button
          onClick={exportCSV}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-4
            py-2
            rounded-lg
            font-semibold
          "
        >
          📊 Export CSV
        </button>
      </div>

      {/* Table */}
      {applications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="dark:text-white">No applicants found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-4 text-left dark:text-white">Candidate</th>

                <th className="p-4 text-left dark:text-white">Email</th>

                <th className="p-4 text-left dark:text-white">ATS Score</th>

                <th className="p-4 text-left dark:text-white">Job Match</th>

                <th className="p-4 text-left dark:text-white">Status</th>

                <th className="p-4 text-left dark:text-white">Resume</th>

                <th className="p-4 text-left dark:text-white">Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-t dark:border-gray-700">
                  <td className="p-4 dark:text-gray-300">
                    {app.candidate?.name}
                  </td>

                  <td className="p-4 dark:text-gray-300">
                    {app.candidate?.email}
                  </td>

                  <td className="p-4 font-bold dark:text-white">
                    {app.atsScore}
                  </td>

                  <td className="p-4">
                    <span
                      className={`
                        font-bold
                        ${
                          app.jobMatchPercentage >= 80
                            ? "text-green-600"
                            : app.jobMatchPercentage >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                        }
                      `}
                    >
                      {app.jobMatchPercentage || 0}%
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`font-bold ${
                        app.status === "selected"
                          ? "text-green-600"
                          : app.status === "rejected"
                            ? "text-red-600"
                            : app.status === "shortlisted"
                              ? "text-yellow-600"
                              : "text-gray-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {app.candidate?.resume ? (
                      <a
                        href={app.candidate.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          bg-blue-600
                          hover:bg-blue-700
                          text-white
                          px-3
                          py-1
                          rounded
                        "
                      >
                        View Resume
                      </a>
                    ) : (
                      <span className="text-gray-500">No Resume</span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateStatus(app._id, "shortlisted")}
                        className="
                          bg-yellow-500
                          hover:bg-yellow-600
                          text-white
                          px-3
                          py-1
                          rounded
                        "
                      >
                        Shortlist
                      </button>

                      <button
                        onClick={() => updateStatus(app._id, "selected")}
                        className="
                          bg-green-600
                          hover:bg-green-700
                          text-white
                          px-3
                          py-1
                          rounded
                        "
                      >
                        Select
                      </button>

                      <button
                        onClick={() => updateStatus(app._id, "rejected")}
                        className="
                          bg-red-600
                          hover:bg-red-700
                          text-white
                          px-3
                          py-1
                          rounded
                        "
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Applicants;
