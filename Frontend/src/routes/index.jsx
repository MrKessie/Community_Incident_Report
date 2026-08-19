import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import PublicMapPage from '../pages/public/PublicMapPage';
import AnonymousReportPage from '../pages/public/AnonymousReportPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Reporter Pages
import ReporterDashboard from '../pages/reporter/ReporterDashboard';
import MyIncidentsPage from '../pages/reporter/MyIncidentsPage';
import ReportIncidentPage from '../pages/reporter/ReportIncidentPage';
import IncidentDetailPage from '../pages/reporter/IncidentDetailPage';
import ProfilePage from '../pages/reporter/ProfilePage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AllIncidentsPage from '../pages/admin/AllIncidentsPage';
import IncidentManagePage from '../pages/admin/IncidentManagePage';
import UsersPage from '../pages/admin/UsersPage';
import TeamsPage from '../pages/admin/TeamsPage';
import CategoriesPage from '../pages/admin/CategoriesPage';
import AnnouncementsPage from '../pages/admin/AnnouncementsPage';
import AnalyticsPage from '../pages/admin/AnalyticsPage';
import AuditLogsPage from '../pages/admin/AuditLogsPage';
import SettingsPage from '../pages/admin/SettingsPage';

// Team Pages
import TeamDashboard from '../pages/team/TeamDashboard';
import AssignedIncidentsPage from '../pages/team/AssignedIncidentsPage';
import IncidentResponsePage from '../pages/team/IncidentResponsePage';

// Error Pages
import NotFoundPage from '../pages/errors/NotFoundPage';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';
import ServerErrorPage from '../pages/errors/ServerErrorPage';

import NotificationsPage from '../pages/common/NotificationsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/map" element={<PublicMapPage />} />
      <Route path="/report-anonymous" element={<AnonymousReportPage />} />

      {/* Notifications Route */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Reporter Routes */}
      <Route
        path="/dashboard"
        element={
          <RoleRoute roles={['reporter', 'admin', 'super_admin']}>
            <ReporterDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/incidents"
        element={
          <RoleRoute roles={['reporter', 'admin', 'super_admin']}>
            <MyIncidentsPage />
          </RoleRoute>
        }
      />
      <Route
        path="/incidents/new"
        element={
          <ProtectedRoute>
            <ReportIncidentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents/:id"
        element={
          <ProtectedRoute>
            <IncidentDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <RoleRoute roles={['admin', 'super_admin']}>
            <AdminDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <RoleRoute roles={['admin', 'super_admin']}>
            <AdminDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/incidents"
        element={
          <RoleRoute roles={['admin', 'super_admin']}>
            <AllIncidentsPage />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/incidents/:id"
        element={
          <RoleRoute roles={['admin', 'super_admin']}>
            <IncidentManagePage />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RoleRoute roles={['admin', 'super_admin']}>
            <UsersPage />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/teams"
        element={
          <RoleRoute roles={['admin', 'super_admin']}>
            <TeamsPage />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <RoleRoute roles={['admin', 'super_admin']}>
            <CategoriesPage />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/announcements"
        element={
          <RoleRoute roles={['admin', 'super_admin']}>
            <AnnouncementsPage />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <RoleRoute roles={['admin', 'super_admin']}>
            <AnalyticsPage />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <RoleRoute roles={['super_admin', 'admin']}>
            <AuditLogsPage />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RoleRoute roles={['admin', 'super_admin']}>
            <SettingsPage />
          </RoleRoute>
        }
      />

      {/* Response Team Routes */}
      <Route
        path="/team"
        element={
          <RoleRoute roles={['response_team', 'admin', 'super_admin']}>
            <TeamDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/team/dashboard"
        element={
          <RoleRoute roles={['response_team', 'admin', 'super_admin']}>
            <TeamDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/team/incidents"
        element={
          <RoleRoute roles={['response_team', 'admin', 'super_admin']}>
            <AssignedIncidentsPage />
          </RoleRoute>
        }
      />
      <Route
        path="/team/incidents/:id"
        element={
          <RoleRoute roles={['response_team', 'admin', 'super_admin']}>
            <IncidentResponsePage />
          </RoleRoute>
        }
      />

      {/* Error Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/server-error" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
