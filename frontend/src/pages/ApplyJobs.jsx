import { useEffect, useState } from "react";
import api from "../services/api";

function ApplyJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await api.get("/jobs");
    setJobs(res.data.jobs);
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

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Apply Jobs</h1>

      {jobs.map((job) => (
        <div
          key={job._id}
          style={{
            border: "1px solid black",
            marginBottom: "20px",
            padding: "15px",
          }}
        >
          <h2>{job.title}</h2>

          <p>{job.company}</p>

          <button
            onClick={() => applyJob(job._id)}
          >
            Apply Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default ApplyJobs;