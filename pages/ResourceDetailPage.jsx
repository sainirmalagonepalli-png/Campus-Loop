import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  User,
  ArrowLeft,
  Share2,
  Flag,
  Edit,
  Repeat,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import TrustScoreBadge from '../components/TrustScoreBadge';
import RequestModal from '../components/RequestModal';
import ReportModal from '../components/ReportModal';

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const fetchResource = async () => {
    try {
      setLoading(true);
      const data = await api.getResourceById(id);
      setResource(data);
    } catch (err) {
      setError(err.message || 'Error loading resource');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResource();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
        <p>Loading resource details...</p>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ marginBottom: '0.5rem' }}>Listing Not Available</h3>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error || 'This resource could not be found or has been removed.'}</p>
        <Link to="/explorer" className="btn btn-primary">
          Back to Explorer
        </Link>
      </div>
    );
  }

  const isOwner = user && resource.owner && (resource.owner._id === user._id || resource.owner === user._id);
  const isAvailable = resource.status === 'Available';

  const sharingTypeClass =
    resource.sharingType === 'Lend'
      ? 'badge-lend'
      : resource.sharingType === 'Exchange'
      ? 'badge-exchange'
      : 'badge-donate';

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          to="/explorer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#64748b',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'flex-start' }} className="resource-detail-layout">
        {/* Left Column: Image and Details */}
        <div>
          <div
            className="card"
            style={{
              padding: 0,
              overflow: 'hidden',
              marginBottom: '1.5rem',
              borderRadius: '16px',
            }}
          >
            <div style={{ height: '380px', backgroundColor: '#f1f5f9', position: 'relative' }}>
              {resource.image ? (
                <img
                  src={resource.image}
                  alt={resource.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600';
                  }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  No photo uploaded
                </div>
              )}

              {/* Status and Type Badges */}
              <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', gap: '0.5rem' }}>
                <span className={`badge ${sharingTypeClass}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                  {resource.sharingType}
                </span>
                <span
                  className="badge"
                  style={{
                    backgroundColor: isAvailable ? '#ecfdf5' : '#fffbeb',
                    color: isAvailable ? '#065f46' : '#b45309',
                    fontSize: '0.85rem',
                    padding: '0.35rem 0.75rem',
                  }}
                >
                  {resource.status}
                </span>
              </div>
            </div>

            <div style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                  {resource.category}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Listed {new Date(resource.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 style={{ fontSize: '1.85rem', lineHeight: 1.25, marginBottom: '1rem', color: '#0f172a' }}>
                {resource.title}
              </h1>

              {/* Key attributes row */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  marginBottom: '1.5rem',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Condition</p>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{resource.condition}</p>
                </div>
                <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.25rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Sharing Format</p>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{resource.sharingType}</p>
                </div>
                <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.25rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Pickup Location</p>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="#2563eb" /> {resource.pickupLocation}
                  </p>
                </div>
              </div>

              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Item Description</h4>
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.925rem', whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
                {resource.description}
              </p>

              {resource.exchangeNotes && (
                <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                  <h5 style={{ color: '#6d28d9', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    Owner's Exchange Wishlist:
                  </h5>
                  <p style={{ fontSize: '0.85rem', color: '#5b21b6' }}>
                    {resource.exchangeNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Owner Profile & Actions */}
        <div>
          {/* Action Card */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Resource Sharing Action</h3>

            {isOwner ? (
              <div>
                <div className="alert alert-info">
                  <User size={16} />
                  <span>You listed this resource. Manage or edit it below.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link to={`/edit-resource/${resource._id}`} className="btn btn-secondary" style={{ flex: 1 }}>
                    <Edit size={16} /> Edit Listing
                  </Link>
                  <Link to="/my-listings" className="btn btn-outline-primary" style={{ flex: 1 }}>
                    My Listings
                  </Link>
                </div>
              </div>
            ) : !isAvailable ? (
              <div className="alert alert-warning">
                <Clock size={16} />
                <span>
                  This item is currently <strong>{resource.status.toLowerCase()}</strong>. Check back once returned to the owner.
                </span>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Send a borrowing or exchange request to the owner. Coordinate handoff location on campus.
                </p>

                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginBottom: '0.75rem' }}
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  <Repeat size={18} /> Request to {resource.sharingType}
                </button>

                <p style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'center' }}>
                  Protected by the CampusLoop Student Trust Score System.
                </p>
              </div>
            )}
          </div>

          {/* Owner Profile Card */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Resource Owner Details
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {resource.owner?.name?.charAt(0) || <User size={24} />}
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', color: '#0f172a' }}>{resource.owner?.name}</h4>
                <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
                  {resource.owner?.department}
                </p>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  ID: {resource.owner?.studentId}
                </p>
              </div>
            </div>

            {/* Trust Score Breakdown */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Student Trust Score</p>
                <div style={{ marginTop: '0.2rem' }}>
                  <TrustScoreBadge score={resource.owner?.trustScore ?? 50} size="md" />
                </div>
              </div>
              <ShieldCheck size={28} color="#16a34a" />
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
              All students are verified campus members. Contact information is securely shared upon request approval.
            </p>

            {/* Report Button */}
            {!isOwner && (
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  <Flag size={14} /> Report listing if inaccurate or inappropriate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RequestModal
        resource={resource}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={fetchResource}
      />
      <ReportModal
        resource={resource}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default ResourceDetailPage;
