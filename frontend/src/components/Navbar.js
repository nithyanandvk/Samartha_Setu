import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationsAPI, nutritionAPI } from '../utils/api';
import socketService from '../utils/socket';
import { Bell, Menu, X, User, LogOut, LayoutDashboard, MapPin, Award, Sparkles, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [nutritionModalOpen, setNutritionModalOpen] = useState(false);
  const [foodItem, setFoodItem] = useState('');
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      
      // Listen for real-time notifications
      socketService.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        socketService.removeAllListeners('notification');
      };
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll({ limit: 10 });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await notificationsAPI.markAsRead(notification._id);
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Navigate based on notification type
      if (notification.relatedListing) {
        navigate(`/listing/${notification.relatedListing._id || notification.relatedListing}`);
      }
      
      setNotificationsOpen(false);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNutritionSearch = async () => {
    if (!foodItem.trim()) {
      toast.error('Please enter a food item');
      return;
    }

    setLoading(true);
    try {
      const response = await nutritionAPI.analyze(foodItem);
      setNutritionInfo(response.data);
      toast.success('Nutrition info loaded!');
    } catch (error) {
      console.error('Nutrition API error:', error);
      toast.error(error.response?.data?.message || 'Failed to get nutrition information');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleNutritionSearch();
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'donor':
        return '/donor/dashboard';
      case 'receiver':
        return '/receiver/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav style={{background: 'white', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #f3f4f6',color:"black"}}>
      <div className="container mx-auto" style={{padding: '0 1rem'}}>
        <div className="flex items-center justify-between" style={{height: '64px'}}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" style={{transition: 'transform 0.3s', textDecoration: 'none'}}>
            <img 
              src="/images/logo.jpg" 
              alt="Samartha Setu Logo" 
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span style={{
              fontSize: '18px',
              fontWeight: '800',
              fontFamily: 'Poppins, sans-serif',
              background: 'linear-gradient(to right, #34D399, #FBBF24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }} className="hidden sm:inline">Samartha Setu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/map" style={{
              padding: '10px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#1E293B',
              fontWeight: '500',
              transition: 'all 0.2s',
              textDecoration: 'none'
            }} onMouseEnter={(e) => e.currentTarget.style.background = '#F0FDF4'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <MapPin size={20} color="#34D399" />
              <span>Map</span>
            </Link>
            <Link to="/leaderboard" style={{
              padding: '10px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#1E293B',
              fontWeight: '500',
              transition: 'all 0.2s',
              textDecoration: 'none'
            }} onMouseEnter={(e) => e.currentTarget.style.background = '#F0FDF4'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <Award size={20} color="#34D399" />
              <span>Leaderboard</span>
            </Link>
            <button
              onClick={() => setNutritionModalOpen(true)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#1E293B',
                fontWeight: '500',
                transition: 'all 0.2s',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#FEF3C7'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Sparkles size={20} color="#F59E0B" />
              <span>Nutrition Tracker</span>
            </button>

            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#1E293B',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }} onMouseEnter={(e) => e.currentTarget.style.background = '#F0FDF4'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <LayoutDashboard size={20} color="#34D399" />
                  <span>Dashboard</span>
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                    style={{
                      background: notificationsOpen ? 'rgba(52, 211, 153, 0.1)' : 'transparent'
                    }}
                  >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse"
                        style={{
                          background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'
                        }}
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setNotificationsOpen(false)}
                      />
                      
                      {/* Notification Dropdown */}
                      <div 
                        className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col"
                        style={{
                          animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          maxHeight: '80vh',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Header */}
                        <div className="flex-shrink-0" style={{ 
                          padding: '1.25rem 1.5rem', 
                          borderBottom: '1px solid #f3f4f6',
                          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                        }}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem' }}>Notifications</h3>
                              {unreadCount > 0 && (
                                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}</p>
                              )}
                            </div>
                            {unreadCount > 0 && (
                              <span style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: 'white',
                                background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                                boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)',
                                animation: 'pulse 2s infinite'
                              }}>
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto" style={{ 
                          scrollBehavior: 'smooth',
                          WebkitOverflowScrolling: 'touch'
                        }}>
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                              <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                                style={{
                                  background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)'
                                }}
                              >
                                <Bell size={32} className="text-gray-400" />
                              </div>
                              <p className="text-gray-500 font-medium">No notifications yet</p>
                              <p className="text-xs text-gray-400 mt-1">We'll notify you when something happens</p>
                            </div>
                          ) : (
                            <div>
                              {notifications.map((notif) => {
                                const getNotificationIcon = (type) => {
                                  switch(type) {
                                    case 'listing_claimed': return '🎯';
                                    case 'claim_confirmed': return '✅';
                                    case 'claim_rejected': return '❌';
                                    case 'listing_completed': return '🎉';
                                    case 'new_message': return '💬';
                                    case 'rating_received': return '⭐';
                                    case 'feedback_received': return '💚';
                                    case 'eta_updated': return '🚗';
                                    case 'listing_expired': return '⏰';
                                    default: return '🔔';
                                  }
                                };

                                const getTimeAgo = (date) => {
                                  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
                                  if (seconds < 60) return 'Just now';
                                  const minutes = Math.floor(seconds / 60);
                                  if (minutes < 60) return `${minutes}m ago`;
                                  const hours = Math.floor(minutes / 60);
                                  if (hours < 24) return `${hours}h ago`;
                                  const days = Math.floor(hours / 24);
                                  return `${days}d ago`;
                                };

                                return (
                                  <div
                                    key={notif._id}
                                    onClick={() => handleNotificationClick(notif)}
                                    style={{
                                      padding: '1rem 1.25rem',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                      borderBottom: '1px solid #f3f4f6',
                                      background: !notif.isRead ? 'linear-gradient(90deg, rgba(52, 211, 153, 0.08) 0%, rgba(255, 255, 255, 0) 100%)' : 'transparent',
                                      borderLeft: !notif.isRead ? '4px solid #34D399' : '4px solid transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = !notif.isRead ? 'linear-gradient(90deg, rgba(52, 211, 153, 0.12) 0%, rgba(255, 255, 255, 0) 100%)' : '#f9fafb';
                                      e.currentTarget.style.transform = 'translateX(2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = !notif.isRead ? 'linear-gradient(90deg, rgba(52, 211, 153, 0.08) 0%, rgba(255, 255, 255, 0) 100%)' : 'transparent';
                                      e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                  >
                                    <div className="flex gap-3">
                                      {/* Icon */}
                                      <div style={{
                                        flexShrink: 0,
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        background: !notif.isRead ? 'linear-gradient(135deg, #34D399 0%, #10B981 100%)' : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                                        boxShadow: !notif.isRead ? '0 4px 12px rgba(52, 211, 153, 0.25)' : 'none'
                                      }}>
                                        {getNotificationIcon(notif.type)}
                                      </div>

                                      {/* Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                          <p style={{ 
                                            fontWeight: !notif.isRead ? '700' : '600',
                                            fontSize: '0.9rem',
                                            color: '#1e293b',
                                            lineHeight: '1.4'
                                          }}>
                                            {notif.title}
                                          </p>
                                          {!notif.isRead && (
                                            <span style={{
                                              flexShrink: 0,
                                              width: '8px',
                                              height: '8px',
                                              borderRadius: '50%',
                                              background: '#34D399',
                                              boxShadow: '0 0 0 3px rgba(52, 211, 153, 0.2)',
                                              animation: 'pulse 2s infinite'
                                            }}></span>
                                          )}
                                        </div>
                                        <p style={{
                                          fontSize: '0.8rem',
                                          color: '#64748b',
                                          lineHeight: '1.5',
                                          marginBottom: '0.5rem'
                                        }}>
                                          {notif.message}
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <span style={{
                                            fontSize: '0.7rem',
                                            color: '#94a3b8',
                                            fontWeight: '600'
                                          }}>
                                            {getTimeAgo(notif.createdAt)}
                                          </span>
                                          {notif.priority === 'high' && (
                                            <span style={{
                                              fontSize: '0.7rem',
                                              padding: '0.25rem 0.5rem',
                                              borderRadius: '9999px',
                                              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                              color: '#dc2626',
                                              fontWeight: '700'
                                            }}>
                                              ⚡ Important
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                          <div className="p-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Mark all as read functionality
                                setNotificationsOpen(false);
                              }}
                              className="w-full text-center text-sm font-semibold text-green-600 hover:text-green-700 transition py-2"
                            >
                              View All Notifications
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="px-4 py-2 rounded-xl text-gray-700 hover:bg-white/50 hover:text-indigo-600 transition font-medium flex items-center gap-2">
                    <User size={20} />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition font-medium flex items-center gap-2"
                    title="Logout"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" style={{
                  padding: '10px 24px',
                  borderRadius: '12px',
                  color: '#1E293B',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }} onMouseEnter={(e) => e.currentTarget.style.background = '#F0FDF4'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  Login
                </Link>
                <Link to="/register" style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                  color: 'white',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                  display: 'inline-block'
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(251, 191, 36, 0.4)';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';
                }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 rounded-xl text-gray-700 hover:bg-white/50 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col gap-2">
              <Link to="/map" className="px-4 py-3 rounded-xl text-gray-700 hover:bg-white/50 hover:text-indigo-600 transition font-medium">
                Map
              </Link>
              <Link to="/leaderboard" className="px-4 py-3 rounded-xl text-gray-700 hover:bg-white/50 hover:text-indigo-600 transition font-medium">
                Leaderboard
              </Link>
              <button
                onClick={() => {
                  setNutritionModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-white/50 hover:text-amber-600 transition font-medium flex items-center gap-2"
              >
                <Sparkles size={20} />
                Nutrition Tracker
              </button>
              
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} className="px-4 py-3 rounded-xl text-gray-700 hover:bg-white/50 hover:text-indigo-600 transition font-medium">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="px-4 py-3 rounded-xl text-gray-700 hover:bg-white/50 hover:text-indigo-600 transition font-medium">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-3 rounded-xl text-gray-700 hover:bg-white/50 hover:text-indigo-600 transition font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-3 bg-gradient-primary text-white rounded-xl font-semibold shadow-lg text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Nutrition Tracker Modal */}
        {nutritionModalOpen && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1rem',
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => {
              setNutritionModalOpen(false);
              setNutritionInfo(null);
              setFoodItem('');
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '24px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{
                background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'white',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <Sparkles size={24} color="#F59E0B" />
                  </div>
                  <div>
                    <h2 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '800', 
                      color: 'white',
                      margin: 0
                    }}>
                      Nutrition Tracker
                    </h2>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0
                    }}>
                      Powered by Gemini AI
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setNutritionModalOpen(false);
                    setNutritionInfo(null);
                    setFoodItem('');
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  <X size={24} color="white" />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.5rem',
                background: '#F9FAFB'
              }}>
                {/* Welcome Message */}
                {!nutritionInfo && (
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    border: '2px dashed #FDE68A',
                    textAlign: 'center'
                  }}>
                    <Sparkles size={48} color="#F59E0B" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700',
                      color: '#1F2937',
                      marginBottom: '0.5rem'
                    }}>
                      Ask about any food item!
                    </h3>
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      lineHeight: '1.5'
                    }}>
                      Type the name of any food item to get detailed nutrition information,
                      health benefits, and storage tips powered by AI.
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: '1rem',
                      flexWrap: 'wrap',
                      justifyContent: 'center'
                    }}>
                      {['Apple', 'Rice', 'Chicken', 'Broccoli'].map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setFoodItem(item);
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#92400E',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nutrition Info Display */}
                {nutritionInfo && (
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    animation: 'slideUp 0.3s ease-out'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '2px solid #FEF3C7'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Sparkles size={20} color="white" />
                      </div>
                      <div>
                        <h4 style={{ 
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          color: '#1F2937',
                          margin: 0
                        }}>
                          {nutritionInfo.foodItem}
                        </h4>
                        <p style={{ 
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          margin: 0
                        }}>
                          Nutrition Facts (per 100g)
                        </p>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.95rem',
                      lineHeight: '1.9',
                      color: '#1F2937',
                      whiteSpace: 'pre-wrap',
                      background: '#F9FAFB',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                      {nutritionInfo.nutritionInfo}
                    </div>
                    <button
                      onClick={() => {
                        setNutritionInfo(null);
                        setFoodItem('');
                      }}
                      style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Search Another Food
                    </button>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div style={{
                padding: '1.5rem',
                background: 'white',
                borderTop: '1px solid #E5E7EB'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center'
                }}>
                  <input
                    type="text"
                    value={foodItem}
                    onChange={(e) => setFoodItem(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter food item (e.g., Apple, Rice, Chicken)..."
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: loading ? '#F9FAFB' : 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#FBBF24'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                  <button
                    onClick={handleNutritionSearch}
                    disabled={loading || !foodItem.trim()}
                    style={{
                      padding: '1rem',
                      background: loading || !foodItem.trim() 
                        ? '#E5E7EB' 
                        : 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: loading || !foodItem.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '56px',
                      boxShadow: loading || !foodItem.trim() 
                        ? 'none' 
                        : '0 4px 12px rgba(251, 191, 36, 0.3)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading && foodItem.trim()) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(251, 191, 36, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = loading || !foodItem.trim() 
                        ? 'none' 
                        : '0 4px 12px rgba(251, 191, 36, 0.3)';
                    }}
                  >
                    {loading ? (
                      <Loader2 size={24} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Send size={24} color="white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add keyframe animation for modal */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
