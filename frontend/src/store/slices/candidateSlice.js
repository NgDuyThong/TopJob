import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { candidateService } from '../../services/candidateService';

// Async thunks
export const fetchProfile = createAsyncThunk(
  'candidate/fetchProfile',
  async () => {
    const response = await candidateService.getProfile();
    return response.data;
  }
);

export const updateProfile = createAsyncThunk(
  'candidate/updateProfile',
  async (profileData) => {
    const response = await candidateService.updateProfile(profileData);
    return response.data;
  }
);

export const updateResume = createAsyncThunk(
  'candidate/updateResume',
  async (formData) => {
    const response = await candidateService.updateResume(formData);
    return response.data;
  }
);

export const fetchCandidates = createAsyncThunk(
  'candidate/fetchCandidates',
  async (filters) => {
    const response = await candidateService.getCandidates(filters);
    return response.data;
  }
);

const initialState = {
  profile: null,
  candidates: [],
  isLoading: false,
  error: null,
  filters: {
    skills: [],
    experienceLevel: '',
    page: 1,
    limit: 10
  },
  totalCandidates: 0
};

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
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
      // Update Resume
      .addCase(updateResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Fetch Candidates
      .addCase(fetchCandidates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.candidates = action.payload.candidates;
        state.totalCandidates = action.payload.total;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const { setFilters, clearFilters } = candidateSlice.actions;

export default candidateSlice.reducer;