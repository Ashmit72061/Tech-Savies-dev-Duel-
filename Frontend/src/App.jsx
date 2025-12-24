import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import AdminLoginPage from './pages/LoginPage';
import ResidentLoginPage from './pages/ResidentLoginPage';
import AdminRegistrationPage from './pages/AdminRegistrationPage';
import ResidentRegistrationPage from './pages/ResidentRegistrationPage';

import DashboardLayout from './layouts/DashboardLayout';

import ResidentDashboard from './pages/ResidentDashboard';
import AdminDashboard from './pages/AdminDashboard';

import CreateSocietyPage from './pages/CreateSocietyPage';
import CommunityGoalsPage from './pages/CommunityGoalsPage';
import SocietyImpactPage from './pages/SocietyImpactPage';
import SettingsPage from './pages/SettingsPage';
import InputDataPage from './pages/InputDataPage';
import ContactUsPage from './pages/ContactUsPage';

// Placeholder for missing pages
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center p-20 text-center">
    <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-full mb-6">
      <span className="material-symbols-outlined text-4xl text-gray-400">
        construction
      </span>
    </div>
    <h2 className="text-2xl font-bold dark:text-white mb-2">{title}</h2>
    <p className="text-gray-500">This feature is coming soon.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display">
        <Routes>

          {/* Public Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Auth Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/register" element={<AdminRegistrationPage />} />

          {/* Resident Auth Routes */}
          <Route path="/resident/login" element={<ResidentLoginPage />} />
          <Route path="/resident/register" element={<ResidentRegistrationPage />} />

          {/* Legacy Redirects */}
          <Route path="/login" element={<Navigate to="/resident/login" replace />} />
          <Route path="/register" element={<Navigate to="/resident/register" replace />} />

          {/* ================= RESIDENT ROUTES ================= */}
          <Route path="/resident" element={<DashboardLayout role="resident" />}>
            <Route index element={<ResidentDashboard />} />
            <Route path="impact" element={<SocietyImpactPage />} />
            <Route path="goals" element={<CommunityGoalsPage />} />
            <Route path="input" element={<InputDataPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="contact" element={<ContactUsPage />} />
          </Route>

          {/* ================= ADMIN ROUTES ================= */}
          <Route path="/admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="societies" element={<Placeholder title="Manage Societies" />} />
            <Route path="societies/new" element={<CreateSocietyPage />} />
            <Route path="residents" element={<Placeholder title="Resident Directory" />} />
            <Route path="approvals" element={<Placeholder title="Pending Approvals" />} />
            <Route path="input" element={<InputDataPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
