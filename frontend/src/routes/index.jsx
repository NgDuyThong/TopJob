import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from '../store/store';

// Route guards
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';
import EmployerRoutes from './EmployerRoutes';
import CandidateRoutes from './CandidateRoutes';
import AdminRoutes from './AdminRoutes';

// Public pages
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import JobSearchPage from '../pages/public/JobSearchPage';
import JobDetailsPage from '../pages/public/JobDetailsPage';
import CompanySearchPage from '../pages/public/CompanySearchPage';
import CompanyDetailsPage from '../pages/public/CompanyDetailsPage';

// Private pages
// (none yet)

// Candidate pages
import CandidateProfilePage from '../pages/candidate/ProfilePage';
import CandidateApplicationsPage from '../pages/candidate/ApplicationsPage';
import RecommendedJobsPage from '../pages/candidate/RecommendedJobsPage';
import CVBuilderPage from '../pages/candidate/CVBuilderPage';
import SavedJobsPage from '../pages/candidate/SavedJobsPage';
import CoverLettersPage from '../pages/candidate/CoverLettersPage';
import EmployersInterestedPage from '../pages/candidate/EmployersInterestedPage';
import ProfileViewsPage from '../pages/candidate/ProfileViewsPage';
import SuggestionsSettingsPage from '../pages/candidate/SuggestionsSettingsPage';
import PersonalizationSettingsPage from '../pages/settings/PersonalizationSettingsPage';
import NotificationSettingsPage from '../pages/settings/NotificationSettingsPage';
import SecuritySettingsPage from '../pages/settings/SecuritySettingsPage';

// Employer pages
import EmployerDashboardPage from '../pages/employer/DashboardPage';
import EmployerJobCreatePage from '../pages/employer/JobCreatePage';
import EmployerApplicationsPage from '../pages/employer/ApplicationsPage';
import EmployerJobManagementPage from '../pages/employer/JobManagementPage';
import EmployerCompanyProfilePage from '../pages/employer/CompanyProfilePage';
import EmployerSavedCandidatesPage from '../pages/employer/SavedCandidatesPage';
import EmployerMatchingCandidatesPage from '../pages/employer/MatchingCandidatesPage';
import EmployerCandidateSearchPage from '../pages/employer/CandidateSearchPage';
import EmployerCandidateDetailPage from '../pages/employer/CandidateDetailPage';
import EmployerStatisticsPage from '../pages/employer/StatisticsPage';
import EmployerApplicationDetailPage from '../pages/employer/ApplicationDetailPage';
import EmployerJobEditPage from '../pages/employer/JobEditPage';

// Admin pages
import AdminDashboardPage from '../pages/admin/DashboardPage';
import AdminUsersPage from '../pages/admin/UsersPage';
import AdminJobsPage from '../pages/admin/JobsPage';
import AdminCompaniesPage from '../pages/admin/CompaniesPage';
import AdminJobDetailPage from '../pages/admin/JobDetailPage';
import AdminCompanyDetailPage from '../pages/admin/CompanyDetailPage';
import AdminApplicationsPage from '../pages/admin/ApplicationsPage';
import AdminApplicationDetailPage from '../pages/admin/ApplicationDetailPage';
import AdminReportsPage from '../pages/admin/ReportsPage';

// Redux actions
import { validateToken } from '../store/slices/authSlice';

const AppRoutesContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobSearchPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/companies" element={<CompanySearchPage />} />
          <Route path="/companies/:id" element={<CompanyDetailsPage />} />
        </Route>

        {/* Protected Routes (generic) */}
        {/* Add generic protected routes here when available */}

        {/* Candidate Routes */}
        <Route element={<CandidateRoutes />}>
          <Route path="/candidate/profile" element={<CandidateProfilePage />} />
          <Route path="/candidate/profile/edit" element={<CandidateProfilePage />} />
          <Route path="/candidate/applications" element={<CandidateApplicationsPage />} />
          <Route path="/candidate/saved-jobs" element={<SavedJobsPage />} />
          <Route path="/candidate/recommended-jobs" element={<RecommendedJobsPage />} />
          <Route path="/candidate/cv-builder" element={<CVBuilderPage />} />
          <Route path="/candidate/cover-letters" element={<CoverLettersPage />} />
          <Route path="/candidate/employers-interested" element={<EmployersInterestedPage />} />
          <Route path="/candidate/profile-views" element={<ProfileViewsPage />} />
          <Route path="/candidate/job-suggestions-settings" element={<SuggestionsSettingsPage />} />
          {/* Settings under protected scope */}
          <Route path="/settings/personalization" element={<PersonalizationSettingsPage />} />
          <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
          <Route path="/settings/security" element={<SecuritySettingsPage />} />
        </Route>

        {/* Employer Routes */}
        <Route element={<EmployerRoutes />}>
          <Route path="/employer/dashboard" element={<EmployerDashboardPage />} />
          <Route path="/employer/profile" element={<EmployerCompanyProfilePage />} />
          <Route path="/employer/profile/edit" element={<EmployerCompanyProfilePage />} />
          <Route path="/employer/jobs" element={<EmployerJobManagementPage />} />
          <Route path="/employer/jobs/create" element={<EmployerJobCreatePage />} />
          <Route path="/employer/jobs/:id/edit" element={<EmployerJobEditPage />} />
          <Route path="/employer/jobs/:jobId/candidates" element={<EmployerMatchingCandidatesPage />} />
          <Route path="/employer/applications" element={<EmployerApplicationsPage />} />
          <Route path="/employer/applications/:applicationId" element={<EmployerApplicationDetailPage />} />
          <Route path="/employer/candidates/search" element={<EmployerCandidateSearchPage />} />
          <Route path="/employer/candidates/:candidateId" element={<EmployerCandidateDetailPage />} />
          <Route path="/employer/saved-candidates" element={<EmployerSavedCandidatesPage />} />
          <Route path="/employer/statistics" element={<EmployerStatisticsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/jobs" element={<AdminJobsPage />} />
          <Route path="/admin/jobs/:id" element={<AdminJobDetailPage />} />
          <Route path="/admin/companies" element={<AdminCompaniesPage />} />
          <Route path="/admin/companies/:id" element={<AdminCompanyDetailPage />} />
          <Route path="/admin/applications" element={<AdminApplicationsPage />} />
          <Route path="/admin/applications/:id" element={<AdminApplicationDetailPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
};

const AppRoutes = () => {
  return (
    <Provider store={store}>
      <AppRoutesContent />
    </Provider>
  );
};

export default AppRoutes;