"use client";
import { useState } from "react";
import Link from "next/link";

export default function TopHeader() {
  const [theme, setTheme] = useState("light");

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div
      className="top-header"
      style={{
        backgroundColor: "var(--top-header)",
        color: "var(--text-white-fixed)",
      }}
    >
      <div className="container d-flex justify-content-between align-items-center py-2">
        {/* Social Links */}
        <div className="d-none d-lg-flex align-items-center">
          <ul className="list-unstyled d-flex m-0 me-4 footer-social">
            <li className="me-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="bi bi-facebook"></i>
              </a>
            </li>
            <li className="me-3">
              <a
                href="https://telegram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <i className="bi bi-telegram"></i>
              </a>
            </li>
            <li className="me-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="bi bi-instagram"></i>
              </a>
            </li>
          </ul>

          {/* Quick Links */}
          <ul className="nav-list list-unstyled d-flex m-0">
            <li className="nav-item me-3">
              <Link
                href="/about"
                className="nav-link p-0 text-white small pe-2"
                style={{ opacity: 0.8 }}
              >
                អំពីយើង
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/contact"
                className="nav-link p-0 text-white small pe-2"
                style={{ opacity: 0.8 }}
              >
                ទំនាក់ទំនង
              </Link>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <Link
          href="/"
          className="d-none d-lg-flex text-center mx-auto align-items-center logo-container text-decoration-none"
          style={{ cursor: "pointer" }}
        >
          <img
            src="/logos/logo.png"
            alt="Logo"
            style={{ height: "35px", width: "auto", borderRadius: "2px" }}
          />
          <div>
            <h5
              className="m-0 fw-bold small"
              style={{ color: "var(--text-white-fixed)" }}
            >
              ស្ម័គ្រចិត្ត
            </h5>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="nav-action d-flex align-items-center">
          {/* Search */}
          <button
            type="button"
            className="btn border-0 me-3 d-none d-lg-block"
            data-bs-toggle="collapse"
            data-bs-target="#searchBar"
            aria-label="Toggle Search"
          >
            <i
              className="bi bi-search"
              style={{ color: "var(--text-white-fixed)" }}
            ></i>
          </button>

          {/* Language */}
          <div className="dropdown me-3">
            <button
              className="btn btn-sm dropdown-toggle border-0 p-0"
              type="button"
              id="languageDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ color: "var(--text-white-fixed)", background: "none" }}
            >
              <i className="bi bi-globe2 me-1"></i>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="languageDropdown"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <li>
                <a
                  className="dropdown-item"
                  href="#km"
                  style={{ color: "var(--text-main)", cursor: "pointer" }}
                >
                  <img
                    src="/images/Icon/Cambodia.png"
                    alt="KH"
                    style={{ width: "20px", marginRight: "8px" }}
                  />
                  ភាសាខ្មែរ
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#en"
                  style={{ color: "var(--text-main)", cursor: "pointer" }}
                >
                  <img
                    src="/images/Icon/england.png"
                    alt="EN"
                    style={{ width: "20px", marginRight: "8px" }}
                  />
                  English
                </a>
              </li>
            </ul>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            className="btn border-0 p-0"
            onClick={handleThemeToggle}
            aria-label="Change theme"
          >
            <i
              className="bi bi-moon-fill"
              style={{ color: "var(--text-white-fixed)" }}
            ></i>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div
        className="collapse bg-white"
        id="searchBar"
        style={{ backgroundColor: "var(--navabr) !important" }}
      >
        <div className="container py-2">
          <form className="position-relative">
            <input
              type="text"
              className="form-control ps-5"
              placeholder="ស្វែងរកឱកាស ព្រឹត្តិការណ៍ ឬសកម្មភាព..."
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-main)",
              }}
            />
            <i
              className="bi bi-search position-absolute top-50 translate-middle-y ms-3"
              style={{ color: "var(--text-muted)" }}
            ></i>
          </form>
        </div>
      </div>
    </div>
  );
}
