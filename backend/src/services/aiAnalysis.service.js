// ai.Analysis.service.js

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

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("AI Analysis Error:", error.message);

    const candidateSkills = candidate.skills || [];
    const requiredSkills = job.skillsRequired || [];

    const matchedSkills = candidateSkills.filter((skill) =>
      requiredSkills.some(
        (required) => required.toLowerCase() === skill.toLowerCase(),
      ),
    );

    const missingSkills = requiredSkills.filter(
      (skill) =>
        !candidateSkills.some(
          (candidateSkill) =>
            candidateSkill.toLowerCase() === skill.toLowerCase(),
        ),
    );

    const score =
      requiredSkills.length > 0
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
        : 80;

    return {
      summary: `${candidate.name} has ${matchedSkills.length} matching skills out of ${requiredSkills.length} required for the ${job.title} position.`,

      strengths:
        matchedSkills.length > 0
          ? matchedSkills
          : ["Basic technical knowledge"],

      weaknesses:
        missingSkills.length > 0
          ? missingSkills
          : ["No major weaknesses detected"],

      recommendation:
        score >= 80
          ? "Strongly Recommended"
          : score >= 60
            ? "Recommended for Interview"
            : "Needs Additional Screening",

      interviewQuestions: [
        `Explain your experience with ${requiredSkills[0] || "JavaScript"}.`,
        `Describe a project related to ${job.title}.`,
        "How do you solve difficult bugs?",
        "Explain REST API design.",
        "Describe your biggest technical challenge.",
      ],

      aiScore: score,
    };
  }
};

module.exports = {
  analyzeResume,
};
