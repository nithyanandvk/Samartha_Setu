import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsAPI } from '../../utils/api';
import Navbar from '../../components/Navbar';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';

const MyDonations = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const response = await listingsAPI.getMyDonations();
      setListings(response.data.listings);
    } catch (error) {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = filter === 'all' 
    ? listings 
    : listings.filter(l => l.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Donations</h1>
        
        <div className="mb-6">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input max-w-xs">
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="claimed">Claimed</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredListings.map(listing => (
              <div key={listing._id} className="card hover:shadow-md transition cursor-pointer overflow-hidden" onClick={() => navigate(`/listing/${listing._id}`)}>
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="w-32 h-32 object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                      <Package size={48} className="text-gray-400" />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 flex justify-between items-start py-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{listing.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>{listing.quantity.value} {listing.quantity.unit}</span>
                        <span>{listing.foodType}</span>
                        <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`badge ${listing.status === 'completed' ? 'badge-success' : listing.status === 'available' ? 'badge-primary' : 'badge-warning'}`}>
                      {listing.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDonations;
