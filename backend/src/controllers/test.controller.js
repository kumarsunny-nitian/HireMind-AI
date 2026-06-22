exports.candidateRoute = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Candidate Route Accessed",
  });
};

exports.recruiterRoute = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Recruiter Dashboard",
  });
};

exports.adminRoute = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin Dashboard",
  });
};