const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateCoverLetter = async (candidate, job) => {
  try {
    const prompt = `
Generate a professional cover letter.

Candidate Name:
${candidate.name}

Skills:
${(candidate.parsedSkills || candidate.skills || []).join(", ")}

Job Title:
${job.title}

Company:
${job.company}

Job Description:
${job.description}

Write a professional cover letter suitable for this job.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.log("OpenAI Cover Letter Error:", error.message);

    const skills = (candidate.parsedSkills || candidate.skills || []).join(
      ", ",
    );

    return `Dear Hiring Manager,

I am excited to apply for the ${job.title} position at ${job.company}.

My background includes experience with ${skills}, and I have worked on projects that strengthened my problem-solving and software development skills. I am confident that my technical knowledge and eagerness to learn will allow me to contribute effectively to your team.

I am particularly interested in this opportunity because it aligns with my skills and career goals. I would welcome the chance to discuss how I can contribute to ${job.company}.

Thank you for considering my application. I look forward to hearing from you.

Sincerely,

${candidate.name}`;
  }
};
