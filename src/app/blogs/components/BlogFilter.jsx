
"use client";

import React from "react";

const FILTERS = [
  { id: "all", label: "ទាំងអស់", icon: "bi bi-grid-fill" },
  { id: "education", label: "អប់រំ", icon: "bi bi-book" },
  { id: "health", label: "សុខភាព", icon: "bi bi-heart-pulse" },
  { id: "environment", label: "បរិស្ថាន", icon: "bi bi-tree" },
  { id: "community", label: "សហគមន៍", icon: "bi bi-people" },
];

export default function BlogFilter({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
}) {
  return (
    <section className="blog-filter py-4">
      <div className="container">
        <div className="row align-items-center">
          {/* Pills */}
          <div className="col-md-8">
            <div className="filter-pills" data-aos="fade-up">
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.id;
                const base = "btn btn-sm";
                const cls = isActive
                  ? `${base} btn-primary active`
                  : `${base} btn-outline-primary`;
                return (
                  <button
                    key={f.id}
                    className={cls}
                    onClick={() => onFilterChange(f.id)}
                    aria-pressed={isActive}
                    type="button"
                  >
                    <i className={`${f.icon} me-2`}></i>
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search */}
          <div className="col-md-4">
            <div className="search-box" data-aos="fade-up" data-aos-delay="100">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ស្វែងរកអត្ថបទ..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  aria-label="ស្វែងរកអត្ថបទ"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
