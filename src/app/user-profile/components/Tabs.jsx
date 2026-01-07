"use client";

import React from "react";

export default function Tabs({ activeTab, onChange, tabs }) {
  return (
    <ul className="nav nav-tabs p-2 rounded shadow-sm" style={{ zIndex: 10 }}>
      {tabs.map((t) => (
        <li key={t.id} className="nav-item">
          <button
            className={`nav-link ${activeTab === t.id ? "active" : ""}`}
            onClick={() => onChange(t.id)}
          >
            <i className={`${t.icon} me-1`}></i> {t.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
``;
