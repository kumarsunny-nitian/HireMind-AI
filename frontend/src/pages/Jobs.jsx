import { useEffect, useState } from "react";
import api from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs");

      console.log("API Response:", res.data);

      setJobs(res.data.jobs || []);
    } catch (error) {
      console.error(error);
    }
  };

  const applyJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        `/applications/apply/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("APPLY RESPONSE:", res.data);

      alert(res.data.message);
    } catch (error) {
      console.log(
        "APPLY ERROR:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to apply"
      );
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Available Jobs
      </h1>

      <p>Total Jobs: {jobs.length}</p>

      {jobs.map((job) => (
        <div
          key={job._id}
          className="border p-4 rounded-lg mb-4 shadow"
        >
          <h2 className="text-xl font-bold">
            {job.title}
          </h2>

          <p>Company: {job.company}</p>

          <p>Location: {job.location}</p>

          <p>Salary: ₹ {job.salary}</p>

          <button
            onClick={() => applyJob(job._id)}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default Jobs;