import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsAPI } from '../../utils/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

const MyClaims = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      const response = await listingsAPI.getMyClaims();
      setClaims(response.data.listings);
    } catch (error) {
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Claims</h1>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {claims.map(claim => (
              <div key={claim._id} className="card hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/listing/${claim._id}`)}>
                <h3 className="font-semibold text-lg mb-2">{claim.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{claim.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{claim.donor?.name}</span>
                  <span className={`badge ${claim.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                    {claim.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClaims;
