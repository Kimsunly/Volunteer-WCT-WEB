"use client";

import React from "react";
import Link from "next/link";

/**
 * AdminSidebar: left navigation for admin pages.
 * - Highlights active link via prop 'active'
 */
export default function AdminSidebar({ active }) {
  const link = (href, icon, label, id) => (
    <Link
      className={`sidebar-link ${active === id ? "active" : ""}`}
      href={href}
    >
      <i className={icon}></i> {label}
    </Link>
  );

  return (
    <aside className="col-lg-3 col-xl-2">
      <div className="admin-card p-3">
        <div className="mb-3 fw-semibold text-uppercase small text-muted">
          Navigation
        </div>
        <nav className="d-flex flex-column gap-2">
          {link(
            "/admin/dashboard",
            "bi bi-speedometer2",
            "ទិដ្ឋភាពទូទៅ",
            "dashboard"
          )}
          {link(
            "/admin/organizers",
            "bi bi-patch-check",
            "ផ្ទៀងផ្ទាត់ Organizer",
            "organizers"
          )}
          {link(
            "/admin/opportunities",
            "bi bi-briefcase",
            "ឱកាស (CRUD)",
            "opportunities"
          )}
          {link("/admin/categories", "bi bi-tags", "ប្រភេទ", "categories")}
          {link("/admin/blogs", "bi bi-lightbulb", "គន្លឹះ / ប្លុក", "blogs")}
          {link("/admin/comments", "bi bi-chat-dots", "មតិយោបល់", "comments")}
          {link("/admin/users", "bi bi-people", "អ្នកប្រើប្រាស់", "users")}
          {link("/admin/donations", "bi bi-heart", "បរិច្ចាគ", "donations")}
        </nav>
      </div>
    </aside>
  );
}
