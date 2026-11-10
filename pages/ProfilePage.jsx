import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle,
  AlertTriangle,
  User,
  Phone,
  Mail,
  IdCard,
  GraduationCap,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import TrustScoreBadge from '../components/TrustScoreBadge';

const ProfilePage = () => {
  const { user, updateUser, refreshProfile } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    year: user?.year || '',
    phone: user?.phone || '',
    password: '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await api.updateProfile(formData);
      updateUser(updated);
      setEditMode(false);
      setMessage({ type: 'success', text: 'Student profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Error updating profile' });
    } finally {
      setSaving(false);
    }
  };

  const score = user?.trustScore ?? 50;

  let trustTier = 'High Trust Student';
  let tierColor = '#16a34a';
  let tierDesc = 'Consistent on-time returns and trustworthy peer sharing.';
  if (score < 40) {
    trustTier = 'Needs Improvement';
    tierColor = '#dc2626';
    tierDesc = 'Multiple late returns or reported infractions. Return items on time to restore points.';
  } else if (score < 70) {
    trustTier = 'Good Standing';
    tierColor = '#d97706';
    tierDesc = 'Active student borrower. Keep returning on time to reach High Trust!';
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Student Profile & Trust Standing</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Your verified campus credentials and rule-based peer trust score
        </p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          <span>{message.text}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '2rem', alignItems: 'flex-start' }} className="grid-2">
        {/* Left Column: Profile Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0) || <User size={28} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>{user?.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{user?.department}</p>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
                <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                  {user?.role === 'admin' ? 'Campus Admin' : 'Verified Student'}
                </span>
                <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                  {user?.year}
                </span>
              </div>
            </div>
          </div>

          {!editMode ? (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem' }}>
                  <Mail size={16} color="#64748b" />
                  <span style={{ color: '#64748b' }}>College Email:</span>
                  <strong style={{ color: '#0f172a' }}>{user?.email}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem' }}>
                  <IdCard size={16} color="#64748b" />
                  <span style={{ color: '#64748b' }}>Student ID:</span>
                  <strong style={{ color: '#0f172a' }}>{user?.studentId}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem' }}>
                  <Phone size={16} color="#64748b" />
                  <span style={{ color: '#64748b' }}>Contact Phone:</span>
                  <strong style={{ color: '#0f172a' }}>{user?.phone || 'Not provided'}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem' }}>
                  <Calendar size={16} color="#64748b" />
                  <span style={{ color: '#64748b' }}>Member Since:</span>
                  <strong style={{ color: '#0f172a' }}>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                Edit Profile Details
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <select
                  name="year"
                  className="form-select"
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate / Post-Grad">Graduate / Post-Grad</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Trust Score Dashboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Trust Meter Widget */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                  Peer Reputation
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Student Trust Score</h3>
              </div>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: tierColor,
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.2rem',
                }}
              >
                {score}
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>/ 100</span>
              </div>
            </div>

            {/* Progress Bar Meter */}
            <div style={{ height: '12px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
              <div
                style={{
                  height: '100%',
                  width: `${score}%`,
                  backgroundColor: tierColor,
                  borderRadius: '999px',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              <span>0 (Suspended/Risk)</span>
              <span>50 (Onboarding baseline)</span>
              <span>100 (Exemplary Student)</span>
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <ShieldCheck size={24} color={tierColor} style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: tierColor }}>{trustTier}</p>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{tierDesc}</p>
              </div>
            </div>
          </div>

          {/* Trust Score Rules Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Trust Score Evaluation Rules
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#475569' }}>Initial registration baseline:</span>
                <strong style={{ color: '#2563eb' }}>50 points</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#475569' }}>Returning borrowed item on or before deadline:</span>
                <strong style={{ color: '#16a34a' }}>+5 points</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#475569' }}>Returning an item past expected return date:</span>
                <strong style={{ color: '#dc2626' }}>-5 points</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#475569' }}>Completed exchange or donation handoff:</span>
                <strong style={{ color: '#16a34a' }}>+3 points</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0' }}>
                <span style={{ color: '#475569' }}>Confirmed misuse, fake listing, or policy violation:</span>
                <strong style={{ color: '#dc2626' }}>-10 points</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Score Activity Ledger */}
      <div className="card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
          Trust Score Activity Log
        </h3>

        {!user?.trustScoreHistory || user.trustScoreHistory.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No score adjustments logged yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {user.trustScoreHistory.slice().reverse().map((entry, idx) => {
              const isPositive = entry.change > 0;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                      {entry.reason}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {entry.relatedTitle && `${entry.relatedTitle} • `}
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: isPositive ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {isPositive ? `+${entry.change}` : entry.change} pts
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
