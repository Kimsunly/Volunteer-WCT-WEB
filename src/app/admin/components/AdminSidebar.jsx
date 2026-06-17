"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminSidebar({ active }) {
  const { user } = useAuth();
  const userName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.name || "Guy Hawkins";
  const userInitial = userName.charAt(0).toUpperCase();

  const getAvatarSrc = () => {
    const raw = user?.avatar_url || user?.avatar;
    if (!raw) return null;
    if (raw.startsWith("http") || raw.startsWith("data:")) return raw;
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    return `${apiBase.replace(/\/$/, "")}/${raw.replace(/^\//, "")}`;
  };

  const avatarSrc = getAvatarSrc();

  return (
    <aside className="sidebar">
      {/* User Profile */}
      <div className="sidebar-user">
        {avatarSrc ? (
          <div 
            className="avatar" 
            style={{ 
              overflow: "hidden", 
              position: "relative",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-border)"
            }}
          >
            <img 
              src={avatarSrc} 
              alt="Avatar" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="avatar">{userInitial}</div>
        )}
        <div
          style={{
            color: "var(--color-text-primary)",
            fontWeight: "500",
            fontSize: "0.875rem",
          }}
        >
          {userName}
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <i className="bi bi-search"></i>
        <input type="text" placeholder="Search..." />
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1">
        {/* Dashboards Group */}
        <div className="nav-group">
          <div className="nav-group-label">Dashboards</div>
          <Link
            href="/admin/dashboard"
            className={`nav-item ${active === "dashboard" ? "active" : ""}`}
          >
            <i className="bi bi-grid-3x3-gap-fill"></i>
            Overview
          </Link>
          <Link
            href="/admin/organizers"
            className={`nav-item ${active === "organizers" ? "active" : ""}`}
          >
            <i className="bi bi-people-fill"></i>
            Organizer Applications
          </Link>
          <Link
            href="/admin/opportunities"
            className={`nav-item ${active === "opportunities" ? "active" : ""}`}
          >
            <i className="bi bi-briefcase-fill"></i>
            Opportunities
          </Link>
        </div>

        {/* Settings Group */}
        <div className="nav-group">
          <div className="nav-group-label">Settings</div>
          <Link
            href="/admin/settings/profile"
            className={`nav-item ${active === "settings-profile" ? "active" : ""}`}
          >
            <i className="bi bi-person-fill-gear"></i>
            Profile Settings
          </Link>
          <Link
            href="/admin/settings"
            className={`nav-item ${active === "settings" ? "active" : ""}`}
          >
            <i className="bi bi-gear-fill"></i>
            Appearance
          </Link>
        </div>

        {/* Management Group */}
        <div className="nav-group">
          <div className="nav-group-label">Management</div>
          <Link
            href="/admin/categories"
            className={`nav-item ${active === "categories" ? "active" : ""}`}
          >
            <i className="bi bi-tags-fill"></i>
            Categories
          </Link>
          <Link
            href="/admin/blogs"
            className={`nav-item ${active === "blogs" ? "active" : ""}`}
          >
            <i className="bi bi-lightbulb-fill"></i>
            Blogs & Tips
          </Link>
          <Link
            href="/admin/community"
            className={`nav-item ${active === "community" ? "active" : ""}`}
          >
            <i className="bi bi-people-fill"></i>
            Community
          </Link>
          <Link
            href="/admin/comments"
            className={`nav-item ${active === "comments" ? "active" : ""}`}
          >
            <i className="bi bi-chat-dots-fill"></i>
            Comments
          </Link>
          <Link
            href="/admin/users"
            className={`nav-item ${active === "users" ? "active" : ""}`}
          >
            <i className="bi bi-person-gear"></i>
            Users
          </Link>
          <Link
            href="/admin/donations"
            className={`nav-item ${active === "donations" ? "active" : ""}`}
          >
            <i className="bi bi-heart-fill"></i>
            Donations
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="flex items-center gap-1">
          <i className="bi bi-123"></i>
          SMAKJIT
        </div>
        <i className="bi bi-app-indicator"></i>
      </div>
    </aside>
  );
}
