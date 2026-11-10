import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Mail, Lock, User, IdCard, GraduationCap, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    phone: '',
  });

  const [collegeConfig, setCollegeConfig] = useState({
    collegeName: 'State University Campus',
    allowedDomains: ['campus.edu', 'college.edu', 'university.edu', 'student.edu'],
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await api.getCollegeConfig();
        setCollegeConfig(config);
      } catch (err) {
        console.error('Error getting college domain config:', err);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const isEmailValidCollegeDomain = (email) => {
    if (!email || !email.includes('@')) return false;
    const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();
    return collegeConfig.allowedDomains.some(
      (d) => domain === d || domain.endsWith('.' + d)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!isEmailValidCollegeDomain(formData.email)) {
      setError(
        `Email domain must be one of: ${collegeConfig.allowedDomains.join(', ')}`
      );
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId,
        department: formData.department,
        year: formData.year,
        phone: formData.phone,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const emailHasValidDomain = isEmailValidCollegeDomain(formData.email);

  return (
    <div style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '580px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              margin: '0 auto 0.75rem',
            }}
          >
            <Layers size={24} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create Student Account</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Join the campus sharing network at <strong>{collegeConfig.collegeName}</strong>
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div className="card">
          {/* Domain Notice Alert */}
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.825rem',
              color: '#1e40af',
            }}
          >
            <strong>Note:</strong> Registration requires an authorized campus email (e.g. <code>@{collegeConfig.allowedDomains[0]}</code>). You will be assigned a starter <strong>Trust Score of 50 points</strong>.
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="e.g. Alex Rivera"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Student ID / Roll No *</label>
                <div style={{ position: 'relative' }}>
                  <IdCard size={16} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input
                    type="text"
                    name="studentId"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="e.g. CS-2024-042"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">College Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder={`name@${collegeConfig.allowedDomains[0] || 'campus.edu'}`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {formData.email && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.78rem',
                    marginTop: '0.35rem',
                    color: emailHasValidDomain ? '#16a34a' : '#ea580c',
                    fontWeight: 500,
                  }}
                >
                  {emailHasValidDomain ? (
                    <>
                      <CheckCircle size={14} /> Approved college domain detected
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} /> Domain must end with: {collegeConfig.allowedDomains.join(', ')}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  name="department"
                  className="form-select"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Biotechnology & Life Sciences">Biotechnology & Life Sciences</option>
                  <option value="Physics & Mathematics">Physics & Mathematics</option>
                  <option value="Chemistry & Materials">Chemistry & Materials</option>
                  <option value="Business Administration">Business Administration</option>
                  <option value="Architecture & Design">Architecture & Design</option>
                  <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <select
                  name="year"
                  className="form-select"
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior)</option>
                  <option value="Graduate / Post-Grad">Graduate / Post-Grad</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone / WhatsApp (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <p className="form-helper">Used to coordinate resource handoffs upon approved requests.</p>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
              disabled={loading}
            >
              {loading ? 'Creating Your Account...' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
            Already have a CampusLoop account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
