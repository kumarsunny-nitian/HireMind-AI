import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  const [companyFilter, setCompanyFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 5;

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
        },
      );

      console.log("APPLY RESPONSE:", res.data);

      alert(res.data.message);
    } catch (error) {
      console.log("APPLY ERROR:", error.response?.data);

      alert(error.response?.data?.message || "Failed to apply");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());

    const matchesLocation = !locationFilter || job.location === locationFilter;

    const matchesCompany = !companyFilter || job.company === companyFilter;

    const matchesSalary =
      !salaryFilter || Number(job.salary) >= Number(salaryFilter);

    return matchesSearch && matchesLocation && matchesCompany && matchesSalary;
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <>
      <Navbar />
      <div className="w-full max-w-6xl mx-auto p-10">
        {" "}
        <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
                      w-full
                      p-3
                      mb-6
                      border
                      rounded-lg
                      shadow-sm
                    "
        />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="
    w-full
    p-3
    mb-6
    border
    rounded-lg
    shadow-sm
  "
        >
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="
    w-full
    p-3
    mb-6
    border
    rounded-lg
    shadow-sm
  "
          >
            <option value="">All Companies</option>

            <option value="Google">Google</option>

            <option value="Microsoft">Microsoft</option>

            <option value="Amazon">Amazon</option>
          </select>
          <option value="">All Locations</option>

          <option value="Bangalore">Bangalore</option>

          <option value="Hyderabad">Hyderabad</option>

          <option value="Mumbai">Mumbai</option>

          <option value="Delhi">Delhi</option>

          <option value="Remote">Remote</option>
        </select>
        <select
          value={salaryFilter}
          onChange={(e) => setSalaryFilter(e.target.value)}
          className="
    w-full
    p-3
    mb-6
    border
    rounded-lg
    shadow-sm
  "
        >
          <option value="">All Salaries</option>

          <option value="50000">50,000+</option>

          <option value="100000">100,000+</option>

          <option value="200000">200,000+</option>
        </select>
        <p>Total Jobs: {jobs.length}</p>
        <p>Filtered Jobs: {filteredJobs.length}</p>
        {currentJobs.map((job) => (
          <div key={job._id} className="border p-4 rounded-lg mb-4 shadow">
            <h2 className="text-xl font-bold">{job.title}</h2>

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
      <div className="flex justify-center gap-2 mt-6">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}

export default Jobs;
