'use client';

import React from 'react';

export default function RightPanel() {
  return (
    <aside className="right-panel">
      {/* Notifications */}
      <div>
        <h3 className="panel-section-title">Notifications</h3>
        <div className="space-y-2">
          <div className="notification-item">
            <div className="avatar avatar-green" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
              56
            </div>
            <div>
              <div className="notification-text">New users registered</div>
              <div className="notification-time">Just now</div>
            </div>
          </div>
          <div className="notification-item">
            <div className="avatar avatar-purple" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
              132
            </div>
            <div>
              <div className="notification-text">Opportunities posted</div>
              <div className="notification-time">59 minutes ago</div>
            </div>
          </div>
          <div className="notification-item">
            <div className="avatar avatar-blue" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
              $
            </div>
            <div>
              <div className="notification-text">Funds have been withdrawn</div>
            </div>
          </div>
          <div className="notification-item">
            <div className="avatar avatar-orange" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
              5
            </div>
            <div>
              <div className="notification-text">Unread messages</div>
              <div className="notification-time">Today, 11:59 PM</div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-divider"></div>

      {/* Activities */}
      <div>
        <h3 className="panel-section-title">Activities</h3>
        <div className="space-y-2">
          <div className="notification-item">
            <div className="avatar avatar-pink" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
              ✨
            </div>
            <div>
              <div className="notification-text">Changed the style</div>
              <div className="notification-time">Just now</div>
            </div>
          </div>
          <div className="notification-item">
            <div className="avatar avatar-green" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
              177
            </div>
            <div>
              <div className="notification-text">New products added</div>
              <div className="notification-time">47 minutes ago</div>
            </div>
          </div>
          <div className="notification-item">
            <div className="avatar avatar-purple" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
              11
            </div>
            <div>
              <div className="notification-text">Posts have been archived</div>
              <div className="notification-time">1 day ago</div>
            </div>
          </div>
          <div className="notification-item">
            <div className="avatar avatar-blue" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
              J
            </div>
            <div>
              <div className="notification-text">Category "Jobs" was updated</div>
              <div className="notification-time">Feb 2, 2024</div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-divider"></div>

      {/* Contacts */}
      <div>
        <h3 className="panel-section-title">Contacts of your managers</h3>
        <div className="space-y-1">
          <div className="contact-item">
            <div className="avatar avatar-purple" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
              DC
            </div>
            <div className="contact-name">Daniel Craig</div>
          </div>
          <div className="contact-item">
            <div className="avatar avatar-orange" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
              KM
            </div>
            <div className="contact-name">Kate Morrison</div>
          </div>
          <div className="contact-item highlighted">
            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem', background: '#fff' }}>
              ND
            </div>
            <div className="contact-name">Nataniel Donovan</div>
            <div className="contact-actions">
              <button className="contact-action-btn">
                <i className="bi bi-telephone"></i>
              </button>
            </div>
          </div>
          <div className="contact-item">
            <div className="avatar avatar-blue" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
              EW
            </div>
            <div className="contact-name">Elizabeth West</div>
          </div>
          <div className="contact-item">
            <div className="avatar avatar-pink" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
              PR
            </div>
            <div className="contact-name">Pelicia Raspeit</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
