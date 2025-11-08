import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { employerService } from '../../services/employerService';

// Async thunks
export const fetchProfile = createAsyncThunk(
  'employer/fetchProfile',
  async () => {
    const response = await employerService.getProfile();
    return response.data;
  }
);

export const updateProfile = createAsyncThunk(
  'employer/updateProfile',
  async (profileData) => {
    const response = await employerService.updateProfile(profileData);
    return response.data;
  }
);

export const fetchEmployers = createAsyncThunk(
  'employer/fetchEmployers',
  async (filters) => {
    const response = await employerService.getEmployers(filters);
    return response.data;
  }
);

export const fetchEmployerById = createAsyncThunk(
  'employer/fetchEmployerById',
  async (id) => {
    const response = await employerService.getEmployerById(id);
    return response.data;
  }
);

const initialState = {
  profile: null,
  employers: [],
  currentEmployer: null,
  isLoading: false,
  error: null,
  filters: {
    companyName: '',
    industry: '',
    location: '',
    page: 1,
    limit: 10
  },
  totalEmployers: 0
};

const employerSlice = createSlice({
  name: 'employer',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentEmployer: (state) => {
      state.currentEmployer = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Fetch Employers
      .addCase(fetchEmployers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employers = action.payload.employers;
        state.totalEmployers = action.payload.total;
      })
      .addCase(fetchEmployers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Fetch Employer By Id
      .addCase(fetchEmployerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEmployer = action.payload;
      })
      .addCase(fetchEmployerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const { setFilters, clearFilters, clearCurrentEmployer } = employerSlice.actions;

export default employerSlice.reducer;