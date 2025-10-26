import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = user.role === 'donor' ? '/donor/dashboard' 
        : user.role === 'receiver' ? '/receiver/dashboard' 
        : '/admin/dashboard';
      navigate(dashboardPath);
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Navigation handled by useEffect above
    }
    
    setLoading(false);
  };

  // Auto-fill demo credentials
  const fillDemoCredentials = (email, password) => {
    setFormData({
      email: email,
      password: password
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', textDecoration: 'none', transition: 'transform 0.2s' }}
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
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ fontSize: '1rem', color: '#64748b' }}>Sign in to continue making a difference</p>
        </div>

        {/* Login Form */}
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                placeholder="you@example.com"
                required
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                placeholder="••••••••"
                required
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #34D399 0%, #3B82F6 100%)', color: 'white', borderRadius: '10px', border: 'none', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(52, 211, 153, 0.4)', transition: 'all 0.3s', opacity: loading ? 0.7 : 1 }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 6px 20px rgba(52, 211, 153, 0.5)')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 14px rgba(52, 211, 153, 0.4)')}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={20} />
                  Sign in
                </span>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#3B82F6', fontWeight: '600', textDecoration: 'none' }}>
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials - Clickable */}
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)', borderRadius: '12px', border: '1px solid #dbeafe' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>
              🚀 Quick Demo Login:
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('rajesh@example.com', 'Donor@123')}
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'white', border: '1px solid #93c5fd', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1d4ed8' }}>Donor Account</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>rajesh@example.com</p>
                  </div>
                  <span style={{ color: '#3B82F6', fontSize: '0.75rem', fontWeight: '600' }}>Click →</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials('amit@example.com', 'Receiver@123')}
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'white', border: '1px solid #86efac', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#15803d' }}>Receiver Account</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>amit@example.com</p>
                  </div>
                  <span style={{ color: '#22C55E', fontSize: '0.75rem', fontWeight: '600' }}>Click →</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials('admin@samarthasetu.org', 'Admin@123')}
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'white', border: '1px solid #c4b5fd', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#faf5ff'; e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(147, 51, 234, 0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#6b21a8' }}>Admin Account</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>admin@samarthasetu.org</p>
                  </div>
                  <span style={{ color: '#9333EA', fontSize: '0.75rem', fontWeight: '600' }}>Click →</span>
                </div>
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.75rem', textAlign: 'center' }}>
              Click any button above to auto-fill, then click "Sign in"
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1e293b'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
