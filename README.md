<p align="center">
  <img src="homely-hub-logo.png" alt="Homely Hub Logo" width="180" />
</p>

<h1 align="center">HomelyHub</h1>

<p align="center">
  <strong>Seamless Property Discovery Connecting Verified Owners and Tenants</strong><br />
  Built with MERN Stack • Redux Toolkit • Groq AI • Leaflet Maps • JWT Cookie Auth
</p>

<p align="center">
  <img src="house-animation.svg" alt="HomelyHub Floating Sanctuary Animation" width="620" />
</p>

---

## 📌 Project Overview
**HomelyHub** is an end-to-end stay reservation, host analytics, and intelligent trip planning platform. It eliminates common industry pain points such as accidental double bookings, lack of real-time conflict detection, difficulty writing attractive property descriptions, and fragmented trip planning across multiple sites.

Featuring a modern **Nordic Frost & Electric Violet** interface, buttery-smooth theme transitions, and responsive controls, HomelyHub offers an intuitive experience for both travelers and property owners.

---

## ✨ Dynamic Visual & Animation Features

- **🏠 Interactive Living Sanctuary Animation**:
  - Live animated SVG and CSS physics: Floating villa with smooth levitation dynamics (`houseFloat`).
  - Staged chimney smoke stream (`chimneySmoke`) and breathing warm golden window light cycles (`windowGlow`).
  - Constellation night-sky twinkle effects and ambient radial glow.
- **🎨 Nordic Frost & Electric Violet Palette**:
  - Light mode: Glacial slate background (`#f8fafc`) with translucent frosted ice surfaces and vibrant electric indigo accents (`#6366f1`).
  - Dark mode: Deep midnight slate (`#060813`) with subtle indigo glow borders (`rgba(99, 102, 241, 0.18)`) and radiant violet text highlights (`#818cf8`).
- **💫 Circular Ripple Theme Transition**:
  - Originates from the exact center coordinates of the toggle button.
  - Powered by the native View Transitions API with spring easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **🔎 Smooth Micro-Interactions**:
  - Continuous curvature squircle inputs (`border-radius: 16px`) and capsule buttons with subtle tactile press physics (`scale(0.975)`).
  - Cinematic slow-zoom on property cards (`scale(1.05)` with `cubic-bezier(0.16, 1, 0.3, 1)`).
  - Hidden main window scroll track with custom 5px minimalist internal container scrollbars.
- **Precision Typography & Layout**:
  - System font stack (`-apple-system`, `BlinkMacSystemFont`, `Inter`, `SF Pro`) with optical kerning and refined letter-spacing.
  - Consistent capsule radii, border-box geometry, and glassmorphic depth (`saturate(180%) blur(20px)`).

---

## 🚀 Core Features

<p align="center">
  <img src="features-ticker.svg" alt="Core Platform Engines" width="760" />
</p>


### 🛡️ Double Booking & Date Overlap Guard
- Conflict condition: `existingStart < requestedEnd && existingEnd > requestedStart`
- Atomic `$push` of reservation intervals into `property.currentBookings`
- Real-time client-side and server-side overlap validation blocks clashing dates immediately

### 🤖 AI Property Description Writer
- Powered by **Groq SDK** (`llama-3.1-8b-instant`) with deterministic fallback
- Generates 3-4 sentence listing copy using *strictly* provided amenities and location details—no hallucinated claims

### 🗺️ AI Trip Planner
- Nightly Budget Calculator: $\text{Nightly Budget} = \lfloor \text{Total Budget} \div \text{Days} \rfloor$
- Structured day-by-day itineraries (Morning, Afternoon, Evening) matching user party size and preferences
- Curates matching properties within the calculated price ceiling

### 📊 Comprehensive Host & Guest Dashboards
- **Host Dashboard**:
  - Visual monthly revenue bar charts and capacity utilization gauges
  - Scrollable **My Properties & Occupancy** list with real-time status badges
  - Incoming arrivals log, guest details inspection, and booking management
- **Guest Dashboard**:
  - Lifetime travel spend and nights stayed metrics
  - Active and upcoming itinerary cards with instant check-in countdowns

### 🔐 Security & Session Persistence
- Secure HTTP-only JWT cookies with `SameSite` configuration
- Automatic session hydration via `/api/auth/me` on application boot
- Password hashing with `bcrypt` in Mongoose `pre('save')` hooks
- Time-limited SHA256 hashed password reset tokens via Nodemailer

### 🗺️ Interactive Maps
- Powered by Leaflet (`react-leaflet`) with custom price pill markers and interactive property popups

---

## 📂 Project Structure

```
homely hub/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection with MongoMemoryServer fallback
│   ├── controllers/
│   │   ├── aiController.js       # Groq AI description writer & trip planner
│   │   ├── authController.js     # Auth, session hydration, password recovery
│   │   ├── bookingController.js  # Booking creation, analytics & overlap checks
│   │   ├── notificationController.js # Real-time host & guest stay alerts
│   │   └── propertyController.js # Stays CRUD, filtering & search
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT cookie verification & role guards
│   │   └── errorMiddleware.js    # Centralized error handler
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Notification.js
│   │   ├── Property.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── propertyRoutes.js
│   ├── utils/
│   │   ├── apiFeatures.js        # Search, filter, paginate (12/page)
│   │   ├── seeder.js             # Initial stays across top destinations
│   │   └── sendEmail.js          # Nodemailer + Mailgen email generator
│   ├── .env                      # Backend environment configuration
│   ├── package.json
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosClient.js    # Axios instance with credentials enabled
│   │   ├── components/
│   │   │   ├── FilterBar.jsx     # Category strip, dates, price & guest filters
│   │   │   ├── Footer.jsx        # Responsive navigation footer
│   │   │   ├── Logo.jsx          # Vector brand logo with dynamic subtitle
│   │   │   ├── MapView.jsx       # Interactive Leaflet map
│   │   │   ├── Navbar.jsx        # Translucent header & profile menu
│   │   │   ├── NotificationCenter.jsx # Live booking notification center
│   │   │   ├── PropertyCard.jsx  # Carousel image card with rating & price
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ThemeToggle.jsx   # Circular ripple dark/light mode toggle
│   │   ├── context/
│   │   │   └── ThemeContext.jsx  # System, light & dark theme manager
│   │   ├── features/
│   │   │   ├── ai/aiSlice.js
│   │   │   ├── auth/authSlice.js
│   │   │   ├── bookings/bookingSlice.js
│   │   │   └── properties/propertySlice.js
│   │   ├── pages/
│   │   │   ├── AddPropertyPage.jsx
│   │   │   ├── AITripPlannerPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── GuestDashboardPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── HostDashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MyBookingsPage.jsx
│   │   │   ├── PropertyDetailPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css             # Design tokens, themes & animations
│   │   ├── main.jsx
│   │   └── store.js              # Redux Toolkit store
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── start-homelyhub.bat           # 1-click start script (Windows)
├── stop-homelyhub.bat            # 1-click stop script (Windows)
├── RUN_GUIDE.md                  # Comprehensive run & troubleshooting manual
└── README.md
```

---

## ⚡ Quick Start

### 1-Click Launch (Windows)
Double-click `start-homelyhub.bat` or run:
```cmd
.\start-homelyhub.bat
```
*Automatically installs dependencies, runs backend on port `5000`, starts frontend on port `5173`, and opens the browser.*

### Manual Start

#### Backend:
```bash
cd backend
npm install
npm run dev
```
> Running at: `http://localhost:5000`  
> In-memory MongoDB starts automatically if no external MongoDB URI is set.

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```
> Running at: `http://localhost:5173`

---

## 👥 Demo Accounts Quick Reference

| Role | Name | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Host** | Aarav Sharma | `host@homelyhub.com` | `Password@123` | Host analytics, listing management & incoming reservations |
| **Guest** | Aditya Rao | `aditya@example.com` | `Password@123` | Confirmed booking at Rainforest Treehouse |
| **Guest** | Meera Nair | `meera@example.com` | `Password@123` | Past stay reservation at Heritage Haveli |

*(1-click demo login buttons are provided on the login page)*

---

## 📄 License
This project is open-source under the MIT License.
