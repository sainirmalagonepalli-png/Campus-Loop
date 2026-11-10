import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    onClose();
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        width: '360px',
        maxWidth: '90vw',
        background: '#ffffff',
        borderRadius: '14px',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
        border: '1px solid #e2e8f0',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '0.9rem 1.1rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={18} color="#2563eb" />
          <span style={{ fontWeight: 700, fontSize: '0.925rem' }}>Notifications</span>
          {unreadCount > 0 && (
            <span
              style={{
                background: '#2563eb',
                color: 'white',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
              }}
            >
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              fontSize: '0.8rem',
              color: '#2563eb',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b' }}>
            <Bell size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
            <p style={{ fontSize: '0.875rem' }}>No notifications right now</p>
          </div>
        ) : (
          notifications.slice(0, 10).map((n) => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              style={{
                padding: '0.85rem 1.1rem',
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: n.isRead ? '#ffffff' : '#f0f7ff',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                display: 'flex',
                gap: '0.75rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = n.isRead ? '#f8fafc' : '#e6f0fd')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = n.isRead ? '#ffffff' : '#f0f7ff')}
            >
              <div style={{ marginTop: '0.15rem' }}>
                {n.type === 'return_overdue' ? (
                  <AlertTriangle size={18} color="#ef4444" />
                ) : n.type === 'return_reminder' ? (
                  <Clock size={18} color="#f59e0b" />
                ) : (
                  <Bell size={18} color="#2563eb" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                  <h6 style={{ fontSize: '0.85rem', fontWeight: n.isRead ? 600 : 700, color: '#0f172a' }}>
                    {n.title}
                  </h6>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                  {n.message}
                </p>
              </div>
              {!n.isRead && (
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    marginTop: '0.4rem',
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div
          onClick={() => {
            onClose();
            navigate('/requests');
          }}
          style={{
            padding: '0.7rem',
            textAlign: 'center',
            fontSize: '0.825rem',
            fontWeight: 600,
            color: '#2563eb',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
          }}
        >
          View all requests & returns <ArrowRight size={14} />
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
