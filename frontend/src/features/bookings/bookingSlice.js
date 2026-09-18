import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Create a new booking
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to complete booking'
      );
    }
  }
);

// Fetch logged in user's bookings
export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/bookings/my');
      return response.data.bookings;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch your trips'
      );
    }
  }
);

// Cancel booking (supports optional reason)
export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (payload, { rejectWithValue }) => {
    try {
      const id = typeof payload === 'string' ? payload : payload.id;
      const reason = typeof payload === 'object' ? payload.reason : undefined;
      const response = await axiosClient.put(`/bookings/${id}/cancel`, { reason });
      return response.data.booking;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel booking'
      );
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    currentBooking: null,
    loading: false,
    createSuccess: false,
    error: null,
  },
  reducers: {
    resetBookingStatus: (state) => {
      state.createSuccess = false;
      state.error = null;
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createBooking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.currentBooking = action.payload.booking;
        state.bookings.unshift(action.payload.booking);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      // fetchMyBookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // cancelBooking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export const { resetBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
