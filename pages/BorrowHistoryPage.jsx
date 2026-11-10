import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Filter, CheckCircle2, Clock, XCircle, ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import TrustScoreBadge from '../components/TrustScoreBadge';

const BorrowHistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all'); // all | borrowed | lent
  const [statusFilter, setStatusFilter] = useState('All'); // All | Approved | Returned | Rejected | Overdue

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (roleFilter !== 'all') query.append('roleFilter', roleFilter);
      if (statusFilter !== 'All') query.append('statusFilter', statusFilter);

      const data = await api.getHistory(`?${query.toString()}`);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [roleFilter, statusFilter]);

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Borrowing & Lending History</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Complete transparent log of your campus resource sharing transactions and outcomes
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Role Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Transaction Type:</span>
            <button
              type="button"
              onClick={() => setRoleFilter('all')}
              className={`btn btn-sm ${roleFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Records
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('borrowed')}
              className={`btn btn-sm ${roleFilter === 'borrowed' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Borrowed by Me
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('lent')}
              className={`btn btn-sm ${roleFilter === 'lent' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Lent by Me
            </button>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Status:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Returned">Completed (Returned)</option>
              <option value="Approved">Currently Active</option>
              <option value="Pending">Pending Approval</option>
              <option value="Rejected">Rejected</option>
              <option value="Overdue">Overdue Items</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table / List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          <p>Retrieving transaction ledger...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
          <History size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>No History Records Found</h3>
          <p style={{ fontSize: '0.875rem' }}>No borrow or lend activity matching the selected filters.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Item & Category</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Role</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Campus Partner</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Dates</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => {
                  const isBorrower = record.borrower?._id === user?._id || record.borrower === user?._id;
                  const partner = isBorrower ? record.owner : record.borrower;

                  return (
                    <tr
                      key={record._id}
                      style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Item */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          <Link to={`/resources/${record.resource?._id}`} style={{ color: 'inherit' }}>
                            {record.resource?.title || 'Unknown Resource'}
                          </Link>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {record.resource?.category} • {record.sharingType}
                        </span>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            color: isBorrower ? '#2563eb' : '#16a34a',
                          }}
                        >
                          {isBorrower ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                          {isBorrower ? 'Borrowed' : 'Lent'}
                        </span>
                      </td>

                      {/* Partner */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 500, color: '#0f172a' }}>{partner?.name || 'Peer'}</div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{partner?.department}</span>
                      </td>

                      {/* Dates */}
                      <td style={{ padding: '1rem 1.25rem', color: '#475569', fontSize: '0.8rem' }}>
                        <div>Requested: {new Date(record.createdAt).toLocaleDateString()}</div>
                        {record.expectedReturnDate && (
                          <div style={{ color: '#64748b' }}>
                            Due: {new Date(record.expectedReturnDate).toLocaleDateString()}
                          </div>
                        )}
                        {record.actualReturnDate && (
                          <div style={{ color: '#16a34a', fontWeight: 500 }}>
                            Returned: {new Date(record.actualReturnDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              record.status === 'Returned'
                                ? '#ecfdf5'
                                : record.status === 'Approved'
                                ? '#eff6ff'
                                : record.status === 'Pending'
                                ? '#fffbeb'
                                : '#fef2f2',
                            color:
                              record.status === 'Returned'
                                ? '#065f46'
                                : record.status === 'Approved'
                                ? '#1e40af'
                                : record.status === 'Pending'
                                ? '#b45309'
                                : '#991b1b',
                          }}
                        >
                          {record.status === 'Returned' ? (
                            <>
                              <CheckCircle2 size={13} /> Returned
                            </>
                          ) : record.status === 'Approved' ? (
                            <>
                              <Clock size={13} /> Active
                            </>
                          ) : (
                            record.status
                          )}
                        </span>
                        {record.isLate && (
                          <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600, marginTop: '0.2rem' }}>
                            Returned Late
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowHistoryPage;
