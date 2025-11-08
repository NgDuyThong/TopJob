import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationService } from '../../services/applicationService';

// Async thunks
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (filters) => {
    const response = await applicationService.getApplications(filters);
    return response.data;
  }
);

export const fetchApplicationById = createAsyncThunk(
  'applications/fetchApplicationById',
  async (id) => {
    const response = await applicationService.getApplicationById(id);
    return response.data;
  }
);

export const createApplication = createAsyncThunk(
  'applications/createApplication',
  async (applicationData) => {
    const response = await applicationService.createApplication(applicationData);
    return response.data;
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateApplicationStatus',
  async ({ id, status }) => {
    const response = await applicationService.updateApplicationStatus(id, status);
    return response.data;
  }
);

const initialState = {
  applications: [],
  currentApplication: null,
  isLoading: false,
  error: null,
  filters: {
    status: '',
    jobId: '',
    candidateId: '',
    employerId: '',
    page: 1,
    limit: 10
  },
  totalApplications: 0
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload.applications;
        state.totalApplications = action.payload.total;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Fetch Application By Id
      .addCase(fetchApplicationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Create Application
      .addCase(createApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.unshift(action.payload);
        state.totalApplications += 1;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Update Application Status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.applications.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
        if (state.currentApplication?._id === action.payload._id) {
          state.currentApplication = action.payload;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const { setFilters, clearFilters, clearCurrentApplication } = applicationsSlice.actions;

export default applicationsSlice.reducer;