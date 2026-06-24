import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function ResumeAnalysis() {
  const { applicationId } = useParams();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/ai/analysis/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAnalysis(res.data.analysis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10">Loading Analysis...</div>;
  }

  if (!analysis) {
    return <div className="p-10">No Analysis Found</div>;
  }

  return (
    <>
    <Navbar />
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">AI Resume Analysis</h1>

        <div className="mb-6">
          <h2 className="text-xl font-bold">AI Score</h2>

          <p className="text-5xl font-bold text-blue-600">
            {analysis.aiScore}/100
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold">Summary</h2>

          <p>{analysis.summary}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold">Strengths</h2>

          <ul className="list-disc pl-6">
            {analysis.strengths?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold">Weaknesses</h2>

          <ul className="list-disc pl-6">
            {analysis.weaknesses?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold">Recommendation</h2>

          <p>{analysis.recommendation}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Interview Questions</h2>

          <ul className="list-decimal pl-6">
            {analysis.interviewQuestions?.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </>
  );
}

export default ResumeAnalysis;
