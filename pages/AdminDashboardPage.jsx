import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Package,
  Flag,
  Repeat,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
  UserX,
  UserCheck,
  Search,
} from 'lucide-react';
import { api } from '../api/client';
import TrustScoreBadge from '../components/TrustScoreBadge';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('reports'); // reports | students | resources
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [students, setStudents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Report resolution modal state
  const [managingReport, setManagingReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [removeListing, setRemoveListing] = useState(true);
  const [penalizeUser, setPenalizeUser] = useState(true);
  const [processingReport, setProcessingReport] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [adminStats, allReports, allStudents, allResources] = await Promise.all([
        api.getAdminStats(),
        api.getAllReports(),
        api.getAllStudents(),
        api.getResources('?includeReported=true'),
      ]);
      setStats(adminStats);
      setReports(allReports);
      setStudents(allStudents);
      setResources(allResources);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSuspend = async (student) => {
    const reason = student.isSuspended
      ? ''
      : prompt(`Enter reason for suspending ${student.name}:`, 'Policy violation');

    if (!student.isSuspended && !reason) return;

    try {
      await api.toggleSuspendStudent(student._id, { suspensionReason: reason });
      setActionFeedback({
        type: 'success',
        text: `Student ${student.name} ${student.isSuspended ? 'reactivated' : 'suspended'}.`,
      });
      loadData();
    } catch (err) {
      alert(err.message || 'Error updating student status');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm('Are you sure you want to remove this resource listing from campus?')) return;
    try {
      await api.deleteResource(resourceId);
      setActionFeedback({ type: 'success', text: 'Listing removed successfully.' });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to remove resource');
    }
  };

  const handleManageReportSubmit = async (status) => {
    if (!managingReport) return;
    try {
      setProcessingReport(true);
      await api.manageReport(managingReport._id, {
        status, // 'Resolved' or 'Dismissed'
        adminNotes,
        removeListing: status === 'Resolved' && removeListing,
        penalizeUser: status === 'Resolved' && penalizeUser,
      });

      setManagingReport(null);
      setAdminNotes('');
      setActionFeedback({
        type: 'success',
        text: `Report ${status.toLowerCase()} successfully. ${
          penalizeUser ? 'Violator trust score docked -10 pts.' : ''
        }`,
      });
      loadData();
    } catch (err) {
      alert(err.message || 'Error managing report');
    } finally {
      setProcessingReport(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldAlert size={20} />
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Campus Moderator Portal</h1>
      </div>
      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
        CampusLoop administration: oversee student trust scores, reports, and campus resource integrity
      </p>

      {actionFeedback && (
        <div className={`alert alert-${actionFeedback.type}`} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{actionFeedback.text}</span>
          <button onClick={() => setActionFeedback(null)}>✕</button>
        </div>
      )}

      {/* Admin Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Registered Students</p>
          <h3 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.2rem', color: '#2563eb' }}>
            {stats?.totalStudents ?? 0}
          </h3>
        </div>
        <div className="card">
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Resources</p>
          <h3 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.2rem', color: '#16a34a' }}>
            {stats?.totalResources ?? 0}
          </h3>
        </div>
        <div className="card">
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Active Borrowing</p>
          <h3 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.2rem', color: '#d97706' }}>
            {stats?.activeBorrows ?? 0}
          </h3>
        </div>
        <div className="card">
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Pending Reports</p>
          <h3 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.2rem', color: '#dc2626' }}>
            {stats?.pendingReports ?? 0}
          </h3>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.925rem',
            color: activeTab === 'reports' ? '#7c3aed' : '#64748b',
            borderBottom: activeTab === 'reports' ? '3px solid #7c3aed' : '3px solid transparent',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Flag size={16} /> Reported Items ({reports.filter((r) => r.status === 'Pending').length} pending)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('students')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.925rem',
            color: activeTab === 'students' ? '#7c3aed' : '#64748b',
            borderBottom: activeTab === 'students' ? '3px solid #7c3aed' : '3px solid transparent',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Users size={16} /> Registered Students ({students.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('resources')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.925rem',
            color: activeTab === 'resources' ? '#7c3aed' : '#64748b',
            borderBottom: activeTab === 'resources' ? '3px solid #7c3aed' : '3px solid transparent',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Package size={16} /> Resource Listings ({resources.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          <p>Loading administration data...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: REPORTS */}
          {activeTab === 'reports' && (
            <div>
              {reports.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                  <CheckCircle size={40} color="#16a34a" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.95rem' }}>No student reports on file. The community is clean!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reports.map((rep) => (
                    <div
                      key={rep._id}
                      className="card"
                      style={{
                        padding: '1.25rem',
                        borderLeft: rep.status === 'Pending' ? '4px solid #ef4444' : '4px solid #cbd5e1',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <span className="badge" style={{ backgroundColor: rep.status === 'Pending' ? '#fef2f2' : '#f1f5f9', color: rep.status === 'Pending' ? '#991b1b' : '#475569' }}>
                              {rep.status}
                            </span>
                            <span className="badge" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}>
                              {rep.reason}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {new Date(rep.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <h4 style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                            Target Resource: {rep.resource?.title || 'Resource removed'}
                          </h4>
                        </div>

                        {rep.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => {
                              setManagingReport(rep);
                              setAdminNotes('');
                            }}
                            className="btn btn-sm btn-primary"
                          >
                            Review & Take Action
                          </button>
                        )}
                      </div>

                      <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                        <p><strong>Report Explanation:</strong> "{rep.description}"</p>
                        <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                          Reported by: {rep.reportedBy?.name} ({rep.reportedBy?.studentId}) • Owner: {rep.reportedUser?.name} (Current Score: {rep.reportedUser?.trustScore ?? 50})
                        </p>
                      </div>

                      {rep.adminNotes && (
                        <p style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 500 }}>
                          Admin Note: {rep.adminNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STUDENTS DIRECTORY */}
          {activeTab === 'students' && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Student Name & ID</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>College Email</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Department & Year</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Trust Score</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Account Status</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((st) => (
                      <tr key={st._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{st.name}</div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{st.studentId}</span>
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', color: '#475569' }}>{st.email}</td>
                        <td style={{ padding: '0.9rem 1.25rem', color: '#475569' }}>
                          {st.department} <br />
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{st.year}</span>
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          <TrustScoreBadge score={st.trustScore ?? 50} size="sm" />
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          {st.isSuspended ? (
                            <span className="badge badge-overdue">Suspended</span>
                          ) : (
                            <span className="badge badge-available">Active</span>
                          )}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          {st.role !== 'admin' && (
                            <button
                              type="button"
                              onClick={() => handleToggleSuspend(st)}
                              className={`btn btn-sm ${st.isSuspended ? 'btn-success' : 'btn-danger'}`}
                              style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                            >
                              {st.isSuspended ? (
                                <>
                                  <UserCheck size={13} /> Reactivate
                                </>
                              ) : (
                                <>
                                  <UserX size={13} /> Suspend
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: RESOURCE LISTINGS */}
          {activeTab === 'resources' && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Item</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Category & Type</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Owner</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Status</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((res) => (
                      <tr key={res._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{res.title}</div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Pickup: {res.pickupLocation}</span>
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          <span className="badge badge-lend">{res.sharingType}</span>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                            {res.category}
                          </div>
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          <div style={{ fontWeight: 500 }}>{res.owner?.name}</div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{res.owner?.department}</span>
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: res.status === 'Available' ? '#ecfdf5' : '#fffbeb',
                              color: res.status === 'Available' ? '#065f46' : '#b45309',
                            }}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteResource(res._id)}
                            className="btn btn-sm btn-secondary"
                            style={{ color: '#ef4444' }}
                            title="Remove listing"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Report Review & Resolution Modal */}
      {managingReport && (
        <div className="modal-overlay" onClick={() => setManagingReport(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Manage Student Report</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Resource: <strong>{managingReport.resource?.title}</strong>
            </p>

            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <p><strong>Reason:</strong> {managingReport.reason}</p>
              <p style={{ marginTop: '0.35rem' }}><strong>Description:</strong> "{managingReport.description}"</p>
            </div>

            <div className="form-group">
              <label className="form-label">Moderator Resolution Notes</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Enter explanation for student / moderation log..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={removeListing}
                  onChange={(e) => setRemoveListing(e.target.checked)}
                />
                <span>Remove this listing from the campus catalog</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={penalizeUser}
                  onChange={(e) => setPenalizeUser(e.target.checked)}
                />
                <span>Apply Trust Score penalty to violator (-10 points)</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setManagingReport(null)}
                disabled={processingReport}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleManageReportSubmit('Dismissed')}
                disabled={processingReport}
              >
                Dismiss Report
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleManageReportSubmit('Resolved')}
                disabled={processingReport}
              >
                {processingReport ? 'Processing...' : 'Resolve & Apply Penalties'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
