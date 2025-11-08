import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Public pages
import HomePage from "./pages/public/HomePage";
import JobSearchPage from "./pages/public/JobSearchPage";
import JobDetailsPage from "./pages/public/JobDetailsPage";
import CompanySearchPage from "./pages/public/CompanySearchPage";
import CompanyDetailsPage from "./pages/public/CompanyDetailsPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";

// Candidate pages
import CandidateProfilePage from "./pages/candidate/ProfilePage";
import CandidateApplicationsPage from "./pages/candidate/ApplicationsPage";
import CandidateRecommendedJobsPage from "./pages/candidate/RecommendedJobsPage";
import CVBuilderPage from "./pages/candidate/CVBuilderPage";
import SavedJobsPage from "./pages/candidate/SavedJobsPage";
import CoverLettersPage from "./pages/candidate/CoverLettersPage";
import EmployersInterestedPage from "./pages/candidate/EmployersInterestedPage";
import ProfileViewsPage from "./pages/candidate/ProfileViewsPage";
import SuggestionsSettingsPage from "./pages/candidate/SuggestionsSettingsPage";

// Settings pages
import PersonalizationSettingsPage from "./pages/settings/PersonalizationSettingsPage";
import NotificationSettingsPage from "./pages/settings/NotificationSettingsPage";
import SecuritySettingsPage from "./pages/settings/SecuritySettingsPage";

// Employer pages
import EmployerDashboardPage from "./pages/employer/DashboardPage";
import EmployerJobCreatePage from "./pages/employer/JobCreatePage";
import EmployerJobEditPage from "./pages/employer/JobEditPage";
import EmployerJobDetailsPage from "./pages/employer/JobDetailsPage";
import EmployerApplicationsPage from "./pages/employer/ApplicationsPage";
import EmployerApplicationDetailPage from "./pages/employer/ApplicationDetailPage";
import EmployerJobManagementPage from "./pages/employer/JobManagementPage";
import EmployerCompanyProfilePage from "./pages/employer/CompanyProfilePage";
import EmployerSavedCandidatesPage from "./pages/employer/SavedCandidatesPage";
import EmployerMatchingCandidatesPage from "./pages/employer/MatchingCandidatesPage";
import EmployerCandidateSearchPage from "./pages/employer/CandidateSearchPage";
import EmployerCandidateDetailPage from "./pages/employer/CandidateDetailPage";
import EmployerStatisticsPage from "./pages/employer/StatisticsPage";

// Admin pages
import AdminDashboardPage from "./pages/admin/DashboardPage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <HomePage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/jobs" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <JobSearchPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/jobs/:id" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <JobDetailsPage />
                </main>
                <Footer />
              </>
            } />

            <Route path="/companies" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <CompanySearchPage />
                </main>
                <Footer />
              </>
            } />

            <Route path="/companies/:id" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <CompanyDetailsPage />
                </main>
                <Footer />
              </>
            } />

            {/* Auth pages without navbar and footer */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Candidate routes */}
            <Route path="/candidate/profile" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <CandidateProfilePage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/candidate/applications" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <CandidateApplicationsPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/candidate/recommended-jobs" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <CandidateRecommendedJobsPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/candidate/cv-builder" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <CVBuilderPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/candidate/saved-jobs" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <SavedJobsPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/candidate/cover-letters" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <CoverLettersPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/candidate/employers-interested" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployersInterestedPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/candidate/profile-views" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <ProfileViewsPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/candidate/job-suggestions-settings" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <SuggestionsSettingsPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/settings/personalization" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <PersonalizationSettingsPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/settings/notifications" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <NotificationSettingsPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/settings/security" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <SecuritySettingsPage />
                </main>
                <Footer />
              </>
            } />

            {/* Employer routes */}
            <Route path="/employer/dashboard" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerDashboardPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/employer/jobs/create" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerJobCreatePage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/employer/jobs/:id/edit" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerJobEditPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/employer/jobs/:id" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerJobDetailsPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/employer/applications" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerApplicationsPage />
                </main>
                <Footer />
              </>
            } />

            <Route path="/employer/applications/:id" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerApplicationDetailPage />
                </main>
                <Footer />
              </>
            } />

            {/* Employer new routes */}
            <Route path="/employer/profile" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerCompanyProfilePage />
                </main>
                <Footer />
              </>
            } />

            <Route path="/employer/profile/edit" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerCompanyProfilePage />
                </main>
                <Footer />
              </>
            } />

            <Route path="/employer/jobs" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerJobManagementPage />
                </main>
                <Footer />
              </>
            } />

            <Route path="/employer/jobs/:jobId/candidates" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerMatchingCandidatesPage />
                </main>
                <Footer />
              </>
            } />

            <Route path="/employer/candidates/search" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerCandidateSearchPage />
                </main>
                <Footer />
              </>
            } />

            <Route path="/employer/candidates/:candidateId" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerCandidateDetailPage />
                </main>
                <Footer />
              </>
            } />

            <Route path="/employer/saved-candidates" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerSavedCandidatesPage />
                </main>
                <Footer />
              </>
            } />

            <Route path="/employer/statistics" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EmployerStatisticsPage />
                </main>
                <Footer />
              </>
            } />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <AdminDashboardPage />
                </main>
                <Footer />
              </>
            } />

            {/* Fallback route */}
            <Route path="*" element={
              <>
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-8">Trang không tồn tại</p>
                    <a href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                      Về trang chủ
                    </a>
                  </div>
                </main>
                <Footer />
              </>
            } />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App;