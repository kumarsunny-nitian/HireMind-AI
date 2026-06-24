import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Analysis() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        `/applications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(
        res.data.application.aiAnalysis
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        Loading Analysis...
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-10">
        No Analysis Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6">
          AI Resume Analysis
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            AI Score
          </h2>

          <p className="text-4xl text-blue-600 font-bold">
            {analysis.aiScore}/100
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Summary
          </h2>

          <p>{analysis.summary}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Strengths
          </h2>

          <ul className="list-disc ml-6">
            {analysis.strengths?.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Weaknesses
          </h2>

          <ul className="list-disc ml-6">
            {analysis.weaknesses?.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Recommendation
          </h2>

          <p>
            {analysis.recommendation}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Interview Questions
          </h2>

          <ul className="list-disc ml-6">
            {analysis.interviewQuestions?.map(
              (q, index) => (
                <li key={index}>
                  {q}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Analysis;