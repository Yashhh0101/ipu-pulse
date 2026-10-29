import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CollegeProvider } from './context/CollegeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CollegeSelectorModal } from './components/common/CollegeSelectorModal';

import { HomePage } from './pages/HomePage';
import { CollegesPage } from './pages/CollegesPage';
import { CollegeDashboardPage } from './pages/CollegeDashboardPage';
import { SocietyDirectoryPage } from './pages/SocietyDirectoryPage';
import { SocietyDetailPage } from './pages/SocietyDetailPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { EventRegisterPage } from './pages/EventRegisterPage';
import { MembershipPage } from './pages/MembershipPage';
import { MembershipDetailPage } from './pages/MembershipDetailPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { SocietyAdminDashboardPage } from './pages/SocietyAdminDashboardPage';
import { EventEditorPage } from './pages/EventEditorPage';
import { PlatformAdminDashboardPage } from './pages/PlatformAdminDashboardPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <CollegeProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-indigo-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Home */}
                <Route path="/" element={<HomePage />} />

                {/* Colleges */}
                <Route path="/colleges" element={<CollegesPage />} />
                <Route path="/colleges/:collegeId" element={<CollegeDashboardPage />} />
                <Route path="/colleges/:collegeId/societies" element={<SocietyDirectoryPage />} />
                <Route
                  path="/colleges/:collegeId/societies/:societyId"
                  element={<SocietyDetailPage />}
                />

                {/* Events */}
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:eventId" element={<EventDetailPage />} />
                <Route path="/events/:eventId/register" element={<EventRegisterPage />} />

                {/* Membership */}
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/membership/:societyId" element={<MembershipDetailPage />} />

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/profile" element={<UserProfilePage />} />

                {/* Society Admin */}
                <Route path="/admin/society" element={<SocietyAdminDashboardPage />} />
                <Route path="/admin/society/events/new" element={<EventEditorPage />} />
                <Route path="/admin/society/events/:eventId/edit" element={<EventEditorPage />} />

                {/* Platform Admin */}
                <Route path="/admin/platform" element={<PlatformAdminDashboardPage />} />

                {/* Transparency */}
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <CollegeSelectorModal />
          </div>
        </AuthProvider>
      </CollegeProvider>
    </BrowserRouter>
  );
}
