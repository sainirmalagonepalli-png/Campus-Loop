import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, ArrowRight, Flag } from 'lucide-react';
import TrustScoreBadge from './TrustScoreBadge';

const ResourceCard = ({ resource, onRequest, onReport }) => {
  const isAvailable = resource.status === 'Available';

  const sharingTypeClass =
    resource.sharingType === 'Lend'
      ? 'badge-lend'
      : resource.sharingType === 'Exchange'
      ? 'badge-exchange'
      : 'badge-donate';

  return (
    <div
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* Image Header */}
      <div
        style={{
          position: 'relative',
          height: '190px',
          backgroundColor: '#f1f5f9',
          overflow: 'hidden',
        }}
      >
        {resource.image ? (
          <img
            src={resource.image}
            alt={resource.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600';
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e2e8f0',
              color: '#64748b',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {resource.category}
          </div>
        )}

        {/* Badges on Image */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
          }}
        >
          <span className={`badge ${sharingTypeClass}`}>
            {resource.sharingType}
          </span>
          <span
            className="badge"
            style={{
              backgroundColor: isAvailable ? '#ecfdf5' : '#fffbeb',
              color: isAvailable ? '#065f46' : '#b45309',
            }}
          >
            {resource.status}
          </span>
        </div>

        {/* Report Button */}
        {onReport && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReport(resource);
            }}
            title="Report this listing"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(2px)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            <Flag size={14} />
          </button>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
            {resource.category}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
            {resource.condition}
          </span>
        </div>

        <h4
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.35,
            marginBottom: '0.45rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          <Link to={`/resources/${resource._id}`} style={{ color: 'inherit' }}>
            {resource.title}
          </Link>
        </h4>

        <p
          style={{
            fontSize: '0.825rem',
            color: '#64748b',
            lineHeight: 1.5,
            marginBottom: '0.85rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {resource.description}
        </p>

        {/* Pickup location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.8rem',
            color: '#475569',
            marginBottom: '1rem',
          }}
        >
          <MapPin size={14} color="#64748b" style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {resource.pickupLocation}
          </span>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', marginTop: 'auto' }}>
          {/* Owner details */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {resource.owner?.name?.charAt(0) || <User size={14} />}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {resource.owner?.name}
                </p>
                <p style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {resource.owner?.department}
                </p>
              </div>
            </div>

            <TrustScoreBadge score={resource.owner?.trustScore ?? 50} size="xs" showLabel={false} />
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to={`/resources/${resource._id}`}
              className="btn btn-sm btn-secondary"
              style={{ flex: 1 }}
            >
              Details
            </Link>
            {isAvailable && (
              <button
                type="button"
                onClick={() => onRequest ? onRequest(resource) : null}
                className="btn btn-sm btn-primary"
                style={{ flex: 1.4 }}
              >
                Request <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
