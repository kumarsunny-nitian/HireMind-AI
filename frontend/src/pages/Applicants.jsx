import { useEffect, useState } from "react";
import api from "../services/api";

function Applicants() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

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

      const res = await api.get(`/applications/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data.applications || []);
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-10">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Applicants Management
      </h1>

      <button
        onClick={exportCSV}
        className="
          mb-6
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
