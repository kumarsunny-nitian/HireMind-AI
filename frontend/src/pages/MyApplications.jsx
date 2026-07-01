import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      const res = await api.get("/applications/my-applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("MY APPLICATIONS RESPONSE:", res.data);

      setApplications(res.data.applications || []);
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setUploadMessage("Please select a PDF file first.");
      return;
    }

    try {
      setUploading(true);
      setUploadMessage("");

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("resume", resumeFile);

      const res = await api.post("/resume/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadMessage(
        `✅ Resume uploaded! Skills found: ${res.data.skills?.join(", ") || "None"}`
      );
    } catch (error) {
      setUploadMessage(
        `❌ Upload failed: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="w-full max-w-6xl mx-auto p-10">

        {/* Resume Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">📄 Upload Resume</h2>

          <p className="text-gray-500 mb-4">
            Upload your resume so we can calculate your ATS score when you apply
            for jobs.
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="mb-4 block"
          />

          <button
            onClick={handleResumeUpload}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>

          {uploadMessage && (
            <p className="mt-4 text-sm font-medium">{uploadMessage}</p>
          )}
        </div>

        {/* Applications List */}
        <h1 className="text-3xl font-bold mb-6">My Applications</h1>

        <p className="mb-4">Total Applications: {applications.length}</p>

        {applications.length === 0 ? (
          <p>No applications found</p>
        ) : (
          applications.map((app) => (
            <div key={app._id} className="border p-4 rounded mb-4">
              <h2 className="font-bold">{app.job?.title}</h2>

              <p>Company: {app.job?.company}</p>

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
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MyApplications;