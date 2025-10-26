import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { Award } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await adminAPI.getLeaderboard(50);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <Award size={48} className="mx-auto text-yellow-500 mb-4" />
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-gray-600">Top donors making a difference</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="card">
            {leaderboard.map((donor, index) => (
              <div key={donor._id} className={`flex items-center gap-4 p-4 border-b last:border-b-0 ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-200 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{donor.name}</h3>
                  <p className="text-sm text-gray-600">{donor.organizationName || 'Individual Donor'}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{donor.points}</p>
                  <p className="text-xs text-gray-500">{donor.totalDonations} donations</p>
                </div>
                {donor.badges && donor.badges.length > 0 && (
                  <div className="text-2xl">{donor.badges[donor.badges.length - 1].icon}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
