const User = require("../models/user.model");
const cloudinary = require("../config/cloudinary");

const pdf = require("pdf-parse");

const {
  extractSkills,
} = require("../services/resumeParser.service");

exports.uploadResume = async (req, res) => {
  try {
    console.log("FILE DATA:", req.file);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume required",
      });
    }

    // Extract PDF Text
    const pdfData = await pdf(req.file.buffer);

    const extractedText = pdfData.text || "";

    // Extract Skills
    const extractedSkills =
      extractSkills(extractedText);

    // Upload Resume to Cloudinary
    const fileBase64 =
      req.file.buffer.toString("base64");

    const dataURI =
      `data:application/pdf;base64,${fileBase64}`;

    const result =
      await cloudinary.uploader.upload(
        dataURI,
        {
          resource_type: "raw",
          folder: "hiremind/resumes",
        }
      );

    // Save Resume URL
    user.resume = result.secure_url;

    // Save Extracted Skills
    user.skills = extractedSkills;
    user.parsedSkills = extractedSkills;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Resume uploaded successfully",
      resumeUrl: result.secure_url,
      skills: extractedSkills,
      parsedSkills: extractedSkills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};