import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

const AdminCheckpoints = () => {
  const [checkpoints, setCheckpoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCheckpoints();
  }, []);

  const loadCheckpoints = async () => {
    try {
      const response = await adminAPI.getCheckpoints({});
      setCheckpoints(response.data.checkpoints);
    } catch (error) {
      toast.error('Failed to load checkpoints');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkpoint Management</h1>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {checkpoints.map(checkpoint => (
              <div key={checkpoint._id} className="card">
                <h3 className="font-semibold text-lg mb-2">{checkpoint.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{checkpoint.type}</p>
                <p className="text-sm text-gray-500">{checkpoint.location.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCheckpoints;
