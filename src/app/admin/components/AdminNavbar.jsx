"use client";

import Link from "next/link";
import { logout as apiLogout } from "@/lib/services/auth";
import { clearAuth } from "@/lib/utils/authState";
import { useEffect, useState } from "react";

export default function AdminNavbar() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
  }, []);

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      window.location.href = "/auth/login";
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-icons">
          <button className="icon-btn">
            <i className="bi bi-layers"></i>
          </button>
          <button className="icon-btn">
            <i className="bi bi-star"></i>
          </button>
        </div>
        <div className="breadcrumbs">
          <Link href="/" className="breadcrumb-item">
            Dashboards
          </Link>
          <span style={{ color: "var(--color-text-muted)" }}>/</span>
          <span className="breadcrumb-item active">Overview</span>
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? (
            <i className="bi bi-moon-stars"></i>
          ) : (
            <i className="bi bi-sun"></i>
          )}
        </button>
        <button className="icon-btn" title="Refresh">
          <i className="bi bi-arrow-clockwise"></i>
        </button>
        <button className="icon-btn" title="Notifications">
          <i className="bi bi-bell"></i>
        </button>
        <button className="icon-btn" title="Language">
          <i className="bi bi-globe"></i>
        </button>
        <button
          onClick={handleLogout}
          className="btn-primary"
          style={{ padding: "6px 16px", fontSize: "0.8125rem" }}
        >
          <i className="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>
    </header>
  );
}
