# DevPath

## 📌 Features

- **User Management**
  - Protected routes for role-based users.
  -	Users can create profiles (skills, education, resume, portfolio).
  -	Profiles can be public or restricted.
  -	Login via email/Google/GitHub with JWT-based authentication.

- **Scholarship & Internship Finder**
  -	CRUD (Create/Read/Update/Delete) entries for scholarships and internships.
  -	Filter by location, eligibility, deadlines.
  -	Internship transparency: Users leave reviews (rating, salary, culture).

- **Peer Review Hub**
  - Upload resumes, essays, or code snippets.
  -	Other users can review and give feedback.
  -	Reputation points for reviewers (gamification).

- **AI Interview Coach**
  -	Coding interview simulation (Problem Solving problems).
  -	Behavioral interview mock with AI-generated feedback.
  -	Score tracking & improvement suggestions.

- **DSA/Problem Solving Progress Tracker**
  -	Users log problems solved (manual entry or API sync).
  -	Leaderboards (university, global, friends).
  -	Weak-area detection & recommendations

- **Side Project Showcase**
  -	Users upload projects (title, description, repo link, screenshots).
  -	Others can like/comment/offer collaboration.



## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, MongoDB (Mongoose ODM)
- **Workflow Automation:** Upstash Workflow
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing** Bcrypt.js
- **Email Service:** Nodemailer
- **Date Handling:** Day.js


## 📂 Project Structure

```bash
devpath/
│
├── server/                # Node.js and Express REST Back-End
│   ├── src/
│   │   ├── config/         # DB, env configs
│   │   ├── models/         # Database schemas (User, Internship, Review, etc.)
│   │   ├── controllers/    # Business logic for each feature
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # External APIs (GitHub, Leetcode, AI)
│   │   ├── middlewares/    # Auth, validation
│   │   └── utils/          # Helper functions
│   ├── tests/
│   └── server.js
│
├── client/                 # Front-End               
│
├── ai-service/             # AI services (Models and APIs)
│
├── docs/                   # SRS, architecture diagrams, API docs
├── package.json 
└── README.md

```

## ⚙️ Installation & Setup

1. **Clone the repository**
```bash
    git clone https://github.com/ziadismael/DevPath
    cd DevPath
```

## 📝 Diagrams
- **Use Case Diagram:**

![Use Case Diagram](docs/DevPath%20Use%20Case%20Diagram.png)

- **Database ERD:**

![Database ERD](docs/DevPath%20Database%20ERD.png)