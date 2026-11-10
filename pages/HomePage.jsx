import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Search,
  BookOpen,
  Cpu,
  FlaskConical,
  Wrench,
  PenTool,
  Trophy,
  ShieldCheck,
  Repeat,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
} from 'lucide-react';
import { api } from '../api/client';
import ResourceCard from '../components/ResourceCard';
import RequestModal from '../components/RequestModal';
import ReportModal from '../components/ReportModal';

const categories = [
  { name: 'Textbooks', icon: BookOpen, desc: 'Course books, manuals & notes' },
  { name: 'Electronics', icon: Cpu, desc: 'Calculators, sensors & chargers' },
  { name: 'Lab Equipment', icon: FlaskConical, desc: 'Calipers, coats & kits' },
  { name: 'Project Materials', icon: Wrench, desc: 'Arduino, motors & hardware' },
  { name: 'Stationery', icon: PenTool, desc: 'Drafting boards, pens & tools' },
  { name: 'Sports Equipment', icon: Trophy, desc: 'Rackets, balls & workout gear' },
];

const HomePage = () => {
  const [featuredResources, setFeaturedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const [reportingResource, setReportingResource] = useState(null);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await api.getResources('?availability=Available');
        setFeaturedResources(data.slice(0, 6));
      } catch (err) {
        console.error('Failed to load featured items:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
          padding: '4.5rem 0 3.5rem',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid #bfdbfe',
                padding: '0.35rem 0.95rem',
                borderRadius: '999px',
                fontSize: '0.85rem',
                color: '#1d4ed8',
                fontWeight: 600,
                boxShadow: '0 1px 3px rgba(37,99,235,0.08)',
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={16} /> Exclusive to Verified Campus Students
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 5vw, 3.25rem)',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                color: '#0f172a',
              }}
            >
              Smart Campus Resource Sharing,{' '}
              <span style={{ color: '#2563eb' }}>Simplified.</span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '680px',
                margin: '0 auto 2rem',
              }}
            >
              Lend textbooks, borrow calculators, exchange project components, and donate lab gear directly with peers on campus. Built on verified college emails and our Student Trust Score.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
              }}
            >
              <Link to="/explorer" className="btn btn-lg btn-primary">
                <Search size={18} /> Explore Resources
              </Link>
              <Link to="/add-resource" className="btn btn-lg btn-secondary">
                <Layers size={18} /> List an Item to Share
              </Link>
            </div>

            {/* Quick Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                marginTop: '3.5rem',
                paddingTop: '2.5rem',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <div>
                <p style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1d4ed8' }}>100%</p>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Verified Student Community</p>
              </div>
              <div>
                <p style={{ fontSize: '1.85rem', fontWeight: 800, color: '#10b981' }}>50–100</p>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Rule-Based Trust Score</p>
              </div>
              <div>
                <p style={{ fontSize: '1.85rem', fontWeight: 800, color: '#8b5cf6' }}>Zero</p>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Rental Fees or Middlemen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How CampusLoop Works */}
      <section style={{ padding: '4rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simple 4-Step Process
            </span>
            <h2 style={{ fontSize: '1.9rem', marginTop: '0.35rem', marginBottom: '0.75rem' }}>
              How CampusLoop Works
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Safe, accountable, and hassle-free resource sharing built for college life.
            </p>
          </div>

          <div className="grid-4">
            <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <Users size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>1. College Sign-In</h4>
              <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5 }}>
                Register strictly with your approved college email. Receive 50 starter Trust Score points.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <Search size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>2. Find or List Item</h4>
              <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5 }}>
                Search textbooks, electronics, or lab tools, or list unused materials to lend, exchange, or donate.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <Repeat size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>3. Request & Meet</h4>
              <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5 }}>
                Set an expected return date. The owner approves and arranges a designated on-campus pickup spot.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>4. Return & Grow Trust</h4>
              <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5 }}>
                Return on time to earn +5 Trust Score points. Late returns penalize score (-5 pts).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Explorer */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                Academic Essentials
              </span>
              <h2 style={{ fontSize: '1.75rem', marginTop: '0.2rem' }}>Browse By Category</h2>
            </div>
            <Link to="/explorer" className="btn btn-outline-primary btn-sm">
              View All Categories <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/explorer?category=${encodeURIComponent(cat.name)}`}
                  className="card card-interactive"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                      {cat.name}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{cat.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Resources Grid */}
      <section style={{ padding: '4rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                Available Right Now
              </span>
              <h2 style={{ fontSize: '1.75rem', marginTop: '0.2rem' }}>Featured Resources</h2>
            </div>
            <Link to="/explorer" className="btn btn-secondary btn-sm">
              See All Resources <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
              Loading active campus items...
            </p>
          ) : featuredResources.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: '#64748b' }}>No resources listed yet. Be the first student to share an item!</p>
              <Link to="/add-resource" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                List an Item
              </Link>
            </div>
          ) : (
            <div className="grid-3">
              {featuredResources.map((res) => (
                <ResourceCard
                  key={res._id}
                  resource={res}
                  onRequest={(item) => setSelectedResource(item)}
                  onReport={(item) => setReportingResource(item)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Score Transparency Callout */}
      <section
        style={{
          padding: '4rem 0',
          backgroundColor: '#eff6ff',
          borderTop: '1px solid #dbeafe',
          borderBottom: '1px solid #dbeafe',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#1d4ed8',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                <ShieldCheck size={18} /> Transparent Accountability
              </div>
              <h2 style={{ fontSize: '1.9rem', marginBottom: '1rem', color: '#0f172a' }}>
                The Student Trust Score System
              </h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Every student begins at <strong>50 points</strong>. Reliable borrowers and lenders who return materials on time build a stellar reputation visible on every listing.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  <span><strong>+5 Points:</strong> Returning borrowed items on time</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  <span><strong>+3 Points:</strong> Completing an exchange or donated item handoff</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
                  <Clock size={18} color="#dc2626" />
                  <span><strong>-5 Points:</strong> Returning an item past the agreed return date</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
                  <Clock size={18} color="#dc2626" />
                  <span><strong>-10 Points:</strong> Verified listing report or guideline infraction</span>
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #bfdbfe',
                padding: '2rem',
                boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.1)',
              }}
            >
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                Join the Resource Sharing Network
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Have an old textbook or extra scientific calculator gathering dust in your dorm? Share it with a classmate and earn community trust.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to="/register" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Student Account
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ flex: 1 }}>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <RequestModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        onSuccess={() => {}}
      />
      <ReportModal
        resource={reportingResource}
        isOpen={!!reportingResource}
        onClose={() => setReportingResource(null)}
      />
    </div>
  );
};

export default HomePage;
