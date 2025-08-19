# DevPath

##📂 Monorepo Structure
```bash
devpath/
│
├── server/                # Express or Django REST backend
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