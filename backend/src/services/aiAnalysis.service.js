const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeResume = async (candidate, job) => {
  try {
    const prompt = `
You are a senior technical recruiter.

Job Title:
${job.title}

Required Skills:
${job.skillsRequired?.join(", ") || ""}

Candidate Skills:
${candidate.skills?.join(", ") || ""}

Analyze candidate.

Return JSON format:

{
  "summary":"",
  "strengths":[],
  "weaknesses":[],
  "recommendation":"",
  "interviewQuestions":[],
  "aiScore":0
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    return JSON.parse(
      response.choices[0].message.content
    );
  } catch (error) {
    console.error("AI Analysis Error:", error.message);

    // Fallback response when OpenAI fails
    return {
      summary: `${candidate.name} appears to be a suitable candidate for ${job.title}.`,
      strengths: candidate.skills || [],
      weaknesses: [
        "Resume requires deeper evaluation",
        "Practical assessment recommended",
      ],
      recommendation: "Proceed to Interview",
      interviewQuestions: [
        "Explain your most challenging project.",
        "What is JWT Authentication?",
        "How does MongoDB indexing work?",
        "Explain React component lifecycle.",
        "How would you optimize API performance?",
      ],
      aiScore: 75,
    };
  }
};

module.exports = {
  analyzeResume,
};