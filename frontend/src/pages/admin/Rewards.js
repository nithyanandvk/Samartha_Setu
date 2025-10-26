import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

const AdminRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      const response = await adminAPI.getRewards({});
      setRewards(response.data.rewards);
    } catch (error) {
      toast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reward Management</h1>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {rewards.map(reward => (
              <div key={reward._id} className="card">
                <h3 className="font-semibold text-lg mb-2">{reward.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                <p className="text-lg font-bold text-blue-600">{reward.pointsRequired} points</p>
                <p className="text-sm text-gray-500 mt-2">Available: {reward.quantity.available}/{reward.quantity.total}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRewards;
