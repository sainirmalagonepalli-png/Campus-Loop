import React, { useState } from 'react';
import { X, Calendar, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RequestModal = ({ resource, isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !resource) return null;

  // Calculate default min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const isOwner = user && resource.owner && (resource.owner._id === user._id || resource.owner === user._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('Please log in with your college account to send borrowing requests.');
      return;
    }

    if (isOwner) {
      setError('You cannot request your own resource.');
      return;
    }

    if (resource.sharingType === 'Lend' && !expectedReturnDate) {
      setError('Please specify your expected return date.');
      return;
    }

    try {
      setLoading(true);
      await api.createRequest({
        resourceId: resource._id,
        expectedReturnDate: resource.sharingType === 'Lend' ? expectedReturnDate : null,
        message,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              Request to {resource.sharingType}
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
              Resource: <strong style={{ color: '#0f172a' }}>{resource.title}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.4rem',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              color: '#64748b',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <span>Request sent successfully! Item owner will be notified.</span>
          </div>
        )}

        {!isAuthenticated ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <p style={{ color: '#475569', marginBottom: '1rem', fontSize: '0.9rem' }}>
              You need to sign in with your college credentials to borrow resources.
            </p>
            <Link to="/login" className="btn btn-primary">
              Log In to Continue
            </Link>
          </div>
        ) : isOwner ? (
          <div className="alert alert-warning">
            <AlertCircle size={18} />
            <span>This is your own listing. You cannot borrow your own item.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Item Summary Card */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
              }}
            >
              {resource.image && (
                <img
                  src={resource.image}
                  alt={resource.title}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                />
              )}
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  Owner: {resource.owner?.name} ({resource.owner?.department})
                </p>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Pickup Location: {resource.pickupLocation}
                </p>
              </div>
            </div>

            {/* Expected Return Date (for Lend) */}
            {resource.sharingType === 'Lend' && (
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} color="#2563eb" /> Expected Return Date *
                </label>
                <input
                  type="date"
                  className="form-input"
                  min={minDate}
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  required
                />
                <p className="form-helper">
                  Prompt returns on or before this date reward you with +5 Trust Points.
                </p>
              </div>
            )}

            {/* Message / Purpose */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MessageSquare size={16} color="#2563eb" /> Message for {resource.owner?.name?.split(' ')[0]} (Optional)
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Mention why you need the item, your preferred pickup time on campus, or what you offer for exchange..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || success}
              >
                {loading ? 'Sending Request...' : 'Send Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestModal;
