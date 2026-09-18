# 🚀 How to Run HomelyHub

A step-by-step guide to setting up, running, and testing the **HomelyHub** platform locally.

---

## 📋 Prerequisites

Before running the project, make sure you have installed:
- [Node.js](https://nodejs.org/) (version **18.x** or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [Git](https://git-scm.com/) (optional, if cloning)

> [!NOTE]
> HomelyHub has an **automatic in-memory MongoDB fallback** (`mongodb-memory-server`) and a deterministic AI generator fallback. You do **not** need an external MongoDB database or paid API keys to start testing!

---

## ⚡ Quick Start (Windows One-Click)

If you are on Windows, helper scripts are provided in the root directory:

1. **Start both Frontend & Backend**:
   - Double-click [`start-homelyhub.bat`](file:///d:/projects%20and%20certificates/projects/web/homely%20hub/start-homelyhub.bat), or run:
     ```cmd
     .\start-homelyhub.bat
     ```
   - This script automatically checks and installs dependencies, boots the backend on port `5000`, starts Vite frontend on port `5173`, and opens your browser.

2. **Stop all running servers**:
   - Double-click [`stop-homelyhub.bat`](file:///d:/projects%20and%20certificates/projects/web/homely%20hub/stop-homelyhub.bat), or run:
     ```cmd
     .\stop-homelyhub.bat
     ```
   - This cleanly terminates processes running on ports `5000` and `5173`.

---

## 🛠️ Manual Setup & Run Guide (Step-by-Step)

If you prefer to start each service manually (or on macOS/Linux):

### 1️⃣ Backend Setup

Open a terminal and navigate to the `backend` folder:

```bash
cd backend
```

#### Install dependencies:
```bash
npm install
```

#### Environment Variables (`backend/.env`):
A default [`.env`](file:///d:/projects%20and%20certificates/projects/web/homely%20hub/backend/.env) is pre-configured with local development defaults:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=homelyhub_secret_key_jwt_2026_super_secure
JWT_EXPIRES_TIME=7d
COOKIE_EXPIRES_TIME=7

# Optional: Leave blank to use built-in MongoDB Memory Server & mock AI fallback
MONGO_URI=
GROQ_API_KEY=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=support@homelyhub.com
FROM_NAME=HomelyHub
```

#### (Optional) Seed Sample Properties:
To populate the database with initial sample stays:
```bash
npm run seed
```

#### Start the Backend Server:
- **Production mode**:
  ```bash
  npm start
  ```
- **Development mode (auto-reload on save)**:
  ```bash
  npm run dev
  ```

> Backend will be running at: **`http://localhost:5000`**  
> Health check / API root: **`http://localhost:5000/api`**

---

### 2️⃣ Frontend Setup

Open a **separate terminal window** and navigate to the `frontend` folder:

```bash
cd frontend
```

#### Install dependencies:
```bash
npm install
```

#### Start the Vite Development Server:
```bash
npm run dev
```

> Frontend will be running at: **`http://localhost:5173`**

---

## 🌐 URLs & Ports Summary

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend Web App** | [`http://localhost:5173`](http://localhost:5173) | Vite + React + Redux Client |
| **Guest Dashboard** | [`http://localhost:5173/guest/dashboard`](http://localhost:5173/guest/dashboard) | Personal travel stats, itineraries & bookings |
| **Host Dashboard** | [`http://localhost:5173/host/dashboard`](http://localhost:5173/host/dashboard) | Host occupancy, revenue & property analytics |
| **Backend API** | [`http://localhost:5000/api`](http://localhost:5000/api) | Express REST API Server |
| **Properties API** | [`http://localhost:5000/api/properties`](http://localhost:5000/api/properties) | Property list, search & filters |
| **Current User Session** | [`http://localhost:5000/api/auth/me`](http://localhost:5000/api/auth/me) | Active JWT cookie check |

---

## 👥 Demo Accounts Quick Reference

You can log in directly with 1-click buttons on [`/login`](http://localhost:5173/login) or use these credentials:

| Role | Name | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Host** | Aarav Sharma | `host@homelyhub.com` | `Password@123` | Full Host Dashboard, listing management & incoming reservations |
| **Guest** | Aditya Rao | `aditya@example.com` | `Password@123` | Active confirmed booking at Rainforest Treehouse |
| **Guest** | Meera Nair | `meera@example.com` | `Password@123` | Past stay reservation at Heritage Haveli |
| **Guest** | Priya Patel | `priya@example.com` | `Password@123` | Active stay at Sea-Breeze Villa |
| **Guest** | Ananya Deshmukh | `ananya@example.com` | `Password@123` | Upcoming stay at Skyline Penthouse |

---

## 🧪 Testing Core Features

Once both servers are running:
1. **Browse Listings**: Open `http://localhost:5173` to see stay listings, search by city, filter by price, and explore Leaflet map badges.
2. **User Registration & Login**: Click the user menu in the top-right navbar to register an account and log in.
3. **AI Trip Planner**: Navigate to the **AI Trip Planner** page to input your destination, budget, and party size for auto-generated itineraries.
4. **AI Listing Generator**: When adding a property as a host, input amenities and location, then use the AI button to auto-craft descriptive copy.
5. **Double-Booking Guard**: Try booking dates for a property; any overlapping reservations will be blocked.

---

## ❓ Troubleshooting

- **Port already in use (`EADDRINUSE: 5000` or `5173`)**:
  - Run [`stop-homelyhub.bat`](file:///d:/projects%20and%20certificates/projects/web/homely%20hub/stop-homelyhub.bat) on Windows, or find and kill the process:
    ```bash
    # Windows PowerShell
    Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
    ```
- **CORS / Cookie Issues**:
  - Ensure the frontend is running on `http://localhost:5173` and backend is on `http://localhost:5000` so that HTTP-only credentials cookies match the `CLIENT_URL` configuration.
