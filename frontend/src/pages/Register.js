import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, MapPin, Building } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: location.state?.role || 'donor',
    subtype: 'individual',
    phone: '',
    address: '',
    organizationName: '',
    latitude: '',
    longitude: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.subtype === 'organization' && !formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get location. Please enter manually or allow location access.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      subtype: formData.subtype,
      phone: formData.phone,
      address: formData.address,
      organizationName: formData.organizationName
    };

    // Add location if provided
    if (formData.latitude && formData.longitude) {
      userData.location = {
        type: 'Point',
        coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
      };
    }

    const result = await register(userData);
    
    if (result.success) {
      const dashboardPath = formData.role === 'donor' ? '/donor/dashboard' 
        : formData.role === 'receiver' ? '/receiver/dashboard' 
        : '/admin/dashboard';
      navigate(dashboardPath);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', textDecoration: 'none', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img 
              src="/images/logo.jpg" 
              alt="Samartha Setu Logo"
              style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', background: 'linear-gradient(135deg, #34D399 0%, #3B82F6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Samartha Setu</span>
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ fontSize: '1rem', color: '#64748b' }}>Join the movement to end food waste</p>
        </div>

        {/* Register Form */}
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Role Selection */}
            <div>
              <label className="label">I want to</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'donor' }))}
                  className={`p-4 border-2 rounded-lg transition ${
                    formData.role === 'donor'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">Donate Food</div>
                  <div className="text-sm text-gray-600">Share surplus food</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'receiver' }))}
                  className={`p-4 border-2 rounded-lg transition ${
                    formData.role === 'receiver'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">Receive Food</div>
                  <div className="text-sm text-gray-600">Find food nearby</div>
                </button>
              </div>
            </div>

            {/* Subtype Selection */}
            <div>
              <label className="label">Account Type</label>
              <select
                name="subtype"
                value={formData.subtype}
                onChange={handleChange}
                className="input"
              >
                <option value="individual">Individual</option>
                <option value="organization">Organization</option>
                {formData.role === 'receiver' && (
                  <>
                    <option value="charity">Charity/NGO</option>
                    <option value="animal_farm">Animal Farm</option>
                    <option value="biocompost_collector">Biocompost Collector</option>
                  </>
                )}
              </select>
            </div>

            {/* Organization Name */}
            {formData.subtype === 'organization' && (
              <div>
                <label className="label">
                  <Building size={16} className="inline mr-2" />
                  Organization Name
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className={`input ${errors.organizationName ? 'border-red-500' : ''}`}
                  placeholder="Your organization name"
                />
                {errors.organizationName && (
                  <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <User size={16} className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="John Doe"
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="label">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                  placeholder="+91-9876543210"
                />
              </div>
            </div>

            <div>
              <label className="label">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="you@example.com"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <Lock size={16} className="inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  required
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label className="label">
                <MapPin size={16} className="inline mr-2" />
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input"
                placeholder="Your address"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="input"
                  placeholder="Latitude"
                />
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="input"
                  placeholder="Longitude"
                />
              </div>
              <button
                type="button"
                onClick={handleGetLocation}
                className="btn btn-outline"
              >
                Get Location
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus size={18} />
                  Create Account
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
