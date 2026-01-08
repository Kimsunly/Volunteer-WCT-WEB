"use client";

import Link from "next/link";
import Image from "next/image";

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
        </div>
      </div>
    </header>
  );
}
