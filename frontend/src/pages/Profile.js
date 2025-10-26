import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="label">Name</label>
              <p className="text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="label">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="label">Role</label>
              <p className="text-gray-900 capitalize">{user.role}</p>
            </div>
            <div>
              <label className="label">Points</label>
              <p className="text-2xl font-bold text-blue-600">{user.points}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
