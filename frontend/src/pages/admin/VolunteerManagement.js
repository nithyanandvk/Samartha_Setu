import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Users, UserPlus, Mail, Phone, MapPin, Calendar, Award, Search, Filter, Download, MoreVertical, Edit, Trash2, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const VolunteerManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVolunteerName, setNewVolunteerName] = useState('');

  // Fake volunteer data
  const [volunteers, setVolunteers] = useState([
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh.k@gmail.com', phone: '+91 98765 43210', location: 'Mumbai, Maharashtra', joinedDate: '2024-01-15', status: 'active', hoursContributed: 45, tasksCompleted: 12, rating: 4.8 },
    { id: 2, name: 'Priya Sharma', email: 'priya.sharma@gmail.com', phone: '+91 98123 45678', location: 'Delhi, NCR', joinedDate: '2024-02-20', status: 'active', hoursContributed: 38, tasksCompleted: 10, rating: 4.9 },
    { id: 3, name: 'Amit Patel', email: 'amit.patel@yahoo.com', phone: '+91 97654 32109', location: 'Ahmedabad, Gujarat', joinedDate: '2024-01-10', status: 'active', hoursContributed: 52, tasksCompleted: 15, rating: 5.0 },
    { id: 4, name: 'Sneha Reddy', email: 'sneha.reddy@gmail.com', phone: '+91 96543 21098', location: 'Hyderabad, Telangana', joinedDate: '2024-03-05', status: 'inactive', hoursContributed: 22, tasksCompleted: 6, rating: 4.5 },
    { id: 5, name: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '+91 95432 10987', location: 'Jaipur, Rajasthan', joinedDate: '2024-02-12', status: 'active', hoursContributed: 41, tasksCompleted: 11, rating: 4.7 },
    { id: 6, name: 'Ananya Iyer', email: 'ananya.iyer@gmail.com', phone: '+91 94321 09876', location: 'Chennai, Tamil Nadu', joinedDate: '2024-01-25', status: 'active', hoursContributed: 35, tasksCompleted: 9, rating: 4.6 },
    { id: 7, name: 'Rahul Verma', email: 'rahul.verma@gmail.com', phone: '+91 93210 98765', location: 'Lucknow, Uttar Pradesh', joinedDate: '2024-03-15', status: 'active', hoursContributed: 28, tasksCompleted: 7, rating: 4.4 },
    { id: 8, name: 'Kavya Nair', email: 'kavya.nair@gmail.com', phone: '+91 92109 87654', location: 'Kochi, Kerala', joinedDate: '2024-02-28', status: 'inactive', hoursContributed: 18, tasksCompleted: 5, rating: 4.3 },
    { id: 9, name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com', phone: '+91 91098 76543', location: 'Pune, Maharashtra', joinedDate: '2024-01-08', status: 'active', hoursContributed: 48, tasksCompleted: 13, rating: 4.9 },
    { id: 10, name: 'Divya Gupta', email: 'divya.gupta@gmail.com', phone: '+91 90987 65432', location: 'Bangalore, Karnataka', joinedDate: '2024-02-18', status: 'active', hoursContributed: 33, tasksCompleted: 8, rating: 4.5 }
  ]);

  const stats = {
    total: volunteers.length,
    active: volunteers.filter(v => v.status === 'active').length,
    inactive: volunteers.filter(v => v.status === 'inactive').length,
    totalHours: volunteers.reduce((sum, v) => sum + v.hoursContributed, 0),
    totalTasks: volunteers.reduce((sum, v) => sum + v.tasksCompleted, 0),
    avgRating: (volunteers.reduce((sum, v) => sum + v.rating, 0) / volunteers.length).toFixed(1)
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         volunteer.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || volunteer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSendEmail = (volunteer) => {
    toast.success(`Email sent to ${volunteer.name}! 📧`);
  };

  const handleCall = (volunteer) => {
    toast.success(`Calling ${volunteer.name}... 📞`);
  };

  const handleEdit = (volunteer) => {
    toast.info(`Edit ${volunteer.name}'s profile`);
  };

  const handleDelete = (volunteer) => {
    toast.error(`Delete ${volunteer.name}? This action cannot be undone.`);
  };

  const handleAddVolunteer = () => {
    if (!newVolunteerName.trim()) {
      toast.error('Please enter volunteer name');
      return;
    }

    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Lucknow'];
    const states = ['Maharashtra', 'NCR', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'Gujarat', 'West Bengal', 'Rajasthan', 'Uttar Pradesh'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomState = states[Math.floor(Math.random() * states.length)];
    
    const newVolunteer = {
      id: volunteers.length + 1,
      name: newVolunteerName,
      email: `${newVolunteerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      phone: `+91 ${Math.floor(90000 + Math.random() * 10000)} ${Math.floor(10000 + Math.random() * 90000)}`,
      location: `${randomCity}, ${randomState}`,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      hoursContributed: Math.floor(Math.random() * 50) + 10,
      tasksCompleted: Math.floor(Math.random() * 15) + 5,
      rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1)
    };

    setVolunteers([...volunteers, newVolunteer]);
    setNewVolunteerName('');
    setShowAddModal(false);
    toast.success(`${newVolunteerName} added successfully! ✅`);
  };

  const exportToExcel = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Joined Date', 'Status', 'Hours', 'Tasks', 'Rating'];
    const csvContent = [
      headers.join(','),
      ...volunteers.map(v => [
        v.name,
        v.email,
        v.phone,
        v.location,
        v.joinedDate,
        v.status,
        v.hoursContributed,
        v.tasksCompleted,
        v.rating
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `volunteers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Volunteer data exported! 📊');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            🤝 Volunteer Management
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748b' }}>Manage and coordinate volunteer activities</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid mb-8">
          {[
            { label: 'Total Volunteers', value: stats.total, icon: '👥', color: '#667eea' },
            { label: 'Active Volunteers', value: stats.active, icon: '✅', color: '#10b981' },
            { label: 'Total Hours', value: stats.totalHours, icon: '⏰', color: '#f59e0b' },
            { label: 'Tasks Completed', value: stats.totalTasks, icon: '🎯', color: '#8b5cf6' },
            { label: 'Inactive', value: stats.inactive, icon: '⏸️', color: '#ef4444' },
            { label: 'Avg Rating', value: `${stats.avgRating} ⭐`, icon: '⭐', color: '#f59e0b' }
          ].map((stat, index) => (
            <div key={index} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderLeft: `4px solid ${stat.color}` }}>
              <div className="flex items-center gap-3">
                <div style={{ width: '48px', height: '48px', background: `${stat.color}20`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  {stat.icon}
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>{stat.label}</p>
                  <p style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions Bar */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div style={{ flex: 1, position: 'relative', maxWidth: '400px' }}>
              <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search volunteers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: '0.875rem 1rem', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', outline: 'none' }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                onClick={exportToExcel}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' }}
              >
                <Download size={18} />
                Export Excel
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' }}
              >
                <UserPlus size={18} />
                Add Volunteer
              </button>
            </div>
          </div>
        </div>

        {/* Volunteers Table */}
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '700', color: '#374151' }}>Volunteer</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '700', color: '#374151' }}>Contact</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '700', color: '#374151' }}>Location</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '700', color: '#374151' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '700', color: '#374151' }}>Hours</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '700', color: '#374151' }}>Tasks</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '700', color: '#374151' }}>Rating</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '700', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.map((volunteer) => (
                  <tr key={volunteer.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem', fontWeight: '700' }}>
                          {volunteer.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}>{volunteer.name}</p>
                          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Joined {new Date(volunteer.joinedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div className="flex items-center gap-2">
                          <Mail size={14} style={{ color: '#64748b' }} />
                          <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>{volunteer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} style={{ color: '#64748b' }} />
                          <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>{volunteer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} style={{ color: '#64748b' }} />
                        <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>{volunteer.location}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: volunteer.status === 'active' ? '#d1fae5' : '#fee2e2',
                        color: volunteer.status === 'active' ? '#065f46' : '#991b1b'
                      }}>
                        {volunteer.status === 'active' ? '✅ Active' : '⏸️ Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>{volunteer.hoursContributed}h</span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>{volunteer.tasksCompleted}</span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div className="flex items-center justify-center gap-1">
                        <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f59e0b' }}>{volunteer.rating}</span>
                        <span>⭐</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleSendEmail(volunteer)}
                          style={{ padding: '0.5rem', background: '#eff6ff', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#dbeafe'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#eff6ff'}
                          title="Send Email"
                        >
                          <Mail size={16} style={{ color: '#3b82f6' }} />
                        </button>
                        <button
                          onClick={() => handleCall(volunteer)}
                          style={{ padding: '0.5rem', background: '#f0fdf4', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#dcfce7'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#f0fdf4'}
                          title="Call"
                        >
                          <Phone size={16} style={{ color: '#10b981' }} />
                        </button>
                        <button
                          onClick={() => handleEdit(volunteer)}
                          style={{ padding: '0.5rem', background: '#fef3c7', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fde68a'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#fef3c7'}
                          title="Edit"
                        >
                          <Edit size={16} style={{ color: '#f59e0b' }} />
                        </button>
                        <button
                          onClick={() => handleDelete(volunteer)}
                          style={{ padding: '0.5rem', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                          title="Delete"
                        >
                          <Trash2 size={16} style={{ color: '#ef4444' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVolunteers.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.125rem', color: '#64748b' }}>No volunteers found</p>
            </div>
          )}
        </div>

        {/* Add Volunteer Modal */}
        {showAddModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
            onClick={() => setShowAddModal(false)}
          >
            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', maxWidth: '500px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>➕ Add New Volunteer</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={20} style={{ color: '#64748b' }} />
                </button>
              </div>

              <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.5rem' }}>Enter volunteer's full name. Other details will be auto-generated.</p>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Volunteer Name *</label>
                <input
                  type="text"
                  value={newVolunteerName}
                  onChange={(e) => setNewVolunteerName(e.target.value)}
                  placeholder="e.g., Rahul Kumar"
                  style={{ width: '100%', padding: '0.875rem', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddVolunteer()}
                />
              </div>

              <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #bbf7d0' }}>
                <p style={{ fontSize: '0.875rem', color: '#166534', lineHeight: '1.6' }}>
                  <strong>ℹ️ Auto-generated:</strong> Email, phone, location, join date, hours, tasks, and rating will be automatically created with realistic fake data.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '0.875rem', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVolunteer}
                  style={{ flex: 1, padding: '0.875rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}
                >
                  ➕ Add Volunteer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerManagement;
