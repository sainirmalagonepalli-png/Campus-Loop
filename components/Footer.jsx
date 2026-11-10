import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#2563eb',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <Layers size={18} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>
                CampusLoop
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '340px' }}>
              The college-exclusive resource-sharing network. Empowering students to lend, borrow, exchange, and donate academic essentials safely within our campus community.
            </p>
          </div>

          <div className="footer-col">
            <h5>Explore Resources</h5>
            <ul className="footer-links">
              <li><Link to="/explorer?category=Textbooks" className="footer-link">Textbooks</Link></li>
              <li><Link to="/explorer?category=Electronics" className="footer-link">Electronics & Calculators</Link></li>
              <li><Link to="/explorer?category=Lab%20Equipment" className="footer-link">Lab Equipment</Link></li>
              <li><Link to="/explorer?category=Project%20Materials" className="footer-link">Project Materials</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Student Platform</h5>
            <ul className="footer-links">
              <li><Link to="/dashboard" className="footer-link">Student Dashboard</Link></li>
              <li><Link to="/requests" className="footer-link">Return Tracking</Link></li>
              <li><Link to="/profile" className="footer-link">Trust Score System</Link></li>
              <li><Link to="/history" className="footer-link">Borrowing History</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Campus Safety</h5>
            <div
              style={{
                background: '#f8fafc',
                padding: '0.85rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                fontSize: '0.825rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontWeight: 600, marginBottom: '0.35rem' }}>
                <ShieldCheck size={16} /> Verified College IDs
              </div>
              <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.4 }}>
                Access is strictly restricted to verified college email domains to ensure trust and accountability.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
            © {new Date().getFullYear()} CampusLoop – Smart Campus Resource Sharing Platform. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.825rem', color: '#64748b' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for students on campus
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
