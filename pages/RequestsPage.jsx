import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Repeat,
  Inbox,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../api/client';
import TrustScoreBadge from '../components/TrustScoreBadge';

const RequestsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'tracking';

  const [trackingData, setTrackingData] = useState({ borrowedByMe: [], lentByMe: [] });
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Response modal / note state
  const [respondingRequestId, setRespondingRequestId] = useState(null);
  const [responseAction, setResponseAction] = useState('approve'); // approve | reject
  const [responseNote, setResponseNote] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);

  const [confirmingReturnId, setConfirmingReturnId] = useState(null);
  const [confirmReturnLoading, setConfirmReturnLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [track, incoming, outgoing] = await Promise.all([
        api.getTracking(),
        api.getIncomingRequests(),
        api.getOutgoingRequests(),
      ]);
      setTrackingData(track);
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (err) {
      console.error('Error fetching request data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!respondingRequestId) return;
    try {
      setSubmittingResponse(true);
      await api.respondToRequest(respondingRequestId, {
        action: responseAction,
        responseNote,
      });

      setRespondingRequestId(null);
      setResponseNote('');
      setFeedbackMessage({
        type: 'success',
        text: `Request successfully ${responseAction === 'approve' ? 'approved' : 'rejected'}.`,
      });
      loadAllData();
    } catch (err) {
      alert(err.message || 'Error processing request response');
    } finally {
      setSubmittingResponse(false);
    }
  };

  const handleConfirmReturn = async (requestId) => {
    try {
      setConfirmReturnLoading(true);
      const res = await api.confirmReturn(requestId);
      setConfirmingReturnId(null);
      setFeedbackMessage({
        type: 'success',
        text: `Return confirmed! ${res.isLate ? 'Return was recorded late (-5 pts).' : 'Returned on time (+5 Trust Points awarded)!'}`
      });
      loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to confirm return');
    } finally {
      setConfirmReturnLoading(false);
    }
  };

  // Helper to calculate remaining days & overdue status
  const calculateDaysRemaining = (expectedDate) => {
    if (!expectedDate) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(expectedDate);
    target.setHours(0, 0, 0, 0);

    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { isOverdue: true, days: Math.abs(diffDays), text: `${Math.abs(diffDays)} days overdue!` };
    } else if (diffDays === 0) {
      return { isOverdue: false, isDueToday: true, days: 0, text: 'Due today!' };
    } else {
      return { isOverdue: false, days: diffDays, text: `${diffDays} days remaining` };
    }
  };

  const pendingIncomingCount = incomingRequests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Requests & Return Tracking</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Manage incoming borrow requests, track active lending deadlines, and confirm safe returns
        </p>
      </div>

      {feedbackMessage && (
        <div className={`alert alert-${feedbackMessage.type}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{feedbackMessage.text}</span>
          <button onClick={() => setFeedbackMessage(null)} style={{ fontSize: '0.8rem', fontWeight: 600 }}>✕</button>
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'tracking' })}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.925rem',
            color: currentTab === 'tracking' ? '#2563eb' : '#64748b',
            borderBottom: currentTab === 'tracking' ? '3px solid #2563eb' : '3px solid transparent',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            whiteSpace: 'nowrap',
          }}
        >
          <Clock size={16} /> Return Tracking ({trackingData.borrowedByMe.length + trackingData.lentByMe.length})
        </button>

        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'incoming' })}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.925rem',
            color: currentTab === 'incoming' ? '#2563eb' : '#64748b',
            borderBottom: currentTab === 'incoming' ? '3px solid #2563eb' : '3px solid transparent',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            whiteSpace: 'nowrap',
          }}
        >
          <Inbox size={16} /> Incoming Requests
          {pendingIncomingCount > 0 && (
            <span style={{ background: '#ef4444', color: 'white', fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '999px' }}>
              {pendingIncomingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'my-requests' })}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.925rem',
            color: currentTab === 'my-requests' ? '#2563eb' : '#64748b',
            borderBottom: currentTab === 'my-requests' ? '3px solid #2563eb' : '3px solid transparent',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            whiteSpace: 'nowrap',
          }}
        >
          <Send size={16} /> My Outgoing Requests ({outgoingRequests.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          <p>Loading tracking information...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: RETURN TRACKING */}
          {currentTab === 'tracking' && (
            <div>
              {/* Section 1: Items Currently Borrowed By Me */}
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Repeat size={16} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    Items I Have Borrowed ({trackingData.borrowedByMe.length})
                  </h3>
                </div>

                {trackingData.borrowedByMe.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                    <p style={{ fontSize: '0.9rem' }}>You do not currently have any active borrowed items.</p>
                    <Link to="/explorer" className="btn btn-sm btn-outline-primary" style={{ marginTop: '0.75rem' }}>
                      Browse Available Resources
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {trackingData.borrowedByMe.map((item) => {
                      const returnStatus = calculateDaysRemaining(item.expectedReturnDate);
                      return (
                        <div
                          key={item._id}
                          className="card"
                          style={{
                            borderLeft: returnStatus?.isOverdue ? '4px solid #ef4444' : returnStatus?.isDueToday ? '4px solid #f59e0b' : '4px solid #10b981',
                            padding: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '1rem',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <img
                              src={item.resource?.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150'}
                              alt=""
                              style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <div>
                              <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                                {item.resource?.title}
                              </h4>
                              <p style={{ fontSize: '0.825rem', color: '#475569' }}>
                                Lent by: <strong>{item.owner?.name}</strong> ({item.owner?.department})
                              </p>
                              <p style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <MapPin size={13} /> {item.owner?.pickupLocation || item.resource?.pickupLocation}
                              </p>
                            </div>
                          </div>

                          {/* Countdown badge & details */}
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ marginBottom: '0.35rem' }}>
                              {returnStatus?.isOverdue ? (
                                <span className="badge badge-overdue" style={{ fontSize: '0.85rem' }}>
                                  <AlertTriangle size={14} /> {returnStatus.text}
                                </span>
                              ) : returnStatus?.isDueToday ? (
                                <span className="badge badge-borrowed" style={{ fontSize: '0.85rem' }}>
                                  <Clock size={14} /> {returnStatus.text}
                                </span>
                              ) : (
                                <span className="badge badge-available" style={{ fontSize: '0.85rem' }}>
                                  <Clock size={14} /> {returnStatus?.text}
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                              Expected return: {item.expectedReturnDate ? new Date(item.expectedReturnDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section 2: Items Lent to Others (Waiting for Return) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={16} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    Items I Lent to Others ({trackingData.lentByMe.length})
                  </h3>
                </div>

                {trackingData.lentByMe.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                    <p style={{ fontSize: '0.9rem' }}>None of your items are currently borrowed by other students.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {trackingData.lentByMe.map((item) => {
                      const returnStatus = calculateDaysRemaining(item.expectedReturnDate);
                      return (
                        <div
                          key={item._id}
                          className="card"
                          style={{
                            padding: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '1rem',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <img
                              src={item.resource?.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150'}
                              alt=""
                              style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <div>
                              <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                                {item.resource?.title}
                              </h4>
                              <p style={{ fontSize: '0.825rem', color: '#475569' }}>
                                Borrowed by: <strong>{item.borrower?.name}</strong> ({item.borrower?.department})
                              </p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                                <TrustScoreBadge score={item.borrower?.trustScore ?? 50} size="xs" />
                                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                  Phone: {item.borrower?.phone || 'On campus'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status and Action */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ textAlign: 'right' }}>
                              {returnStatus?.isOverdue ? (
                                <span className="badge badge-overdue" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                  <AlertTriangle size={14} /> {returnStatus.text}
                                </span>
                              ) : (
                                <span className="badge badge-available" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                  <Clock size={14} /> {returnStatus?.text}
                                </span>
                              )}
                              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                Due: {item.expectedReturnDate ? new Date(item.expectedReturnDate).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>

                            {/* Confirm Return Button */}
                            <button
                              type="button"
                              onClick={() => setConfirmingReturnId(item._id)}
                              className="btn btn-sm btn-success"
                              title="Confirm when you have received the item back"
                            >
                              <CheckCircle size={15} /> Confirm Return
                            </button>
                          </div>

                          {/* Confirm return prompt */}
                          {confirmingReturnId === item._id && (
                            <div
                              style={{
                                width: '100%',
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: '8px',
                                padding: '0.85rem 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: '0.5rem',
                              }}
                            >
                              <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
                                Have you safely received "{item.resource?.title}" back from {item.borrower?.name}?
                              </span>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  type="button"
                                  onClick={() => setConfirmingReturnId(null)}
                                  className="btn btn-sm btn-secondary"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleConfirmReturn(item._id)}
                                  className="btn btn-sm btn-success"
                                  disabled={confirmReturnLoading}
                                >
                                  {confirmReturnLoading ? 'Confirming...' : 'Yes, Confirm Return'}
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
            </div>
          )}

          {/* TAB 2: INCOMING REQUESTS */}
          {currentTab === 'incoming' && (
            <div>
              {incomingRequests.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
                  <Inbox size={40} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
                  <p style={{ fontSize: '0.95rem' }}>No incoming requests for your resources yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {incomingRequests.map((req) => (
                    <div
                      key={req._id}
                      className="card"
                      style={{
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        backgroundColor: req.status === 'Pending' ? '#ffffff' : '#f8fafc',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                req.status === 'Pending'
                                  ? '#fffbeb'
                                  : req.status === 'Approved'
                                  ? '#ecfdf5'
                                  : '#fef2f2',
                              color:
                                req.status === 'Pending'
                                  ? '#b45309'
                                  : req.status === 'Approved'
                                  ? '#065f46'
                                  : '#991b1b',
                            }}
                          >
                            {req.status}
                          </span>
                          <span className="badge badge-lend">{req.sharingType}</span>
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            Received {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                          {req.resource?.title}
                        </h4>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                            Requested by: <strong>{req.borrower?.name}</strong> ({req.borrower?.department})
                          </span>
                          <TrustScoreBadge score={req.borrower?.trustScore ?? 50} size="xs" />
                        </div>

                        {req.expectedReturnDate && (
                          <p style={{ fontSize: '0.825rem', color: '#2563eb', fontWeight: 600, marginBottom: '0.4rem' }}>
                            Expected Return: {new Date(req.expectedReturnDate).toLocaleDateString()}
                          </p>
                        )}

                        {req.message && (
                          <div style={{ background: '#f1f5f9', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.825rem', color: '#334155', marginTop: '0.5rem' }}>
                            <strong>Note:</strong> "{req.message}"
                          </div>
                        )}
                      </div>

                      {/* Action buttons if Pending */}
                      {req.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setRespondingRequestId(req._id);
                              setResponseAction('approve');
                            }}
                            className="btn btn-sm btn-primary"
                          >
                            <Check size={15} /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRespondingRequestId(req._id);
                              setResponseAction('reject');
                            }}
                            className="btn btn-sm btn-secondary"
                            style={{ color: '#ef4444' }}
                          >
                            <X size={15} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY OUTGOING REQUESTS */}
          {currentTab === 'my-requests' && (
            <div>
              {outgoingRequests.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
                  <Send size={40} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
                  <p style={{ fontSize: '0.95rem' }}>You haven't requested any resources yet.</p>
                  <Link to="/explorer" className="btn btn-sm btn-primary" style={{ marginTop: '0.75rem' }}>
                    Browse Available Resources
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {outgoingRequests.map((req) => (
                    <div
                      key={req._id}
                      className="card"
                      style={{
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                req.status === 'Pending'
                                  ? '#fffbeb'
                                  : req.status === 'Approved'
                                  ? '#ecfdf5'
                                  : req.status === 'Returned'
                                  ? '#eff6ff'
                                  : '#fef2f2',
                              color:
                                req.status === 'Pending'
                                  ? '#b45309'
                                  : req.status === 'Approved'
                                  ? '#065f46'
                                  : req.status === 'Returned'
                                  ? '#1e40af'
                                  : '#991b1b',
                            }}
                          >
                            {req.status}
                          </span>
                          <span className="badge badge-lend">{req.sharingType}</span>
                        </div>

                        <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                          {req.resource?.title}
                        </h4>

                        <p style={{ fontSize: '0.825rem', color: '#475569' }}>
                          Owner: <strong>{req.owner?.name}</strong> ({req.owner?.department})
                        </p>

                        {req.expectedReturnDate && (
                          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                            Expected return date: {new Date(req.expectedReturnDate).toLocaleDateString()}
                          </p>
                        )}

                        {req.ownerResponseNote && (
                          <p style={{ fontSize: '0.8rem', color: '#1d4ed8', marginTop: '0.35rem' }}>
                            Owner note: "{req.ownerResponseNote}"
                          </p>
                        )}
                      </div>

                      <Link to={`/resources/${req.resource?._id}`} className="btn btn-sm btn-secondary">
                        View Resource
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Approve / Reject Modal Dialog */}
      {respondingRequestId && (
        <div className="modal-overlay" onClick={() => setRespondingRequestId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              {responseAction === 'approve' ? 'Approve Borrowing Request' : 'Decline Borrowing Request'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              {responseAction === 'approve'
                ? 'Approving will mark this item as borrowed and notify the student with pickup instructions.'
                : 'Decline this request if the resource is unavailable or timing does not work.'}
            </p>

            <form onSubmit={handleRespond}>
              <div className="form-group">
                <label className="form-label">Note for the student (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder={
                    responseAction === 'approve'
                      ? 'e.g. Let’s meet at the 2nd floor library study tables at 3 PM.'
                      : 'e.g. Sorry, I need the calculator this week for my own lab exam.'
                  }
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setRespondingRequestId(null)}
                  disabled={submittingResponse}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={responseAction === 'approve' ? 'btn btn-primary' : 'btn btn-danger'}
                  disabled={submittingResponse}
                >
                  {submittingResponse ? 'Processing...' : responseAction === 'approve' ? 'Confirm Approval' : 'Decline Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
