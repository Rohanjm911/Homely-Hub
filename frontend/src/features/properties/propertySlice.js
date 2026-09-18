import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Fetch properties with filters, pagination (12 per page), and date-overlap exclusion
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/properties', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load stays'
      );
    }
  }
);

// Fetch single property details
export const fetchPropertyDetails = createAsyncThunk(
  'properties/fetchPropertyDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/properties/${id}`);
      return response.data.property;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Property not found'
      );
    }
  }
);

// Create new property
export const createProperty = createAsyncThunk(
  'properties/createProperty',
  async (propertyData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/properties', propertyData);
      return response.data.property;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to list property'
      );
    }
  }
);

const propertySlice = createSlice({
  name: 'properties',
  initialState: {
    properties: [],
    property: null,
    totalProperties: 0,
    filteredPropertiesCount: 0,
    resPerPage: 12,
    currentPage: 1,
    loading: false,
    detailsLoading: false,
    createLoading: false,
    error: null,
    filters: {
      keyword: '',
      city: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      guests: '',
      checkIn: null,
      checkOut: null,
      page: 1,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        keyword: '',
        city: '',
        propertyType: '',
        minPrice: '',
        maxPrice: '',
        guests: '',
        checkIn: null,
        checkOut: null,
        page: 1,
      };
    },
    clearPropertyDetails: (state) => {
      state.property = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProperties
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
        state.totalProperties = action.payload.totalProperties;
        state.filteredPropertiesCount = action.payload.filteredPropertiesCount;
        state.resPerPage = action.payload.resPerPage;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchPropertyDetails
      .addCase(fetchPropertyDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.property = action.payload;
      })
      .addCase(fetchPropertyDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })
      // createProperty
      .addCase(createProperty.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.createLoading = false;
        state.properties.unshift(action.payload);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters, clearPropertyDetails } = propertySlice.actions;
export default propertySlice.reducer;
