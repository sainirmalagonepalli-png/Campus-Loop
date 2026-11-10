import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Package,
  Repeat,
  Clock,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  PlusCircle,
  Search,
  ArrowRight,
  TrendingUp,
  Bell,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import TrustScoreBadge from '../components/TrustScoreBadge';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '16px',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            <ShieldCheck size={14} /> Student Dashboard
          </div>
          <h1 style={{ color: 'white', fontSize: '1.85rem', marginBottom: '0.35rem' }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{ opacity: 0.85, fontSize: '0.925rem' }}>
            {user?.department} • {user?.studentId}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Trust Score Box */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              padding: '0.85rem 1.25rem',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
              Trust Score
            </p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>
              {user?.trustScore ?? 50}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.75 }}> / 100</span>
            </p>
            <Link
              to="/profile"
              style={{
                fontSize: '0.75rem',
                color: '#bfdbfe',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                marginTop: '0.2rem',
              }}
            >
              Score history <ArrowRight size={12} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/add-resource" className="btn btn-sm btn-secondary" style={{ backgroundColor: 'white', color: '#1e40af' }}>
              <PlusCircle size={15} /> Share Resource
            </Link>
            <Link to="/explorer" className="btn btn-sm btn-outline-primary" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
              <Search size={15} /> Find Resources
            </Link>
          </div>
        </div>
      </div>

      {/* 7 Required Metrics Grid */}
      <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', fontWeight: 700 }}>
        Resource Activity & Status
      </h3>

      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {/* Metric 1: Total Available Resources */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={20} />
            </div>
            <span className="badge badge-available">Active</span>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Total Available Resources</p>
          <h3 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.15rem' }}>
            {stats?.totalAvailableResources ?? 0}
          </h3>
          <Link to="/explorer" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.5rem' }}>
            Browse campus items <ArrowRight size={12} />
          </Link>
        </div>

        {/* Metric 2: My Listed Items */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} />
            </div>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#64748b' }}>My Listed Items</p>
          <h3 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.15rem' }}>
            {stats?.myListedItems ?? 0}
          </h3>
          <Link to="/my-listings" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.5rem' }}>
            Manage listings <ArrowRight size={12} />
          </Link>
        </div>

        {/* Metric 3: My Borrowing Requests */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Repeat size={20} />
            </div>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#64748b' }}>My Borrowing Requests</p>
          <h3 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.15rem' }}>
            {stats?.myBorrowingRequests ?? 0}
          </h3>
          <Link to="/requests?tab=my-requests" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.5rem' }}>
            View outgoing requests <ArrowRight size={12} />
          </Link>
        </div>

        {/* Metric 4: Pending Requests (Incoming) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
            {stats?.pendingIncomingRequests > 0 && (
              <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>Action Needed</span>
            )}
          </div>
          <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Pending Incoming Requests</p>
          <h3 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.15rem' }}>
            {stats?.pendingIncomingRequests ?? 0}
          </h3>
          <Link to="/requests?tab=incoming" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.5rem' }}>
            Review & respond <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        {/* Metric 5: Currently Borrowed Items */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Repeat size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Currently Borrowed By Me</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats?.currentlyBorrowedItems ?? 0}</h4>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0.5rem 0' }}>
            Items in your possession. Remember to return on time for +5 Trust Points.
          </p>
          <Link to="/requests?tab=tracking" className="btn btn-sm btn-outline-primary" style={{ width: '100%', marginTop: '0.25rem' }}>
            Track Return Dates
          </Link>
        </div>

        {/* Metric 6: Items Waiting to be Returned */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Items Lent (Awaiting Return)</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats?.itemsWaitingToBeReturned ?? 0}</h4>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0.5rem 0' }}>
            Items lent to classmates. Confirm when received to award trust points.
          </p>
          <Link to="/requests?tab=tracking" className="btn btn-sm btn-outline-primary" style={{ width: '100%', marginTop: '0.25rem' }}>
            Confirm Item Returns
          </Link>
        </div>

        {/* Metric 7: Student Trust Score Widget */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Current Trust Standing</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                {user?.trustScore ?? 50} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>/ 100</span>
              </h4>
            </div>
          </div>
          {/* Progress Bar */}
          <div style={{ height: '8px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', margin: '0.75rem 0' }}>
            <div
              style={{
                height: '100%',
                width: `${user?.trustScore ?? 50}%`,
                backgroundColor: (user?.trustScore ?? 50) >= 70 ? '#10b981' : (user?.trustScore ?? 50) >= 40 ? '#f59e0b' : '#ef4444',
                borderRadius: '999px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <Link to="/profile" className="btn btn-sm btn-secondary" style={{ width: '100%' }}>
            View Full Score Ledger
          </Link>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent CampusLoop Activity</h3>
          <Link to="/history" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb' }}>
            Full History
          </Link>
        </div>

        {loading ? (
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading activity logs...</p>
        ) : !stats?.recentActivity || stats.recentActivity.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
            <Repeat size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
            <p style={{ fontSize: '0.9rem' }}>No recent borrow activity yet.</p>
            <Link to="/explorer" className="btn btn-sm btn-primary" style={{ marginTop: '0.75rem' }}>
              Explore Resources to Borrow
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.recentActivity.map((item) => {
              const isBorrower = item.borrower?._id === user?._id || item.borrower === user?._id;
              return (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Repeat size={18} />
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                        {item.resource?.title || 'Resource'}
                      </h5>
                      <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {isBorrower ? `Requested from ${item.owner?.name}` : `Requested by ${item.borrower?.name}`}
                        {item.expectedReturnDate && ` • Return by: ${new Date(item.expectedReturnDate).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          item.status === 'Approved'
                            ? '#ecfdf5'
                            : item.status === 'Pending'
                            ? '#fffbeb'
                            : item.status === 'Returned'
                            ? '#eff6ff'
                            : '#fef2f2',
                        color:
                          item.status === 'Approved'
                            ? '#065f46'
                            : item.status === 'Pending'
                            ? '#b45309'
                            : item.status === 'Returned'
                            ? '#1e40af'
                            : '#991b1b',
                      }}
                    >
                      {item.status}
                    </span>
                    <Link to="/requests" className="btn btn-sm btn-secondary" style={{ padding: '0.35rem 0.65rem' }}>
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
