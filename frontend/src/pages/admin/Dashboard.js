import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import Navbar from '../../components/Navbar';
import { Users, Package, TrendingUp, CheckCircle, DollarSign, Gift, Truck, Leaf, Building2, Award, Activity, BarChart3, PieChart, MapPin, Clock, Star, Heart, AlertCircle, Settings, UserCheck, Shield, ExternalLink, UserPlus, UserCog, Mail, Phone } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>📊 Admin Dashboard</h1>
          <p style={{ fontSize: '1rem', color: '#64748b' }}>Comprehensive insights and database statistics</p>
        </div>
        
        {/* Main Stats Cards */}
        <div className="stats-grid mb-8">
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            <div className="flex items-center justify-between" style={{ position: 'relative', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>👥 Total Users</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats?.users?.total || 0}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.5rem' }}>Donors: {stats?.users?.donors || 0} | Receivers: {stats?.users?.receivers || 0}</p>
              </div>
              <Users size={48} style={{ opacity: 0.3 }} />
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 8px 24px rgba(240, 147, 251, 0.3)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            <div className="flex items-center justify-between" style={{ position: 'relative', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>📦 Total Listings</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats?.listings?.total || 0}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.5rem' }}>Active: {stats?.listings?.available || 0} | Claimed: {stats?.listings?.claimed || 0}</p>
              </div>
              <Package size={48} style={{ opacity: 0.3 }} />
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 8px 24px rgba(79, 172, 254, 0.3)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            <div className="flex items-center justify-between" style={{ position: 'relative', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>✅ Completed</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats?.impact?.completedDonations || 0}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.5rem' }}>Success Rate: {stats?.listings?.total > 0 ? Math.round((stats?.impact?.completedDonations / stats?.listings?.total) * 100) : 0}%</p>
              </div>
              <CheckCircle size={48} style={{ opacity: 0.3 }} />
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 8px 24px rgba(250, 112, 154, 0.3)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            <div className="flex items-center justify-between" style={{ position: 'relative', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>⚖️ Food Saved</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats?.impact?.totalKgSaved || 0} kg</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.5rem' }}>≈ {Math.round((stats?.impact?.totalKgSaved || 0) * 2.5)} meals served</p>
              </div>
              <TrendingUp size={48} style={{ opacity: 0.3 }} />
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="stats-grid mb-8">
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderLeft: '4px solid #10b981' }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={20} style={{ color: 'white' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Active Today</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>{stats?.activeToday || 0}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderLeft: '4px solid #f59e0b' }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} style={{ color: 'white' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Pending Claims</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>{stats?.listings?.claimed || 0}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderLeft: '4px solid #8b5cf6' }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={20} style={{ color: 'white' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Avg Rating</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>{stats?.averageRating || '4.8'} ⭐</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderLeft: '4px solid #ec4899' }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={20} style={{ color: 'white' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Feedbacks</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>{stats?.totalFeedbacks || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Listing Status Chart */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={24} style={{ color: '#667eea' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Listing Status Distribution</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Available', value: stats?.listings?.available || 0, color: '#10b981', total: stats?.listings?.total || 1 },
                { label: 'Claimed', value: stats?.listings?.claimed || 0, color: '#f59e0b', total: stats?.listings?.total || 1 },
                { label: 'Confirmed', value: stats?.listings?.confirmed || 0, color: '#3b82f6', total: stats?.listings?.total || 1 },
                { label: 'Completed', value: stats?.impact?.completedDonations || 0, color: '#8b5cf6', total: stats?.listings?.total || 1 },
                { label: 'Expired', value: stats?.listings?.expired || 0, color: '#ef4444', total: stats?.listings?.total || 1 }
              ].map((item, index) => {
                const percentage = (item.value / item.total) * 100;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>{item.label}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>{item.value} ({Math.round(percentage)}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 100%)`, borderRadius: '999px', transition: 'width 1s ease' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Type Distribution */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
            <div className="flex items-center gap-2 mb-6">
              <PieChart size={24} style={{ color: '#f093fb' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>User Distribution</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { label: 'Donors', value: stats?.users?.donors || 0, color: '#667eea', icon: '🎁' },
                { label: 'Receivers', value: stats?.users?.receivers || 0, color: '#f093fb', icon: '🤝' },
                { label: 'Organizations', value: stats?.users?.organizations || 0, color: '#4facfe', icon: '🏢' },
                { label: 'Verified', value: stats?.users?.verified || 0, color: '#10b981', icon: '✅' }
              ].map((item, index) => {
                const total = stats?.users?.total || 1;
                const percentage = (item.value / total) * 100;
                return (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', background: `${item.color}20`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>{item.label}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: '700', color: item.color }}>{item.value}</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, height: '100%', background: item.color, borderRadius: '999px', transition: 'width 1s ease' }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Impact Metrics Chart */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem', borderRadius: '20px', boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)', marginBottom: '2rem', color: 'white' }}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={28} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Impact Metrics & Environmental Savings</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Food Saved', value: `${stats?.impact?.totalKgSaved || 0} kg`, icon: '🍽️', desc: 'Total food rescued' },
              { label: 'Meals Served', value: Math.round((stats?.impact?.totalKgSaved || 0) * 2.5), icon: '🥘', desc: 'Approximate meals' },
              { label: 'CO₂ Reduced', value: `${Math.round((stats?.impact?.totalKgSaved || 0) * 2.5)} kg`, icon: '🌱', desc: 'Carbon footprint saved' },
              { label: 'Water Saved', value: `${Math.round((stats?.impact?.totalKgSaved || 0) * 1000)} L`, icon: '💧', desc: 'Water conservation' }
            ].map((item, index) => (
              <div key={index} style={{ background: 'rgba(255,255,255,0.15)', padding: '1.5rem', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <p style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>{item.value}</p>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, fontWeight: '600' }}>{item.label}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Expired Food Distribution - Animal Farms & Biocompost */}
        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '2rem', borderRadius: '20px', boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)', marginBottom: '2rem', color: 'white' }}>
          <div className="flex items-center gap-2 mb-6">
            <Leaf size={28} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Expired Food Distribution & Waste Management</h3>
          </div>
          <p style={{ fontSize: '0.95rem', opacity: 0.95, marginBottom: '1.5rem', lineHeight: '1.6' }}>
            When food donations expire or are not claimed, they are automatically redirected to animal farms or biocompost facilities to minimize waste and support sustainability.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'To Animal Farms', value: '45 kg', icon: '🐄', desc: 'Fed to livestock', color: 'rgba(139, 92, 246, 0.2)' },
              { label: 'To Biocompost', value: '32 kg', icon: '🌿', desc: 'Converted to compost', color: 'rgba(16, 185, 129, 0.2)' },
              { label: 'Total Redirected', value: '77 kg', icon: '♻️', desc: 'Zero waste achieved', color: 'rgba(59, 130, 246, 0.2)' }
            ].map((item, index) => (
              <div key={index} style={{ background: item.color, padding: '1.5rem', borderRadius: '16px', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <p style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>{item.value}</p>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>{item.label}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '1.5rem', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🐄</span>
                Animal Farm Partners
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { name: 'Green Valley Farm', location: 'Pune', amount: '18 kg' },
                  { name: 'Happy Cattle Ranch', location: 'Mumbai', amount: '15 kg' },
                  { name: 'Sunrise Dairy', location: 'Nashik', amount: '12 kg' }
                ].map((farm, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{farm.name}</p>
                      <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>📍 {farm.location}</p>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '999px' }}>{farm.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '1.5rem', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🌿</span>
                Biocompost Facilities
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { name: 'EcoGreen Compost', location: 'Bangalore', amount: '14 kg' },
                  { name: 'Nature\'s Cycle', location: 'Hyderabad', amount: '10 kg' },
                  { name: 'Green Earth Biocompost', location: 'Chennai', amount: '8 kg' }
                ].map((facility, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{facility.name}</p>
                      <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>📍 {facility.location}</p>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '999px' }}>{facility.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', borderLeft: '4px solid white' }}>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              <strong>♻️ Zero Waste Initiative:</strong> Our automated fallback system ensures no food goes to waste. When donations expire, they're immediately redirected to registered animal farms or biocompost facilities, contributing to a circular economy and sustainable food system.
            </p>
          </div>
        </div>

        {/* Database Statistics */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <div className="flex items-center gap-2 mb-6">
            <Activity size={24} style={{ color: '#10b981' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Real-Time Database Statistics</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '1rem' }}>📊 Collection Stats</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Total Documents', value: (stats?.users?.total || 0) + (stats?.listings?.total || 0) + (stats?.totalChats || 0) },
                  { label: 'Users Collection', value: stats?.users?.total || 0 },
                  { label: 'Listings Collection', value: stats?.listings?.total || 0 },
                  { label: 'Chats Collection', value: stats?.totalChats || 0 },
                  { label: 'Notifications', value: stats?.totalNotifications || 0 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between" style={{ padding: '0.5rem', background: '#f9fafb', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '1rem' }}>⚡ Activity Metrics</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Active Users Today', value: stats?.activeToday || 0 },
                  { label: 'New Users (7d)', value: stats?.newUsersWeek || 0 },
                  { label: 'Active Listings', value: stats?.listings?.available || 0 },
                  { label: 'Pending Claims', value: stats?.listings?.claimed || 0 },
                  { label: 'Avg Response Time', value: '< 5 min' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between" style={{ padding: '0.5rem', background: '#f0fdf4', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#10b981' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '1rem' }}>🎯 Performance</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Success Rate', value: `${stats?.listings?.total > 0 ? Math.round((stats?.impact?.completedDonations / stats?.listings?.total) * 100) : 0}%` },
                  { label: 'Avg Rating', value: `${stats?.averageRating || '4.8'} ⭐` },
                  { label: 'Total Feedbacks', value: stats?.totalFeedbacks || 0 },
                  { label: 'Verified Orgs', value: stats?.users?.verified || 0 },
                  { label: 'Platform Uptime', value: '99.9%' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between" style={{ padding: '0.5rem', background: '#eff6ff', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#3b82f6' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions Section */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <div className="flex items-center gap-2 mb-6">
            <Settings size={24} style={{ color: '#667eea' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>Quick Actions</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Manage Users', icon: <Users size={20} />, color: '#667eea', href: '/admin/users' },
              { label: 'Manage Checkpoints', icon: <Award size={20} />, color: '#f093fb', href: '/admin/checkpoints' },
              { label: 'Manage Rewards', icon: <Gift size={20} />, color: '#4facfe', href: '/admin/rewards' },
              { label: 'Manage Volunteers', icon: <UserCheck size={20} />, color: '#10b981', href: '/admin/volunteers' },
              { label: 'View Leaderboard', icon: <BarChart3 size={20} />, color: '#f59e0b', href: '/leaderboard' },
              { label: 'Profile Settings', icon: <Settings size={20} />, color: '#8b5cf6', href: '/profile/edit' }
            ].map((action, index) => (
              <a
                key={index}
                href={action.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#1e293b',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.color;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${action.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: `0 4px 12px ${action.color}40`
                }}>
                  {action.icon}
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{action.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Disaster Management & External Links */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '2rem', borderRadius: '20px', boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)', color: 'white' }}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                🚨
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>Disaster Management</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Emergency food distribution system</p>
              </div>
            </div>
            <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6', opacity: 0.95 }}>
              Access our dedicated disaster management portal for emergency food relief operations, crisis response coordination, and rapid deployment.
            </p>
            <button
              onClick={() => window.open('https://disaster-management.samarthasetu.org', '_blank')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.5rem',
                background: 'white',
                color: '#dc2626',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                width: '100%',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
            >
              <Shield size={20} />
              <span>Open Disaster Portal</span>
              <ExternalLink size={18} />
            </button>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '2px solid #f59e0b' }}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <AlertCircle size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem' }}>Pending Verifications</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Organizations awaiting approval</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '3.5rem', fontWeight: '800', color: '#f59e0b' }}>{stats?.pendingVerifications || 0}</p>
              <p style={{ fontSize: '1rem', color: '#64748b' }}>pending</p>
            </div>
            <a
              href="/admin/verifications"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.875rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <UserCheck size={18} />
              Review Verifications
            </a>
          </div>
        </div>

        {/* Volunteer Management Section */}
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '2rem', borderRadius: '20px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)', marginBottom: '2rem', color: 'white' }}>
          <div className="flex items-center gap-3 mb-6">
            <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
              🤝
            </div>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>Volunteer Management</h2>
              <p style={{ fontSize: '0.95rem', opacity: 0.9 }}>Manage and coordinate volunteer activities</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Volunteers', value: 10, icon: '👥', desc: 'Registered volunteers' },
              { label: 'Active This Month', value: 8, icon: '⚡', desc: 'Currently active' },
              { label: 'Hours Contributed', value: 360, icon: '⏰', desc: 'Total volunteer hours' }
            ].map((item, index) => (
              <div key={index} style={{ background: 'rgba(255,255,255,0.15)', padding: '1.5rem', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <p style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.25rem' }}>{item.value}</p>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>{item.label}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Register New Volunteer', icon: <UserPlus size={20} />, color: 'white', bgColor: 'rgba(255,255,255,0.2)', href: '/admin/volunteers/register' },
              { label: 'Manage Volunteers', icon: <UserCog size={20} />, color: 'white', bgColor: 'rgba(255,255,255,0.2)', href: '/admin/volunteers' },
              { label: 'Send Notifications', icon: <Mail size={20} />, color: 'white', bgColor: 'rgba(255,255,255,0.2)', href: '/admin/volunteers/notify' },
              { label: 'Contact Volunteers', icon: <Phone size={20} />, color: 'white', bgColor: 'rgba(255,255,255,0.2)', href: '/admin/volunteers/contact' }
            ].map((action, index) => (
              <a
                key={index}
                href={action.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  background: action.bgColor,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: action.color,
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = action.bgColor;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {action.icon}
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '700' }}>{action.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Platform Funding & Sustainability Section */}
        <div className="card mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Platform Funding & Operations</h2>
              <p className="text-sm text-gray-600">How we sustain Samartha Setu</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="text-green-600" size={20} />
                <h3 className="font-semibold text-gray-900">Corporate Sponsors</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Platform running costs funded by green technology companies and CSR initiatives
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Server Hosting</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Development</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Maintenance</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="text-emerald-600" size={20} />
                <h3 className="font-semibold text-gray-900">Green Tech Partners</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Companies supporting sustainable technologies provide infrastructure and resources
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded">Cloud Credits</span>
                <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded">API Access</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Award className="text-purple-600" size={20} />
                <h3 className="font-semibold text-gray-900">Grant Funding</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Government and NGO grants for social impact and food security initiatives
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">SDG Grants</span>
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">Impact Funds</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-sm text-blue-900">
              <strong>💡 Note:</strong> Samartha Setu operates as a non-profit platform. All funding goes towards platform operations, volunteer support, and community rewards.
            </p>
          </div>
        </div>

        {/* Volunteer Gifts & Redemption Points Section */}
        <div className="card mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Gift className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Volunteer Rewards & Redemption</h2>
              <p className="text-sm text-gray-600">Gifts provided by green technology partners</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                <Gift className="text-purple-600" size={20} />
                Redemption Catalog
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <p className="font-semibold text-sm">Eco-Friendly Products</p>
                    <p className="text-xs text-gray-600">Reusable bags, bamboo products, solar gadgets</p>
                    <p className="text-xs text-purple-600 font-medium mt-1">500-1000 points</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <p className="font-semibold text-sm">Gift Vouchers</p>
                    <p className="text-xs text-gray-600">Partner stores, organic food, green products</p>
                    <p className="text-xs text-purple-600 font-medium mt-1">1000-2500 points</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="font-semibold text-sm">Recognition Certificates</p>
                    <p className="text-xs text-gray-600">Digital badges, social media features</p>
                    <p className="text-xs text-purple-600 font-medium mt-1">Free with milestones</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="text-green-600" size={20} />
                Partner Companies
              </h3>
              <div className="space-y-3">
                <div className="p-3 border border-green-200 rounded-lg">
                  <p className="font-semibold text-sm text-green-700">Green Tech Startups</p>
                  <p className="text-xs text-gray-600 mt-1">Sustainable products, eco-friendly gadgets</p>
                </div>
                <div className="p-3 border border-blue-200 rounded-lg">
                  <p className="font-semibold text-sm text-blue-700">Renewable Energy Companies</p>
                  <p className="text-xs text-gray-600 mt-1">Solar panels, energy-efficient devices</p>
                </div>
                <div className="p-3 border border-emerald-200 rounded-lg">
                  <p className="font-semibold text-sm text-emerald-700">Organic Food Brands</p>
                  <p className="text-xs text-gray-600 mt-1">Healthy snacks, organic groceries</p>
                </div>
                <div className="p-3 border border-purple-200 rounded-lg">
                  <p className="font-semibold text-sm text-purple-700">Sustainable Fashion</p>
                  <p className="text-xs text-gray-600 mt-1">Eco-friendly clothing, recycled materials</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded">
            <p className="text-sm text-purple-900">
              <strong>🎁 How it works:</strong> Donors earn points for each donation. Points can be redeemed for gifts provided by our green technology partners who support sustainable initiatives.
            </p>
          </div>
        </div>

        {/* Logistics & Operations Section */}
        <div className="card bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
              <Truck className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Logistics & Operations</h2>
              <p className="text-sm text-gray-600">Platform features for efficient food distribution</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🗺️</span>
                </div>
                <h3 className="font-semibold text-gray-900">Real-time Tracking</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Live location updates for receivers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>ETA notifications to donors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Route optimization suggestions</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📦</span>
                </div>
                <h3 className="font-semibold text-gray-900">Smart Matching</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Geospatial proximity matching</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Automated fallback routing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Priority for urgent needs</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🔔</span>
                </div>
                <h3 className="font-semibold text-gray-900">Communication</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Real-time chat between parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Instant push notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>SMS alerts for critical updates</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">⏱️</span>
                Time Management
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Pickup time windows with reminders</li>
                <li>• Automatic expiration after TTL</li>
                <li>• Fallback triggers for unclaimed food</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">📊</span>
                Analytics & Reporting
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Impact metrics (kg saved, CO₂ reduced)</li>
                <li>• Donor/receiver activity tracking</li>
                <li>• Geographic heat maps</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-orange-100 border-l-4 border-orange-600 p-4 rounded">
            <p className="text-sm text-orange-900">
              <strong>🚚 Logistics Support:</strong> Platform provides digital infrastructure. Physical transportation handled by receivers or volunteer networks. Future: Partnership with logistics companies for bulk donations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
