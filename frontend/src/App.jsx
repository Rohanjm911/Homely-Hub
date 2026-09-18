import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './features/auth/authSlice';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AddPropertyPage from './pages/AddPropertyPage';
import HostDashboardPage from './pages/HostDashboardPage';
import GuestDashboardPage from './pages/GuestDashboardPage';
import AITripPlannerPage from './pages/AITripPlannerPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const dispatch = useDispatch();

  // Solves "Login Lost on Refresh" (Slide 9: /me API called on load - cookie tells who is logged in)
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route
            path="/add-property"
            element={
              <ProtectedRoute>
                <AddPropertyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/dashboard"
            element={
              <ProtectedRoute>
                <HostDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/dashboard"
            element={
              <ProtectedRoute>
                <GuestDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/ai-trip-planner" element={<AITripPlannerPage />} />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <GuestDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
