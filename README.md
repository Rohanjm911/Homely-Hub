# HomelyHub 🏡
> **AI-Powered Stay Booking & Travel Planning Web Application**  
> Built with MERN Stack • Redux Toolkit • Groq AI • Leaflet Maps • JWT Cookie Auth

---

## 📌 Project Overview
HomelyHub is an end-to-end Airbnb-like stay reservation and trip planning platform built as specified in the WSA Internship presentation deck. It eliminates common pain points such as accidental double bookings, difficulty writing attractive property descriptions, and fragmented trip planning across multiple sites.

---

## 🚀 Key Features

- **Double Booking & Date Overlap Guard**:
  - Overlap check: `existingStart < requestedEnd && existingEnd > requestedStart`
  - Atomic `$push` of dates into `property.currentBookings`
  - Clashing dates are automatically hidden from search results
- **AI Property Description Writer**:
  - Powered by **Groq SDK** (`llama-3.1-8b-instant`) with local deterministic fallback
  - Generates 3-4 sentence listing copy using *strictly* the details provided—no hallucinated amenities
- **AI Trip Planner**:
  - Computes $\text{Nightly Budget} = \lfloor \text{Total Budget} \div \text{Days} \rfloor$
  - Generates structured day-by-day JSON itineraries (Morning, Afternoon, Evening)
  - Filters matching stays in the destination fitting the nightly budget
- **Search & Pagination**:
  - Custom `APIFeatures` class for regex search, price/amenity filtering, sorting, and **12 properties per page** pagination
- **Security & Session Persistence**:
  - HTTP-only JWT cookies with `sameSite` configuration
  - `/api/auth/me` endpoint called on mount to restore user session on refresh
  - `bcrypt` hashing in Mongoose `pre('save')` hook with `select: false`
  - `changedPasswordAfter` validation invalidates stale tokens after password change
  - 10-minute SHA256 hashed password reset token via Nodemailer/Mailgen
- **Interactive Maps**:
  - Leaflet Maps (`react-leaflet`) with custom price badge markers and popup previews

---

## 📂 Project Structure

```
homely hub/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection with MongoMemoryServer fallback
│   ├── controllers/
│   │   ├── aiController.js       # Groq AI description writer & trip planner
│   │   ├── authController.js     # Auth, session, password reset
│   │   ├── bookingController.js  # Booking creation & overlap checks
│   │   └── propertyController.js # Stays CRUD & search filtering
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT cookie protection & token safety
│   │   └── errorMiddleware.js    # Centralized error handler
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Property.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── propertyRoutes.js
│   ├── utils/
│   │   ├── apiFeatures.js        # Search, filter, paginate (12/page)
│   │   ├── seeder.js             # Initial stays across top destinations
│   │   └── sendEmail.js          # Nodemailer + Mailgen email generator
│   ├── .env                      # Backend environment variables
│   ├── package.json
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosClient.js    # Axios with credentials enabled
│   │   ├── components/
│   │   │   ├── FilterBar.jsx     # City chips, dates, price & guest filters
│   │   │   ├── Footer.jsx
│   │   │   ├── MapView.jsx       # Leaflet interactive map
│   │   │   ├── Navbar.jsx        # Navigation & profile avatar menu
│   │   │   ├── PropertyCard.jsx  # Card with carousel, ratings, price
│   │   │   └── ProtectedRoute.jsx
│   │   ├── features/
│   │   │   ├── ai/aiSlice.js
│   │   │   ├── auth/authSlice.js
│   │   │   ├── bookings/bookingSlice.js
│   │   │   └── properties/propertySlice.js
│   │   ├── pages/
│   │   │   ├── AddPropertyPage.jsx
│   │   │   ├── AITripPlannerPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MyBookingsPage.jsx
│   │   │   ├── PropertyDetailPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── store.js              # Redux Toolkit store
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 🛠️ How to Run Locally

### 1. Start the Backend
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000` (automatically spins up embedded MongoDB and seeds listings if no external `MONGO_URI` is provided).*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 👤 Demo Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Traveler (Guest)** | `guest@homelyhub.com` | `Password@123` |
| **Property Owner (Host)** | `host@homelyhub.com` | `Password@123` |
*(1-click login buttons available on the login page)*
