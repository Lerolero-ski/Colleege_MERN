# ShaderLab — Graphics Demo Playground

A complete, high-performance **MERN Stack** (MongoDB, Express, React, Node.js) web application for creating, customizing, and simulating procedural 2D and 3D graphics using the native **HTML5 Canvas API**.

Built with a developer-tool dark aesthetic inspired by modern creative coding playgrounds (ShaderToy, Ray.so, CodePen).

---

## 🌟 Key Features

1. **Dark Developer-Tool Aesthetic:** Sleek charcoal background (`#080a0f`), subtle borders, glowing accent highlights (indigo, violet, cyan, emerald), and clean typography (`JetBrains Mono` and `Inter`).
2. **Procedural Graphics Gallery:**
   - **Neural Particle Constellation:** Autonomous glowing particle nodes forming distance-based meshes with interactive cursor attraction/repulsion.
   - **Kinetic Elastic Spheres:** 2D rigid-body sphere physics featuring gravitational acceleration, air friction drag, wall restitution, and elastic sphere-to-sphere collisions.
   - **Hyperdrive Warp Starfield:** 3D perspective projection space travel simulation with relativistic motion streaks and parallax steering.
   - **Digital Matrix Cyber Rain:** Cascading phosphor alphanumeric and Japanese glyph streams.
3. **Interactive Canvas Playground:**
   - Real-time **Start**, **Pause**, and **Reset** controls.
   - Interactive speed multiplier slider (`0.2x` – `3.0x`).
   - Dynamic particle count / density adjustment.
   - Color palette customization (Cyber Violet, Electric Blue, Matrix Green, Sunset Amber, Neon Pink, Rainbow).
   - Live FPS counter & fullscreen presentation mode.
4. **Full CRUD Operations (REST API):**
   - **Create:** Publish new graphics experiments with title, description, animation type, and parameters.
   - **Read:** Search experiments by keyword or filter by animation category with sorting (Newest, Oldest, Most Viewed, Alphabetical).
   - **Update:** Edit experiment titles, descriptions, and simulation parameters.
   - **Delete:** Remove experiments with safe confirmation dialogs.
5. **Robust Database Layer with Automatic Fallback:**
   - Uses **MongoDB Atlas via Mongoose**.
   - If MongoDB Atlas is not yet configured, the server automatically provides an **in-memory storage fallback** with seeded demos so the application runs 100% out-of-the-box for evaluation and testing without setup blockers.

---

## 🏗️ Architecture & Tech Stack

```
Being_Forced/
├── client/                     # Frontend (React 18 + Vite)
│   ├── src/
│   │   ├── api/                # REST API service client (demoService.js)
│   │   ├── components/         # Navbar, DemoCard, CanvasPlayer, DemoModal, etc.
│   │   ├── graphics/           # Native HTML5 Canvas Engines (Particles, Spheres, Starfield, Matrix)
│   │   ├── pages/              # Dashboard & DemoDetails dedicated views
│   │   ├── App.jsx             # Root layout, routing state, modal management
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind directives & custom glassmorphism styles
│   ├── tailwind.config.js      # Tailwind CSS v3 dark theme configuration
│   ├── vite.config.js          # Vite config with API proxying
│   ├── package.json
│   └── .env.example
├── server/                     # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js               # Mongoose Atlas connector & fallback store
│   ├── controllers/
│   │   └── demoController.js   # Full CRUD handlers, search, filter, health
│   ├── models/
│   │   └── Demo.js             # Mongoose Demo document schema
│   ├── routes/
│   │   └── demoRoutes.js       # REST endpoint routing
│   ├── scripts/
│   │   └── seed.js             # Database seeding script for sample demos
│   ├── server.js               # Express application entry point
│   ├── package.json
│   └── .env.example
├── package.json                # Root orchestration scripts (concurrently)
├── .env.example                # Unified environment variable documentation
└── README.md                   # Project documentation & deployment guide
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or newer)
- **npm** (v9 or newer)
- **MongoDB** (Local instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Installation
Clone the repository and install all dependencies:
```bash
# In the project root:
npm run install:all
```
*(Or install manually in both folders: `cd server && npm install`, then `cd ../client && npm install`)*

---

### 2. Configure Environment Variables

#### Backend Configuration (`server/.env`):
Create `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas URI (or local MongoDB)
# Example for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/shaderlab?retryWrites=true&w=majority
MONGODB_URI=mongodb://127.0.0.1:27017/shaderlab

CLIENT_URL=http://localhost:5173
```

> **Note:** If `MONGODB_URI` is left unconfigured or cannot be reached, the server will log a friendly alert and seamlessly run using an **in-memory fallback store**. All CRUD features remain completely testable.

#### Frontend Configuration (`client/.env`):
Create `client/.env` (or copy from `client/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Seed Database with Initial Demos
Run the seed script to populate sample experiments into MongoDB:
```bash
npm run seed
```
*(Or from server directory: `cd server && npm run seed`)*

Sample output:
```json
{
  "_id": "6ad359a2588fe50b46a57144",
  "title": "Neural Particle Constellation",
  "animationType": "particles",
  "parameters": {
    "speed": 1.2,
    "count": 90,
    "colorScheme": "cyber-violet",
    "interactive": true
  },
  "tags": ["particles", "physics", "interactive", "glow"],
  "author": "ShaderLab Core",
  "views": 142
}
```

---

### 4. Run Locally

Start both the backend server and frontend client concurrently with a single command from the root directory:
```bash
npm run dev
```

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

Alternatively, run each service in separate terminal windows:
```bash
# Terminal 1 - Backend:
cd server
npm run dev

# Terminal 2 - Frontend:
cd client
npm run dev
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | System health and MongoDB connection status | None |
| `GET` | `/api/demos` | Retrieve all demos (with search, filter, sort) | `?search=term&type=particles&sort=newest` |
| `GET` | `/api/demos/:id` | Retrieve single demo by ID (increments views) | None |
| `POST` | `/api/demos` | Create a new graphics experiment | `{ title, description, animationType, parameters, tags, author }` |
| `PUT` | `/api/demos/:id` | Update an existing demo | `{ title, description, parameters, ... }` |
| `DELETE` | `/api/demos/:id` | Delete demo by ID | None |
| `POST` | `/api/demos/seed` | Reset/restore default sample demos | None |

---

## 🚢 Deployment Instructions

### 1. Deploying the Backend (e.g. Render / Railway / Heroku)
1. Push your repository to GitHub.
2. In your deployment dashboard (e.g., Render), create a **New Web Service** pointing to the `server/` directory.
3. Configure settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/shaderlab`
   - `CLIENT_URL=https://your-frontend-domain.vercel.app`

### 2. Deploying the Frontend (e.g. Vercel / Netlify)
1. In Vercel or Netlify, import the GitHub repository.
2. Configure settings:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add Environment Variable:
   - `VITE_API_URL=https://your-backend-domain.onrender.com/api`
4. Deploy!

---

## 🧪 Verification & Testing Checklist

- [x] **Backend API:** All CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`) verified via automated test suite.
- [x] **Database Seeding:** `npm run seed` executes and seeds sample documents.
- [x] **Production Build:** `npm run build --prefix client` compiles with 0 errors.
- [x] **Responsive UI:** Dark theme, glassmorphism cards, responsive navbar and modals.
- [x] **HTML5 Canvas:** Working animation loops for Particles, Bouncing Balls, and Starfield with Start/Pause/Reset.

---

## 📜 License
Developed as a College Project under the MIT License.
