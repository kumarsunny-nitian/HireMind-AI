import { useEffect, useState } from "react";
import api from "../services/api";

function Applicants() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const updateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        `/applications/status/${applicationId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data);

      fetchApplicants();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      const jobId = "6a3a37f66c703e0fce51c607";

      const res = await api.get(`/applications/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("RESPONSE:", res.data);

      setApplications(res.data.applications || []);
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  };
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Applicants</h1>

      {applications.length === 0 ? (
        <p>No applicants found</p>
      ) : (
        applications.map((app) => (
          <div key={app._id} className="border p-4 rounded mb-4">
            <h2 className="font-bold">{app.candidate.name}</h2>

            <p>Email: {app.candidate.email}</p>

            <p>ATS Score: {app.atsScore}</p>

            <p>
              Status:
              <span
                className={`ml-2 font-bold ${
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
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => updateStatus(app._id, "shortlisted")}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Shortlist
              </button>

              <button
                onClick={() => updateStatus(app._id, "selected")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Select
              </button>

              <button
                onClick={() => updateStatus(app._id, "rejected")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Applicants;
