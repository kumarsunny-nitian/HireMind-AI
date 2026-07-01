import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    skills: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
    } catch (error) {
      console.log("PROFILE ERROR:", error.response?.data || error.message);
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.put(
        "/users/profile",
        {
          name: profile.name,
          phone: profile.phone,
          companyName: profile.companyName,
          skills: profile.skills,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showSuccess("✅ Profile updated successfully");
      setProfile(res.data.user);
    } catch (error) {
      console.log(error.response?.data || error.message);
      showSuccess("❌ Failed to update profile");
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) {
      showSuccess("❌ Please select a PDF first.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("resume", resumeFile);
      await api.post("/resume/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showSuccess("✅ Resume uploaded successfully");
      setResumeFile(null);
      fetchProfile();
    } catch (error) {
      console.log(error.response?.data || error.message);
      showSuccess("❌ Failed to upload resume");
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile({ ...profile, skills: [...profile.skills, trimmed] });
    }
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">My Profile</h1>
        <p className="text-gray-500 mb-4">Manage your account information.</p>

        {/* Success Toast */}
        {successMessage && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 font-medium text-sm">
            {successMessage}
          </div>
        )}

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-white">
              Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-white">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border rounded-lg px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">
              Email cannot be changed.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-white">
              Phone Number
            </label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-3 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-white">
              Company
            </label>
            <input
              type="text"
              value={profile.companyName}
              onChange={(e) =>
                setProfile({ ...profile, companyName: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-3 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-white">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium transition"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-blue-400 hover:text-red-500 font-bold transition-colors"
                    >
                      x
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No skills added yet.</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. React, Node.js, Python"
                className="flex-1 border rounded-lg px-4 py-3 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <button
                onClick={addSkill}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Press Enter or click Add to add a skill.
            </p>
          </div>

          {/* Resume */}
          <div>
            <label className="block text-sm font-semibold mb-3 dark:text-white">
              Resume
            </label>

            {/* Current Resume */}
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Current Resume
              </p>
              {profile.resume ? (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  View Resume
                </a>
              ) : (
                <p className="text-gray-400 text-sm">No resume uploaded yet.</p>
              )}
            </div>

            {/* Upload New Resume */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Upload New Resume
              </p>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition">
                  Choose PDF
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {resumeFile ? resumeFile.name : "No file chosen"}
                </span>
              </div>
              <button
                onClick={uploadResume}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                Upload
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={updateProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
