import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// AI Description Writer (Slide 4 & 8)
export const generateDescription = createAsyncThunk(
  'ai/generateDescription',
  async (propertyData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/ai/generate-description', propertyData);
      return response.data.description;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to generate AI description'
      );
    }
  }
);

// AI Trip Planner (Slide 4 & 8)
export const planTrip = createAsyncThunk(
  'ai/planTrip',
  async (tripParams, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/ai/plan-trip', tripParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to generate trip plan'
      );
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    description: '',
    generatingDesc: false,
    descError: null,
    tripPlan: null,
    matchingStays: [],
    generatingTrip: false,
    tripError: null,
  },
  reducers: {
    clearAiData: (state) => {
      state.description = '';
      state.tripPlan = null;
      state.matchingStays = [];
      state.descError = null;
      state.tripError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // generateDescription
      .addCase(generateDescription.pending, (state) => {
        state.generatingDesc = true;
        state.descError = null;
      })
      .addCase(generateDescription.fulfilled, (state, action) => {
        state.generatingDesc = false;
        state.description = action.payload;
      })
      .addCase(generateDescription.rejected, (state, action) => {
        state.generatingDesc = false;
        state.descError = action.payload;
      })
      // planTrip
      .addCase(planTrip.pending, (state) => {
        state.generatingTrip = true;
        state.tripError = null;
      })
      .addCase(planTrip.fulfilled, (state, action) => {
        state.generatingTrip = false;
        state.tripPlan = action.payload.plan;
        state.matchingStays = action.payload.matchingStays || [];
      })
      .addCase(planTrip.rejected, (state, action) => {
        state.generatingTrip = false;
        state.tripError = action.payload;
      });
  },
});

export const { clearAiData } = aiSlice.actions;
export default aiSlice.reducer;
