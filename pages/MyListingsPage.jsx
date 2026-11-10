import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, PlusCircle, Edit, Trash2, Eye, User, Calendar, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

const MyListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const data = await api.getMyListings();
      setListings(data);
    } catch (err) {
      setError(err.message || 'Error loading your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.deleteResource(id);
      setDeleteConfirmId(null);
      fetchMyListings();
    } catch (err) {
      alert(err.message || 'Failed to delete listing');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>My Shared Resources</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage the academic items and tools you have shared with campus peers
          </p>
        </div>
        <Link to="/add-resource" className="btn btn-primary">
          <PlusCircle size={16} /> Share New Item
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          <p>Loading your listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <Package size={48} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Items Shared Yet</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Help your fellow students by listing old textbooks, lab coats, tools, or calculators you don't use every day.
          </p>
          <Link to="/add-resource" className="btn btn-primary">
            <PlusCircle size={16} /> Share Your First Item
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {listings.map((item) => {
            const isBorrowed = item.status === 'Borrowed';
            return (
              <div
                key={item._id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                }}
              >
                {/* Left Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '280px' }}>
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'}
                    alt={item.title}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', backgroundColor: '#f1f5f9' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200';
                    }}
                  />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="badge badge-lend">{item.sharingType}</span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: item.status === 'Available' ? '#ecfdf5' : '#fffbeb',
                          color: item.status === 'Available' ? '#065f46' : '#b45309',
                        }}
                      >
                        {item.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.category}</span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: '#0f172a' }}>
                      <Link to={`/resources/${item._id}`} style={{ color: 'inherit' }}>
                        {item.title}
                      </Link>
                    </h4>

                    {/* Borrower info if currently borrowed */}
                    {isBorrowed && item.currentBorrower && (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: '#fffbeb',
                          border: '1px solid #fde68a',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          color: '#92400e',
                          marginTop: '0.3rem',
                        }}
                      >
                        <User size={13} /> Borrowed by {item.currentBorrower.name} ({item.currentBorrower.department})
                        {item.expectedReturnDate && (
                          <span>• Due {new Date(item.expectedReturnDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Link to={`/resources/${item._id}`} className="btn btn-sm btn-secondary" title="View details">
                    <Eye size={15} /> Preview
                  </Link>

                  <Link to={`/edit-resource/${item._id}`} className="btn btn-sm btn-secondary" title="Edit listing">
                    <Edit size={15} /> Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(item._id)}
                    className="btn btn-sm btn-secondary"
                    style={{ color: '#ef4444' }}
                    title="Remove listing"
                    disabled={isBorrowed}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Delete confirmation modal / warning inline */}
                {deleteConfirmId === item._id && (
                  <div
                    style={{
                      width: '100%',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '0.5rem',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: 500 }}>
                      Are you sure you want to permanently delete "{item.title}"?
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="btn btn-sm btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;
