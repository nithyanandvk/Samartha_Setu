import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getUsers({});
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await adminAPI.verifyOrg(userId);
      toast.success('User verified successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to verify user');
    }
  };

  const handleBan = async (userId) => {
    try {
      await adminAPI.toggleBan(userId, 'Admin action');
      toast.success('User ban status updated');
      loadUsers();
    } catch (error) {
      toast.error('Failed to update ban status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Verified</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">{user.isVerified ? '✓' : '✗'}</td>
                    <td className="p-3">
                      {!user.isVerified && user.subtype === 'organization' && (
                        <button onClick={() => handleVerify(user._id)} className="btn btn-sm btn-primary mr-2">
                          Verify
                        </button>
                      )}
                      <button onClick={() => handleBan(user._id)} className={`btn btn-sm ${user.isBanned ? 'btn-secondary' : 'btn-danger'}`}>
                        {user.isBanned ? 'Unban' : 'Ban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
