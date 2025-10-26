import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { listingsAPI } from '../../utils/api';
import Navbar from '../../components/Navbar';
import { MapPin, Package, CheckCircle, Clock, Filter, Search, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const ReceiverDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'myClaims'
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  });
  const [feedbackModal, setFeedbackModal] = useState({ open: false, listing: null });
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);

  useEffect(() => {
    loadClaims();
    loadAllListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [allListings, filterStatus, searchQuery]);

  const loadClaims = async () => {
    try {
      const response = await listingsAPI.getMyClaims();
      const claimsData = response.data.listings;
      setClaims(claimsData);
      
      setStats({
        total: claimsData.length,
        pending: claimsData.filter(l => l.status === 'claimed').length,
        confirmed: claimsData.filter(l => l.status === 'confirmed').length,
        completed: claimsData.filter(l => l.status === 'completed').length
      });
    } catch (error) {
      console.error('Error loading claims:', error);
      toast.error('Failed to load claims');
    }
  };

  const loadAllListings = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getAll({ status: 'available' });
      setAllListings(response.data.listings || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = [...allListings];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(l => l.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(l =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.foodType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  };

  const handleClaim = async (listingId) => {
    try {
      await listingsAPI.claim(listingId);
      toast.success('Listing claimed! Waiting for donor approval.');
      loadAllListings();
      loadClaims();
      setActiveTab('myClaims');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to claim listing');
    }
  };

  const handleComplete = async (listingId) => {
    try {
      await listingsAPI.complete(listingId);
      toast.success('Pickup completed! Thank you!');
      loadClaims();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete pickup');
    }
  };

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) {
      toast.error('Please write a message');
      return;
    }

    try {
      await listingsAPI.sendFeedback(feedbackModal.listing._id, {
        message: feedbackText,
        rating: feedbackRating
      });
      toast.success('Thank you message sent to donor! 💚');
      setFeedbackModal({ open: false, listing: null });
      setFeedbackText('');
      setFeedbackRating(5);
      loadClaims();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send feedback');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      claimed: 'badge-warning',
      confirmed: 'badge-success',
      completed: 'badge-success',
      available: 'badge-primary'
    };
    return badges[status] || 'badge-primary';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Receiver Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
          </div>
          <Link to="/map" className="btn btn-primary">
            <MapPin size={20} />
            Find Food
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Claims</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Approval</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Confirmed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.confirmed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('available')}
              className={`pb-3 px-2 font-medium transition ${
                activeTab === 'available'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Available Listings ({filteredListings.length})
            </button>
            <button
              onClick={() => setActiveTab('myClaims')}
              className={`pb-3 px-2 font-medium transition ${
                activeTab === 'myClaims'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Claims ({claims.length})
            </button>
          </div>
        </div>

        {/* Available Listings Tab */}
        {activeTab === 'available' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="card">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by title, description, or food type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="input"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="claimed">Claimed</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="card text-center py-12 text-gray-500">
                <Package size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No listings found</p>
                <p className="text-sm mt-2">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <div key={listing._id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }} className="card hover:shadow-lg transition group">
                    {/* Image - Fixed Height */}
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem 0.5rem 0 0', margin: '-1.5rem -1.5rem 1rem -1.5rem' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%)', borderRadius: '0.5rem 0.5rem 0 0', margin: '-1.5rem -1.5rem 1rem -1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={64} style={{ color: '#9ca3af' }} />
                      </div>
                    )}

                    {/* Content - Flex Grow */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 style={{ fontWeight: '700', color: '#1e293b', fontSize: '1.125rem', flex: 1, minHeight: '3rem', lineHeight: '1.5rem' }} className="group-hover:text-blue-600 transition">
                          {listing.title}
                        </h3>
                        <span className={`badge ${getStatusBadge(listing.status)}`} style={{ marginLeft: '0.5rem', flexShrink: 0 }}>
                          {listing.status}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.75rem', minHeight: '2.5rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {listing.description}
                      </p>

                      <div style={{ marginBottom: '1rem', minHeight: '5rem' }} className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Package size={16} />
                          <span>{listing.quantity.value} {listing.quantity.unit} • {listing.foodType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span className="truncate">{listing.location?.address || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>Pickup: {new Date(listing.pickupTimes?.start).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Donor Info - Fixed Height */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb', minHeight: '3rem' }}>
                        <div style={{ width: '32px', height: '32px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#2563eb', fontWeight: '600', fontSize: '0.875rem' }}>
                            {listing.donor?.name?.charAt(0) || 'D'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>{listing.donor?.name || 'Anonymous Donor'}</span>
                      </div>

                      {/* Action Buttons - At Bottom */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <button
                          onClick={() => navigate(`/listing/${listing._id}`)}
                          className="btn btn-outline flex-1 text-sm py-2"
                          style={{ minHeight: '40px' }}
                        >
                          View Details
                        </button>
                        {listing.status === 'available' && (
                          <button
                            onClick={() => handleClaim(listing._id)}
                            className="btn btn-primary flex-1 text-sm py-2"
                            style={{ minHeight: '40px' }}
                          >
                            Claim
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Claims Tab */}
        {activeTab === 'myClaims' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Claims</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : claims.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No claims yet</p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                >
                  Browse available listings
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {claims.map((listing) => (
                  <div key={listing._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                      <span className={`badge ${getStatusBadge(listing.status)}`}>
                        {listing.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{listing.description.substring(0, 100)}...</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{listing.quantity.value} {listing.quantity.unit}</span>
                      <span>{listing.donor?.name || 'Unknown Donor'}</span>
                    </div>
                    
                    {/* Status Messages */}
                    {listing.status === 'claimed' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-yellow-800 mb-3">
                        ⏳ Waiting for donor approval
                      </div>
                    )}
                    
                    {/* Complete Button for Confirmed Listings */}
                    {listing.status === 'confirmed' && (
                      <button
                        onClick={() => handleComplete(listing._id)}
                        className="btn btn-primary w-full text-sm py-2 mt-3"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Mark as Picked Up
                      </button>
                    )}

                    {/* Send Thank You Button for Completed Listings */}
                    {listing.status === 'completed' && !listing.receiverFeedback && (
                      <button
                        onClick={() => setFeedbackModal({ open: true, listing })}
                        className="btn btn-primary w-full text-sm py-2 mt-3"
                        style={{ background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)' }}
                      >
                        💚 Send Thank You Message
                      </button>
                    )}

                    {/* Feedback Sent Indicator */}
                    {listing.status === 'completed' && listing.receiverFeedback && (
                      <div className="bg-green-50 border border-green-200 rounded p-2 text-sm text-green-800 mt-3 text-center">
                        ✅ Thank you message sent!
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feedback Modal */}
        {feedbackModal.open && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
            onClick={() => setFeedbackModal({ open: false, listing: null })}
          >
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', maxWidth: '500px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>💚 Send Thank You Message</h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.5rem' }}>Let {feedbackModal.listing?.donor?.name} know you appreciate their kindness!</p>
              
              {/* Rating */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Rate your experience</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      style={{ fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {star <= feedbackRating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Your message</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Thank you so much for the food! It really helped us..."
                  style={{ width: '100%', minHeight: '120px', padding: '0.875rem', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', resize: 'vertical', outline: 'none' }}
                  maxLength={500}
                  onFocus={(e) => e.target.style.borderColor = '#34D399'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  {feedbackText.length}/500
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setFeedbackModal({ open: false, listing: null })}
                  style={{ flex: 1, padding: '0.75rem', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendFeedback}
                  style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(52, 211, 153, 0.4)' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  💚 Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiverDashboard;
