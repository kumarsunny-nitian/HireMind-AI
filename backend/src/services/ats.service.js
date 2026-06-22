const normalizeSkill = (skill) => {
  return skill
    .toLowerCase()
    .replace(".js", "")
    .replace("javascript", "js")
    .replace("reactjs", "react")
    .trim();
};

const calculateATSScore = (
  candidateSkills,
  jobSkills
) => {
  const matchedSkills =
    candidateSkills.filter((skill) =>
      jobSkills.some(
        (jobSkill) =>
          normalizeSkill(jobSkill) ===
          normalizeSkill(skill)
      )
    );

  const score =
    jobSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length /
            jobSkills.length) *
            100
        );

  return {
    score,
    matchedSkills,
  };
};

module.exports = {
  calculateATSScore,
};