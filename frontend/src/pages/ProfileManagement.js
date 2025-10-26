import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileManagement = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data.user);
      toast.success('Profile updated successfully! ✅');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
              👤 Profile Management
            </h1>
            <p style={{ fontSize: '1rem', color: '#64748b' }}>Manage your personal information</p>
          </div>

          {/* Profile Card */}
          <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            {/* Header Section */}
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem', color: 'white', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: '800', color: '#667eea' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <button style={{ position: 'absolute', bottom: 0, right: 0, width: '32px', height: '32px', borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                    <Camera size={16} style={{ color: '#667eea' }} />
                  </button>
                </div>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>{user?.name}</h2>
                  <p style={{ fontSize: '1rem', opacity: 0.9 }}>{user?.email}</p>
                  <div style={{ marginTop: '0.5rem', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', display: 'inline-block', fontSize: '0.875rem', fontWeight: '600' }}>
                    {user?.role === 'donor' ? '🎁 Donor' : user?.role === 'receiver' ? '🤝 Receiver' : '👑 Admin'}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div style={{ padding: '2rem' }}>
              {!isEditing ? (
                // View Mode
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <User size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Full Name</p>
                        <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>{user?.name}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Mail size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Email Address</p>
                        <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>{user?.email}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Phone size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Phone Number</p>
                        <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>{user?.phone || 'Not provided'}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <MapPin size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Address</p>
                        <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>{user?.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.875rem', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', outline: 'none', transition: 'all 0.2s' }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled
                        style={{ width: '100%', padding: '0.875rem', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', background: '#f9fafb', cursor: 'not-allowed' }}
                      />
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Email cannot be changed</p>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.875rem', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', outline: 'none', transition: 'all 0.2s' }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        style={{ width: '100%', padding: '0.875rem', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', outline: 'none', transition: 'all 0.2s', resize: 'vertical' }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                      >
                        <Save size={18} />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
