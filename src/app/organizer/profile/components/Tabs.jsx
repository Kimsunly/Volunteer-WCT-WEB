"use client";

import React from "react";

export default function Tabs({ active, onChange, tabs }) {
  return (
    <ul
      className="nav nav-tabs"
      id="dashboardTabs"
      data-label="Dashboard Navigation"
      style={{ zIndex: 10, listStyle: "none" }}
    >
      {tabs.map((t) => (
        <li key={t.id} className="nav-item">
          <button
            className={`nav-link ${active === t.id ? "active" : ""}`}
            onClick={() => onChange(t.id)}
            type="button"
          >
            {t.icon && <i className={`${t.icon}`} style={{ fontSize: "1.1rem" }}></i>}
            <span>{t.label}</span>
          </button>
        </li>
      ))}

      <style jsx global>{`
        #dashboardTabs {
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          backdrop-filter: blur(12px) !important;
          padding: 6px !important;
          border-radius: 16px !important;
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 4px !important;
          box-shadow: var(--shadow-card) !important;
          margin-bottom: 0 !important;
        }

        #dashboardTabs .nav-item {
          list-style: none !important;
          margin: 0 !important;
        }

        #dashboardTabs .nav-link {
          border: 1px solid transparent !important;
          color: var(--color-text-secondary) !important;
          background: transparent !important;
          border-radius: 12px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          padding: 10px 18px !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer !important;
          line-height: 1.2 !important;
        }

        #dashboardTabs .nav-link:hover {
          color: var(--color-text-primary) !important;
          background-color: var(--color-bg-input) !important;
        }

        #dashboardTabs .nav-link.active {
          color: #000000 !important;
          background-color: var(--color-accent) !important;
          border: 1px solid var(--color-accent) !important;
          box-shadow: 0 4px 12px var(--color-accent-glow) !important;
          font-weight: 700 !important;
        }

        :global([data-theme="light"]) #dashboardTabs .nav-link.active {
          color: #ffffff !important;
          background-color: #15803d !important;
          border-color: #15803d !important;
          box-shadow: 0 4px 12px rgba(21, 128, 61, 0.25) !important;
        }
      `}</style>
    </ul>
  );
}
