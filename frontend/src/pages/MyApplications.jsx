import { useEffect, useState } from "react";
import api from "../services/api";

function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      const res = await api.get(
        "/applications/my-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "MY APPLICATIONS RESPONSE:",
        res.data
      );

      setApplications(
        res.data.applications || []
      );
    } catch (error) {
      console.log(
        "ERROR:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        My Applications
      </h1>

      <p className="mb-4">
        Total Applications: {applications.length}
      </p>

      {applications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        applications.map((app) => (
          <div
            key={app._id}
            className="border p-4 rounded mb-4"
          >
            <h2 className="font-bold">
              {app.job?.title}
            </h2>

            <p>
              Company: {app.job?.company}
            </p>

            <p>
              Status:
              <span
                className={`ml-2 font-bold ${
                  app.status === "selected"
                    ? "text-green-600"
                    : app.status === "rejected"
                    ? "text-red-600"
                    : app.status ===
                      "shortlisted"
                    ? "text-yellow-600"
                    : "text-gray-600"
                }`}
              >
                {app.status}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyApplications;