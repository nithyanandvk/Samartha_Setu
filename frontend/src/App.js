import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/donor/Dashboard';
import CreateListing from './pages/donor/CreateListing';
import MyDonations from './pages/donor/MyDonations';
import ReceiverDashboard from './pages/receiver/Dashboard';
import MyClaims from './pages/receiver/MyClaims';
import MapView from './pages/MapView';
import ListingDetails from './pages/ListingDetails';
import ChatPage from './pages/ChatPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCheckpoints from './pages/admin/Checkpoints';
import AdminRewards from './pages/admin/Rewards';
import VolunteerManagement from './pages/admin/VolunteerManagement';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import ProfileManagement from './pages/ProfileManagement';
import NotFound from './pages/NotFound';

import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)'
              },
              success: {
                iconTheme: {
                  primary: 'var(--success)',
                  secondary: 'white'
                }
              },
              error: {
                iconTheme: {
                  primary: 'var(--danger)',
                  secondary: 'white'
                }
              }
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/listing/:id" element={<ListingDetails />} />

            {/* Donor Routes */}
            <Route
              path="/donor/dashboard"
              element={
                <ProtectedRoute roles={['donor']}>
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/create"
              element={
                <ProtectedRoute roles={['donor']}>
                  <CreateListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/donations"
              element={
                <ProtectedRoute roles={['donor']}>
                  <MyDonations />
                </ProtectedRoute>
              }
            />

            {/* Receiver Routes */}
            <Route
              path="/receiver/dashboard"
              element={
                <ProtectedRoute roles={['receiver']}>
                  <ReceiverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receiver/claims"
              element={
                <ProtectedRoute roles={['receiver']}>
                  <MyClaims />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/checkpoints"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminCheckpoints />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rewards"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminRewards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/volunteers"
              element={
                <ProtectedRoute roles={['admin']}>
                  <VolunteerManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/volunteers/register"
              element={
                <ProtectedRoute roles={['admin']}>
                  <VolunteerManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/volunteers/notify"
              element={
                <ProtectedRoute roles={['admin']}>
                  <VolunteerManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/volunteers/contact"
              element={
                <ProtectedRoute roles={['admin']}>
                  <VolunteerManagement />
                </ProtectedRoute>
              }
            />

            {/* Common Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <ProfileManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:chatId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
