import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import ApplyJobs from "./pages/ApplyJobs";
import MyApplications from "./pages/MyApplications";
import Applicants from "./pages/Applicants";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import Interviews from "./pages/Interviews";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/apply-jobs" element={<ApplyJobs />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/applicants" element={<Applicants />} />
        <Route path="/analysis/:applicationId" element={<ResumeAnalysis />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
