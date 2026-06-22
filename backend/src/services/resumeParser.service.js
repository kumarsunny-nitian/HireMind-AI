const skillsDatabase = require("../utils/skills");

const extractSkills = (text) => {
  // Handle null/undefined text safely
  const lowerText = (text || "").toLowerCase();

  const foundSkills = skillsDatabase.filter((skill) =>
    lowerText.includes(skill.toLowerCase())
  );

  // Remove duplicates
  return [...new Set(foundSkills)];
};

module.exports = {
  extractSkills,
};