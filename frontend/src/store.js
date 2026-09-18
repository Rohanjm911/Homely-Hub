import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import propertyReducer from './features/properties/propertySlice';
import bookingReducer from './features/bookings/bookingSlice';
import aiReducer from './features/ai/aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    bookings: bookingReducer,
    ai: aiReducer,
  },
});

export default store;
