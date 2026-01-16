"use client";

import Link from "next/link";
import Image from "next/image";
import { logout as apiLogout } from "@/lib/services/auth";
import { clearAuth } from "@/lib/utils/authState";

export default function AdminNavbar({
  title = "Admin",
  subtitle = "Manage system",
}) {
  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      // Redirect to login page
      window.location.href = "/auth/login";
    }
  };

  return (
    <header
      className="shadow-sm"
      style={{
        background: "var(--top-header)",
        color: "var(--text-white-fixed)",
      }}
    >
      <div className="container-fluid py-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <Image
            src="/logos/logo.png"
            alt="Logo"
            width={40}
            height={40}
            style={{ height: "40px", width: "auto" }}
          />
          <div>
            <div className="fw-bold">{title} • Admin</div>
            <small className="text-white-50">{subtitle}</small>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Link
            className="btn btn-sm btn-outline-light pill"
            href="/admin/dashboard"
          >
            Dashboard
          </Link>
          <button
            className="btn btn-sm btn-light pill"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <i className="bi bi-moon-fill"></i>
          </button>
          <button
            className="btn btn-sm btn-danger pill"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
