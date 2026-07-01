# 🧠 HireMind-AI

An AI-powered MERN Stack recruitment platform that helps recruiters hire better candidates using ATS scoring, AI resume analysis, resume parsing, and AI-generated cover letters.

🌐 **Live Demo:** https://hire-mind-ai-beta.vercel.app/

🔗 **Backend API:** https://hiremind-ai-r2pu.onrender.com/

---

## 🚀 Features

### 👨‍💼 Candidate Features

- User Registration & Login (JWT Authentication)
- Profile Management
- Upload Resume (PDF)
- AI Resume Analysis
- AI Cover Letter Generator
- ATS Score Calculation
- Job Match Percentage
- Apply for Jobs
- View Application Status
- Real-time Notifications

### 🏢 Recruiter Features

- Recruiter Dashboard
- Create, Update & Delete Jobs
- View Applicants
- Filter & Sort Applicants
- AI Resume Analysis
- Change Candidate Status
- Recent Applications
- Interview Management

### 🤖 AI Features

- Resume Parsing
- ATS Score Calculation
- AI Resume Analysis
- Smart AI Fallback (Works even without OpenAI credits)
- AI Cover Letter Generation

---

# 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Axios
- React Router
- Tailwind CSS
- Recharts
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Redis
- BullMQ
- Socket.IO
- Cloudinary
- OpenAI API
- Nodemailer

---

# 📂 Project Structure

```
HireMind-AI
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── dashboard
│   │   └── App.jsx
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── workers
│   │   └── app.js
│   └── package.json
│
└── docker-compose.yml
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/kumarsunny-nitian/HireMind-AI.git

cd HireMind-AI
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

## Backend (.env)

```env
PORT=5001

MONGO_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

OPENAI_API_KEY=

EMAIL_USER=

EMAIL_PASS=

REDIS_HOST=

REDIS_PORT=
```

---

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5001/api/v1

VITE_SOCKET_URL=http://localhost:5001
```

---

# 📸 Screenshots

### Login Page

(Add Screenshot)

---

### Candidate Dashboard

(Add Screenshot)

---

### Recruiter Dashboard

(Add Screenshot)

---

### Job Listings

(Add Screenshot)

---

### AI Resume Analysis

(Add Screenshot)

---

### AI Cover Letter Generator

(Add Screenshot)

---

# 📈 Workflow

```
Candidate
     │
     ▼
Upload Resume
     │
     ▼
Resume Parsing
     │
     ▼
ATS Score
     │
     ▼
AI Resume Analysis
     │
     ▼
Apply Job
     │
     ▼
Recruiter Dashboard
     │
     ▼
Shortlist / Reject / Select
```

---

# ✨ Future Improvements

- AI Skill Gap Analysis
- AI Interview Question Generator
- Resume Version History
- Calendar Integration
- Company Dashboard
- Multi-language Support

---

# 👨‍💻 Author

**Sunny Kumar**

B.Tech CSE

National Institute of Technology Rourkela

GitHub: https://github.com/kumarsunny-nitian

LinkedIn: (Add Your LinkedIn)

---

# ⭐ If you like this project

Please give it a ⭐ on GitHub.
