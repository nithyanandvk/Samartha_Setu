import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { listingsAPI, adminAPI } from '../../utils/api';
import Navbar from '../../components/Navbar';
import { Plus, Package, Award, Clock, CheckCircle, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    points: 0
  });
  const [recentListings, setRecentListings] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [listingsRes, leaderboardRes] = await Promise.all([
        listingsAPI.getMyDonations(),
        adminAPI.getLeaderboard(10)
      ]);

      const listings = listingsRes.data.listings;
      setRecentListings(listings.slice(0, 5));
      
      setStats({
        total: listings.length,
        active: listings.filter(l => ['available', 'claimed', 'confirmed'].includes(l.status)).length,
        completed: listings.filter(l => l.status === 'completed').length,
        points: user.points || 0
      });

      setLeaderboard(leaderboardRes.data.leaderboard);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user.points, user.id]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleApproval = async (listingId, action) => {
    try {
      await listingsAPI.confirmClaim(listingId, action);
      toast.success(action === 'confirm' ? 'Claim confirmed!' : 'Claim rejected');
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process claim');
    }
  };

  const handleComplete = async (listingId) => {
    try {
      const response = await listingsAPI.complete(listingId);
      toast.success(`Listing completed! You earned ${response.data.pointsEarned} points!`);
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete listing');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      available: 'badge-primary',
      claimed: 'badge-warning',
      confirmed: 'badge-success',
      completed: 'badge-success',
      expired: 'badge-danger',
      cancelled: 'badge-danger'
    };
    return badges[status] || 'badge-primary';
  };

  const userRank = leaderboard.findIndex(u => u._id === user.id) + 1;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', width: '100%', overflowX: 'hidden' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem', width: '100%' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: window.innerWidth <= 768 ? 'stretch' : 'center',
          marginBottom: '2rem',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: window.innerWidth <= 768 ? '1.75rem' : '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Donor Dashboard</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Welcome back, {user.name}!</p>
          </div>
          <Link to="/donor/create" style={{
            background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            textDecoration: 'none',
            justifyContent: 'center',
            minHeight: '44px',
            width: window.innerWidth <= 768 ? '100%' : 'auto'
          }}>
            <Plus size={20} />
            Create Listing
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : window.innerWidth <= 1024 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Donations</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginTop: '0.25rem' }}>{stats.total}</p>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#dbeafe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package style={{ color: '#2563eb' }} size={24} />
              </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Active Listings</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginTop: '0.25rem' }}>{stats.active}</p>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#fed7aa', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock style={{ color: '#ea580c' }} size={24} />
              </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Completed</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginTop: '0.25rem' }}>{stats.completed}</p>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#d1fae5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle style={{ color: '#059669' }} size={24} />
              </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Points</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginTop: '0.25rem' }}>{stats.points}</p>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#e9d5ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award style={{ color: '#9333ea' }} size={24} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth <= 1024 ? '1fr' : '2fr 1fr',
          gap: '1.5rem'
        }}>
          {/* Recent Listings */}
          <div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>Recent Listings</h2>
                <Link to="/donor/donations" style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}>
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : recentListings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No listings yet</p>
                  <Link to="/donor/create" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
                    Create your first listing
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentListings.map((listing) => (
                    <div key={listing._id} style={{ 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: window.innerWidth <= 640 ? 'column' : 'row',
                        gap: window.innerWidth <= 640 ? '0' : '1rem'
                      }}>
                        {/* Thumbnail */}
                        {listing.images && listing.images.length > 0 ? (
                          <img
                            src={listing.images[0].url}
                            alt={listing.title}
                            style={{ 
                              width: window.innerWidth <= 640 ? '100%' : '120px',
                              height: window.innerWidth <= 640 ? '200px' : '120px',
                              objectFit: 'cover',
                              flexShrink: 0
                            }}
                          />
                        ) : (
                          <div style={{ 
                            width: window.innerWidth <= 640 ? '100%' : '120px',
                            height: window.innerWidth <= 640 ? '200px' : '120px',
                            background: 'linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Package size={32} style={{ color: '#9ca3af' }} />
                          </div>
                        )}
                        
                        {/* Content */}
                        <div style={{ flex: 1, padding: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <h3 style={{ fontWeight: '600', color: '#1e293b', fontSize: '1rem', flex: 1, minWidth: '150px' }}>{listing.title}</h3>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              background: listing.status === 'available' ? '#d1fae5' : listing.status === 'claimed' ? '#fed7aa' : listing.status === 'completed' ? '#d1fae5' : '#fee2e2',
                              color: listing.status === 'available' ? '#065f46' : listing.status === 'claimed' ? '#9a3412' : listing.status === 'completed' ? '#065f46' : '#991b1b',
                              whiteSpace: 'nowrap'
                            }}>
                              {listing.status}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.5' }}>{listing.description.substring(0, 100)}...</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <span style={{ fontWeight: '500' }}>{listing.quantity.value} {listing.quantity.unit}</span>
                            <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                          </div>
                      
                          {/* Approval Buttons for Claimed Listings */}
                          {listing.status === 'claimed' && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexDirection: window.innerWidth <= 480 ? 'column' : 'row' }}>
                              <button
                                onClick={() => handleApproval(listing._id, 'confirm')}
                                style={{
                                  flex: 1,
                                  background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                                  color: 'white',
                                  padding: '0.625rem 1rem',
                                  borderRadius: '8px',
                                  border: 'none',
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.25rem',
                                  minHeight: '44px'
                                }}
                              >
                                <Check size={16} />
                                Confirm Claim
                              </button>
                              <button
                                onClick={() => handleApproval(listing._id, 'reject')}
                                style={{
                                  flex: 1,
                                  background: 'white',
                                  color: '#1e293b',
                                  padding: '0.625rem 1rem',
                                  borderRadius: '8px',
                                  border: '1px solid #e5e7eb',
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.25rem',
                                  minHeight: '44px'
                                }}
                              >
                                <X size={16} />
                                Reject
                              </button>
                            </div>
                          )}
                          
                          {/* Complete Button for Confirmed Listings */}
                          {listing.status === 'confirmed' && (
                            <button
                              onClick={() => handleComplete(listing._id)}
                              style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                                color: 'white',
                                padding: '0.625rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.25rem',
                                marginTop: '0.75rem',
                                minHeight: '44px'
                              }}
                            >
                              <CheckCircle size={16} />
                              Mark as Completed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Leaderboard</h2>
            
            {userRank > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">Your Rank</p>
                <p className="text-2xl font-bold text-blue-600">#{userRank}</p>
              </div>
            )}

            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((donor, index) => (
                <div key={donor._id} className={`flex items-center gap-3 p-2 rounded ${donor._id === user.id ? 'bg-blue-50' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-200 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{donor.name}</p>
                    <p className="text-xs text-gray-500">{donor.points} points</p>
                  </div>
                  {donor.badges && donor.badges.length > 0 && (
                    <span className="text-lg">{donor.badges[donor.badges.length - 1].icon}</span>
                  )}
                </div>
              ))}
            </div>

            <Link to="/leaderboard" className="btn btn-outline w-full mt-4">
              View Full Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
