'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';
import { getDashboardMetrics } from '@/services/admin';

export default function RightPanel() {
  const [metrics, setMetrics] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [metricsData, messagesRes, usersRes] = await Promise.all([
        getDashboardMetrics(),
        api.get('/admin/contact-messages').catch(() => ({ data: { data: [] } })),
        api.get('/admin/users', { params: { limit: 50 } }).catch(() => ({ data: { data: [] } }))
      ]);

      setMetrics(metricsData);

      // 1. Calculate unread messages
      const msgs = messagesRes?.data?.data || messagesRes?.data || [];
      const unread = msgs.filter(m => m.status === 'unread').length;
      setUnreadCount(unread);

      // 2. Process users
      const allUsers = usersRes?.data?.data || usersRes?.data || [];
      
      // Filter out admins for recent activities feed, sorted by creation date
      const volunteersAndOrganizers = allUsers
        .filter(u => u.role !== 'admin')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRecentUsers(volunteersAndOrganizers.slice(0, 4));

      // Filter admins for managers contact list
      const adminList = allUsers.filter(u => u.role === 'admin');
      setAdmins(adminList.slice(0, 5));
    } catch (err) {
      console.error("RightPanel fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000); // refresh every 20 seconds
    return () => clearInterval(interval);
  }, []);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const timeAgo = (dateString) => {
    if (!dateString) return 'recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const pendingOrganizers = metrics?.organizers_count?.pending || 0;
  const pendingOpportunities = metrics?.opportunities_count?.pending || 0;

  return (
    <aside className="right-panel">
      {/* Notifications */}
      <div>
        <h3 className="panel-section-title">Actions Required</h3>
        <div className="space-y-2">
          <Link href="/admin/organizers" className="text-decoration-none">
            <div className="notification-item" style={{ cursor: 'pointer' }}>
              <div 
                className={`avatar ${pendingOrganizers > 0 ? 'avatar-orange' : 'avatar-green'}`} 
                style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}
              >
                {loading ? '...' : pendingOrganizers}
              </div>
              <div>
                <div className="notification-text fw-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Organizer Applications
                </div>
                <div className="notification-time">
                  {pendingOrganizers > 0 ? 'Requires verification review' : 'All applications caught up'}
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/opportunities" className="text-decoration-none">
            <div className="notification-item" style={{ cursor: 'pointer' }}>
              <div 
                className={`avatar ${pendingOpportunities > 0 ? 'avatar-purple' : 'avatar-green'}`} 
                style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}
              >
                {loading ? '...' : pendingOpportunities}
              </div>
              <div>
                <div className="notification-text fw-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Opportunity Approvals
                </div>
                <div className="notification-time">
                  {pendingOpportunities > 0 ? 'Events awaiting approval' : 'All postings approved'}
                </div>
              </div>
            </div>
          </Link>

          <div className="notification-item">
            <div 
              className={`avatar ${unreadCount > 0 ? 'avatar-pink' : 'avatar-green'}`} 
              style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}
            >
              {loading ? '...' : unreadCount}
            </div>
            <div>
              <div className="notification-text fw-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Unread Messages
              </div>
              <div className="notification-time">
                {unreadCount > 0 ? 'New user/organizer inquiries' : 'No new messages'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-divider"></div>

      {/* Activities */}
      <div>
        <h3 className="panel-section-title">Recent Registrations</h3>
        <div className="space-y-2">
          {loading && recentUsers.length === 0 ? (
            <div className="text-muted small py-2 text-center">Loading feed...</div>
          ) : recentUsers.length === 0 ? (
            <div className="text-muted small py-2 text-center">No recent user registrations</div>
          ) : (
            recentUsers.map((u) => {
              const roleColor = u.role === 'organizer' ? 'avatar-purple' : 'avatar-blue';
              return (
                <div className="notification-item" key={u.id}>
                  <div className={`avatar ${roleColor}`} style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                    {getInitials(u.name)}
                  </div>
                  <div>
                    <div className="notification-text">
                      <strong style={{ color: 'var(--color-text-primary)' }}>{u.name}</strong> registered as a <span style={{ color: 'var(--color-accent)', textTransform: 'capitalize' }}>{u.role}</span>
                    </div>
                    <div className="notification-time">{timeAgo(u.created_at)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="panel-divider"></div>

      {/* Contacts */}
      <div>
        <h3 className="panel-section-title">Active Admins</h3>
        <div className="space-y-1">
          {loading && admins.length === 0 ? (
            <div className="text-muted small py-2 text-center">Loading admins...</div>
          ) : admins.length === 0 ? (
            <div className="text-muted small py-2 text-center">No other admins found</div>
          ) : (
            admins.map((admin) => (
              <div className="contact-item" key={admin.id} style={{ padding: '8px 10px', margin: '0 -10px' }}>
                <div className="avatar avatar-green" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                  {getInitials(admin.name)}
                </div>
                <div className="contact-name" style={{ marginLeft: '10px' }}>{admin.name}</div>
                {admin.phone && (
                  <div className="contact-actions">
                    <a href={`tel:${admin.phone}`} className="contact-action-btn text-decoration-none">
                      <i className="bi bi-telephone" style={{ color: 'var(--color-accent)' }}></i>
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
