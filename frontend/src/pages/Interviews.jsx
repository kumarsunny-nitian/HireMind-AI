import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const endpoint =
        user?.role === "candidate"
          ? "/interviews/candidate"
          : "/interviews/recruiter";

      const res = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInterviews(res.data.interviews || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10">Loading Interviews...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-6">
        {" "}
        <h1 className="text-3xl font-bold mb-6">Interview Management</h1>
        <div className="grid gap-6">
          {interviews.map((interview) => (
            <div
              key={interview._id}
              className="
                bg-white
                shadow-lg
                rounded-xl
                p-6
              "
            >
              {user?.role !== "candidate" && (
                <>
                  <p>
                    <strong>Candidate:</strong> {interview.candidate?.name}
                  </p>

                  <p>
                    <strong>Email:</strong> {interview.candidate?.email}
                  </p>
                </>
              )}

              <p>
                <strong>Job:</strong> {interview.job?.title}
              </p>

              <p>
                <strong>Scheduled:</strong>{" "}
                {new Date(interview.scheduledAt).toLocaleString()}
              </p>

              <a
                href={interview.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="
                  inline-block
                  mt-4
                  bg-blue-600
                  text-white
                  px-4
                  py-2
                  rounded
                "
              >
                Join Interview
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Interviews;
