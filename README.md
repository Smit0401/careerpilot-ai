# 🚀 CareerPilot AI

An AI-powered placement preparation platform that analyzes resumes and job descriptions to generate personalized interview reports, identify skill gaps, recommend learning resources, and create structured study roadmaps.

---

## ✨ Features

### 📄 AI Interview Report Generation
- Upload resume (PDF)
- Add self-description
- Paste job description
- Generate:
  - Match score
  - Technical interview questions
  - Behavioral interview questions
  - Skill gap analysis
  - Personalized learning roadmap

### 📚 Learning Resources
- Curated YouTube videos
- Documentation recommendations
- Redis caching for faster responses

### 🎯 Self Study Mode
- Generate topic-wise learning plans
- Set daily study duration
- Placement-oriented roadmap generation
- Resource recommendations

### 📑 AI Resume Generator
- ATS-friendly resume generation
- Tailored according to target job description
- PDF export support

### 🔐 Authentication
- User registration
- Login & logout
- Protected routes

### 📜 History
- Store previously generated reports
- Revisit interview analyses anytime

---

# 🛠 Tech Stack

## Frontend
- React
- Vite
- Axios
- Context API
- CSS

## Backend
- Node.js
- Express.js

## Database
- MongoDB Atlas

## Caching
- Redis

## AI
- Google Gemini API

## Deployment
- Frontend: Vercel
- Backend: Railway

---

# 🏗 Architecture

```
                React Frontend
                       │
                       ▼
                Express Backend
                       │
       ┌───────────────┼───────────────┐
       ▼                               ▼
Google Gemini API                Redis Cache
       │
       ▼
MongoDB Atlas
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/Smit0401/careerpilot-ai.git
cd careerpilot-ai
```

---

## Backend Setup

```bash
cd Backend

npm install
```

Create `.env`

```env
GOOGLE_GENAI_API_KEY=

MONGO_URI=

JWT_SECRET=

REDIS_URL=

CLIENT_URL=http://localhost:5173

GEMINI_MODEL=gemini-2.5-flash
```

Run backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd Frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:3000
```

Run frontend

```bash
npm run dev
```

---

# 🌐 Deployment

### Frontend
Deployed on **Vercel**

### Backend
Deployed on **Railway**

### Database
**MongoDB Atlas**

### Cache
**Redis**

---

# 📁 Project Structure

```
CareerPilot_AI
│
├── Backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   │
│   ├── server.js
│   └── package.json
│
├── Frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   └── styles
│   │
│   └── package.json
│
├
└── README.md
```

---

# 🔑 Environment Variables

### Backend

| Variable | Description |
|------------|-------------|
| GOOGLE_GENAI_API_KEY | Gemini API key |
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | JWT secret |
| REDIS_URL | Redis connection URL |
| CLIENT_URL | Frontend URL |
| GEMINI_MODEL | Gemini model name |

---

### Frontend

| Variable | Description |
|------------|-------------|
| VITE_API_URL | Backend URL |

---

# 🚧 Known Issues

- Gemini API occasionally returns 503 during peak demand.
- Resume PDF generation on Railway requires Puppeteer optimization.
- Documentation recommendations in Self Study need improvement.

---

# 🔮 Future Improvements

- Faster Gemini responses with retry mechanism
- Better error handling
- One-page Jake's Resume template
- Docker support
- Jest unit tests
- Playwright E2E testing
- UI improvements
- Better docs recommendation engine
- Rate limiting and monitoring

---

# 👨‍💻 Author

### Smit Shah

GitHub:
https://github.com/Smit0401

---
