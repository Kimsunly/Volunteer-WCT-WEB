"use client";

import React from "react";

export default function Tabs({ active, onChange, tabs }) {
  return (
    <ul
      className="nav nav-tabs bg-white p-2 rounded shadow-sm"
      id="dashboardTabs"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      {tabs.map((t) => (
        <li key={t.id} className="nav-item">
          <button
            className={`nav-link ${active === t.id ? "active" : ""}`}
            onClick={() => onChange(t.id)}
            type="button"
          >
            {t.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
``;
