import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Layers,
  Search,
  LayoutDashboard,
  Package,
  Repeat,
  History,
  ShieldAlert,
  Bell,
  LogOut,
  User,
  PlusCircle,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import TrustScoreBadge from './TrustScoreBadge';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand / Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-wrap">
            <Layers size={22} />
          </div>
          <div className="brand-title">
            Campus<span>Loop</span>
            <span className="brand-badge">Campus Only</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <NavLink
            to="/explorer"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Search size={16} /> Explorer
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>

              <NavLink
                to="/my-listings"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Package size={16} /> My Items
              </NavLink>

              <NavLink
                to="/requests"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Repeat size={16} /> Requests & Returns
              </NavLink>

              <NavLink
                to="/history"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <History size={16} /> History
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={{
                    color: '#7c3aed',
                    backgroundColor: '#f5f3ff',
                    fontWeight: 600,
                  }}
                >
                  <ShieldAlert size={16} /> Admin Portal
                </NavLink>
              )}
            </>
          )}
        </nav>

        {/* Right Section Actions */}
        <div className="nav-right">
          {isAuthenticated ? (
            <>
              {/* Add Resource Listing Action */}
              <Link
                to="/add-resource"
                className="btn btn-sm btn-primary"
                style={{ display: 'flex', gap: '0.35rem' }}
              >
                <PlusCircle size={16} />
                <span>Share Item</span>
              </Link>

              {/* Trust Score Pill */}
              <Link to="/profile" title="View Trust Score details">
                <TrustScoreBadge score={user?.trustScore ?? 50} size="sm" showLabel={false} />
              </Link>

              {/* Notification Bell Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-label="View notifications"
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: showNotifications ? '#eff6ff' : '#f1f5f9',
                    color: showNotifications ? '#2563eb' : '#475569',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '9px',
                        height: '9px',
                        backgroundColor: '#ef4444',
                        borderRadius: '50%',
                        border: '2px solid white',
                      }}
                    />
                  )}
                </button>

                <NotificationDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              </div>

              {/* Profile Link & Logout */}
              <Link
                to="/profile"
                className="nav-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.65rem',
                }}
              >
                <User size={16} />
                <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0]}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-sm btn-secondary"
                title="Log out"
                style={{ padding: '0.45rem' }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-sm btn-secondary">
                Log In
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="btn btn-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', padding: '0.4rem' }}
            id="mobile-nav-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <NavLink
            to="/explorer"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Search size={16} /> Explorer
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
              <NavLink
                to="/my-listings"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Package size={16} /> My Items
              </NavLink>
              <NavLink
                to="/requests"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Repeat size={16} /> Requests & Returns
              </NavLink>
              <NavLink
                to="/history"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <History size={16} /> Borrowing History
              </NavLink>
              <NavLink
                to="/profile"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={16} /> Student Profile
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: '#7c3aed' }}
                >
                  <ShieldAlert size={16} /> Admin Dashboard
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', marginTop: '0.5rem' }}
              >
                <LogOut size={16} /> Log Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link
                to="/login"
                className="btn btn-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
