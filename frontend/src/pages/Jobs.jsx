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

      console.log(res.data);

      setJobs(res.data.jobs);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Available Jobs
      </h1>
      <p>Total Jobs: {jobs.length}</p>

      <div className="grid gap-4">
        {jobs?.map((job) => (
          <div
            key={job._id}
            className="border rounded-lg p-5 shadow"
          >
            <h2 className="text-xl font-bold">
              {job.title}
            </h2>

            <p>{job.company}</p>

            <p>{job.location}</p>

            <p>₹ {job.salary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;