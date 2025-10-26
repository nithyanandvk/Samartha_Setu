import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { Heart, TrendingUp, MapPin, Award, Clock, Zap, Leaf, Users, Globe, Sparkles, ArrowRight, CheckCircle, Star, Target } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    mealsToday: 0,
    kgThisWeek: 0,
    activeDonors: 0,
    co2Prevented: 0
  });

  console.log('🏠 LandingPage rendering, isAuthenticated:', isAuthenticated, 'user:', user);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      const data = response.data.stats;
      
      // Use same calculations as admin dashboard
      const totalKgSaved = data.impact?.totalKgSaved || 0;
      const completedDonations = data.impact?.completedDonations || 0;
      const totalUsers = data.users?.total || 0;
      
      setStats({
        mealsToday: completedDonations, // Same as admin "Completed" stat
        kgThisWeek: totalKgSaved, // Same as admin "Food Saved" stat
        activeDonors: totalUsers, // Same as admin "Total Users" stat
        co2Prevented: Math.round(totalKgSaved * 2.5) // Same calculation as admin
      });
    } catch (error) {
      console.log('Stats not available (requires admin access)');
      // Use default stats for public view
      const kgSaved = 450;
      setStats({
        mealsToday: 150,
        kgThisWeek: kgSaved,
        activeDonors: 89,
        co2Prevented: Math.round(kgSaved * 2.5)
      });
    }
  };

  const handleGetStarted = (role) => {
    if (isAuthenticated) {
      if (user.role === role) {
        navigate(role === 'donor' ? '/donor/dashboard' : '/receiver/dashboard');
      } else {
        navigate('/');
      }
    } else {
      navigate('/register', { state: { role } });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Animated Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'rgba(251, 191, 36, 0.3)', borderRadius: '50%', filter: 'blur(80px)', animation: 'float 20s infinite ease-in-out' }}></div>
        <div style={{ position: 'absolute', top: '60%', right: '10%', width: '400px', height: '400px', background: 'rgba(52, 211, 153, 0.3)', borderRadius: '50%', filter: 'blur(80px)', animation: 'float 25s infinite ease-in-out', animationDelay: '5s' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: '350px', height: '350px', background: 'rgba(147, 51, 234, 0.3)', borderRadius: '50%', filter: 'blur(80px)', animation: 'float 30s infinite ease-in-out', animationDelay: '10s' }}></div>
      </div>
      
      <Navbar />

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 1, padding: '4rem 1rem', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          {/* Platform Name Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', marginBottom: '2rem', animation: 'slideDown 0.8s ease-out' }}>
            <img 
              src="/images/logo.jpg" 
              alt="Samartha Setu Logo" 
              className=""
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.outerHTML = '<span class="text-2xl bounce"></span>';
              }}
            />
            <Sparkles size={20} style={{ color: '#FBBF24' }} />
            <span style={{ fontWeight: '700', color: 'white', fontSize: '1rem', letterSpacing: '0.5px' }}>Samartha Setu</span>
            <Sparkles size={20} style={{ color: '#FBBF24' }} />
          </div>
          
          {/* Main Heading - The Powerful Tagline */}
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.1', fontFamily: 'Poppins, sans-serif', animation: 'fadeInUp 1s ease-out 0.2s both' }}>
            <span style={{ display: 'block', background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #FBBF24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite', marginBottom: '0.5rem' }}>"The food you save today</span>
            <span style={{ display: 'block', color: 'white', textShadow: '0 0 30px rgba(255,255,255,0.5)' }}>might save a life tomorrow."</span>
          </h1>
          
          {/* Subheading */}
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', marginBottom: '3rem', maxWidth: '900px', margin: '0 auto 3rem', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.95)', animation: 'fadeInUp 1s ease-out 0.4s both', fontWeight: '400' }}>
            🌉 Symbolizing the <span style={{ fontWeight: '700', color: '#FBBF24' }}>Ram Setu</span> — connecting donors and receivers across India.<br/>
            <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'white' }}>Share surplus food instantly. Build a bridge of kindness.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16 scale-in" style={{animationDelay: '0.4s', maxWidth: '600px', margin: '0 auto', marginBottom: '3rem'}}>
            <button
              onClick={() => handleGetStarted('donor')}
              className="btn-primary"
              style={{width: '100%', maxWidth: '280px'}}
            >
              <Heart size={20} />
              I Have Food to Share
            </button>
            
            <button
              onClick={() => handleGetStarted('receiver')}
              className="btn-cta"
              style={{width: '100%', maxWidth: '280px'}}
            >
              <MapPin size={20} />
              I Need Food
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card-interactive text-center scale-in" style={{animationDelay: '0.5s'}}>
              <div className="text-5xl font-bold mb-2" style={{background: 'linear-gradient(to right, #34D399, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Poppins, sans-serif'}}>{stats.mealsToday}+</div>
              <div className="font-semibold" style={{color: '#64748B'}}>Donations Completed</div>
            </div>
            <div className="card-interactive text-center scale-in" style={{animationDelay: '0.6s'}}>
              <div className="text-5xl font-bold mb-2" style={{background: 'linear-gradient(to right, #34D399, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Poppins, sans-serif'}}>{stats.kgThisWeek} kg</div>
              <div className="font-semibold" style={{color: '#64748B'}}>Total Food Saved</div>
            </div>
            <div className="card-interactive text-center scale-in" style={{animationDelay: '0.7s'}}>
              <div className="text-5xl font-bold mb-2" style={{background: 'linear-gradient(to right, #34D399, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Poppins, sans-serif'}}>{stats.activeDonors}+</div>
              <div className="font-semibold" style={{color: '#64748B'}}>Community Members</div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Environmental Impact Section - SDG 13 */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-green-200">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Icon & Badge */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <Leaf className="text-white" size={48} />
                  </div>
                  <div className="mt-4 text-center">
                    <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      SDG 13: Climate Action
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Our Environmental Impact
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    "By minimizing food waste through Samartha Setu, our community has prevented{' '}
                    <span className="font-bold text-green-600 text-2xl">{stats.co2Prevented} kg</span>{' '}
                    of CO₂ emissions, contributing directly to{' '}
                    <span className="font-semibold text-green-700">SDG 13: Climate Action</span>."
                  </p>
                  
                  {/* Impact Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-green-600">{stats.kgThisWeek} kg</div>
                      <div className="text-sm text-gray-600">Food Waste Prevented</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-emerald-600">{stats.co2Prevented} kg</div>
                      <div className="text-sm text-gray-600">CO₂ Emissions Saved</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-4 italic">
                    * Based on average 2.5 kg CO₂ equivalent per kg of food waste
                  </p>
                </div>
              </div>

              {/* Additional SDG Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Zero Hunger (SDG 2)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Responsible Consumption (SDG 12)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Climate Action (SDG 13)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why <span className="text-gradient">Samartha Setu</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple, powerful platform connecting food donors with receivers in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Post Food</h3>
              <p className="text-white-600 leading-relaxed">
                Donors list surplus food with location, quantity, and pickup times
              </p>
            </div>

            <div className="glass-card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Find Nearby</h3>
              <p className="text-white-600 leading-relaxed">
                Receivers see real-time listings on an interactive map
              </p>
            </div>

            <div className="glass-card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Claim & Confirm</h3>
              <p className="text-white-600 leading-relaxed">
                Instant claim-confirm flow with real-time notifications
              </p>
            </div>

            <div className="glass-card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Earn Rewards</h3>
              <p className="text-white-600 leading-relaxed">
                Donors earn points, badges, and recognition for their impact
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-black !important">Why Samartha Setu?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-600">Real-time Updates</h3>
                    <p className="text-gray-600">
                      Socket.IO powered instant notifications for claims, confirmations, and messages
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-600">Hyperlocal Matching</h3>
                    <p className="text-gray-600">
                      Geospatial queries ensure food reaches nearby receivers quickly
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-600">Smart Fallback</h3>
                    <p className="text-gray-600">
                      Auto-routing to animal farms or biocompost if no claims within time limit
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-600">Gamification</h3>
                    <p className="text-gray-600">
                      Points, badges, leaderboard, and rewards to motivate continued giving
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join the Movement Today
          </h2>
          <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
            Be part of India's largest food-sharing network. Every meal counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 bg-white text-gray-600 rounded-xl font-semibold text-lg shadow-xl hover-lift">
              Get Started Free
            </Link>
            <Link to="/map" className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-indigo-600 transition">
              Explore Map
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '4rem 0 0 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
          {/* Main Footer Content */}
          <div className="footer-grid" style={{ marginBottom: '3rem' }}>
            {/* About */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <img 
                  src="/images/logo.jpg" 
                  alt="Samartha Setu Logo"
                  style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(135deg, #34D399 0%, #FBBF24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Samartha Setu</span>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1rem' }}>
                Building bridges of compassion across India, one meal at a time.
              </p>
              <p style={{ fontSize: '0.875rem', color: '#FBBF24', fontStyle: 'italic', fontWeight: '500' }}>
                "The food you save today might save a life tomorrow."
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', fontFamily: 'Poppins, sans-serif', color: 'white' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/map" style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#34D399'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                >→ Interactive Map</Link>
                <Link to="/leaderboard" style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#34D399'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                >→ Leaderboard</Link>
                <Link to="/register" style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#34D399'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                >→ Get Started</Link>
                <Link to="/login" style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#34D399'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                >→ Sign In</Link>
              </div>
            </div>
            
            {/* Contact */}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', fontFamily: 'Poppins, sans-serif', color: 'white' }}>Contact Us</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                <p>📧 contact@samarthasetu.org</p>
                <p>💬 support@samarthasetu.org</p>
                <p>🌐 www.samarthasetu.org</p>
              </div>
            </div>
            
            {/* Social */}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', fontFamily: 'Poppins, sans-serif', color: 'white' }}>Connect With Us</h4>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <button 
                  onClick={() => window.open('https://twitter.com', '_blank')}
                  style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(52, 211, 153, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(52, 211, 153, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  aria-label="Twitter"
                >
                  <span style={{ fontSize: '1.25rem' }}>🐦</span>
                </button>
                <button 
                  onClick={() => window.open('https://facebook.com', '_blank')}
                  style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(52, 211, 153, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(52, 211, 153, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  aria-label="Facebook"
                >
                  <span style={{ fontSize: '1.25rem' }}>📘</span>
                </button>
                <button 
                  onClick={() => window.open('https://linkedin.com', '_blank')}
                  style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(52, 211, 153, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(52, 211, 153, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  aria-label="LinkedIn"
                >
                  <span style={{ fontSize: '1.25rem' }}>💼</span>
                </button>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Follow us for updates</p>
            </div>
          </div>

          {/* Team Section */}
          <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.2)', paddingTop: '3rem', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(135deg, #34D399 0%, #3B82F6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Meet Our Team
              </h3>
              <p style={{ fontSize: '1rem', color: '#94a3b8' }}>Passionate individuals building a hunger-free India</p>
            </div>
            
            <div className="team-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {[
                { name: 'Allam Gowri Shankar', role: 'Lead', color: '#3B82F6' },
                { name: 'V K Nithyanand', role: 'Full Stack Developer', color: '#8B5CF6' },
                { name: 'Gangam Vamsi Sanjeev', role: 'Full Stack Developer', color: '#10B981' },
                { name: 'Gajula Tulasi', role: 'Full Stack Developer', color: '#F59E0B' },
                { name: 'Boya Teja Srinivasulu', role: 'Full Stack Developer', color: '#EC4899' }
              ].map((member, index) => (
                <div key={index} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = member.color; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `linear-gradient(135deg, ${member.color}40 0%, ${member.color}20 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: `2px solid ${member.color}` }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: '700', color: member.color }}>{member.name.charAt(0)}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem', fontFamily: 'Poppins, sans-serif' }}>{member.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.2)', padding: '2rem 0', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                🌉 Symbolizing the <span style={{ color: '#FBBF24', fontWeight: '600' }}>Ram Setu</span> — connecting donors and receivers across India
              </p>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Aligned with <span style={{ color: '#34D399', fontWeight: '600' }}>UN SDGs 2, 12 & 13</span> • Zero Hunger • Responsible Consumption • Climate Action
              </p>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              © 2025 Samartha Setu. Built with ❤️ for social impact. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
