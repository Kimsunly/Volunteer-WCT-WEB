"use client";
import { useSettings } from "@/context/SettingsContext";
import Link from "next/link";

export default function TopHeader() {
  const { settings, updateSetting } = useSettings();

  const handleThemeToggle = () => {
    const newTheme = settings.theme === "light" ? "dark" : "light";
    updateSetting("theme", newTheme);
  };

  const handleLanguageChange = (lang) => {
    updateSetting("language", lang);
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
            <li className="me-3">
              <Link
                href="/about"
                className="nav-link p-0 text-white small pe-2"
                style={{ opacity: 0.8 }}
              >
                អំពីយើង
              </Link>
            </li>
            <li>
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
                <button
                  className="dropdown-item"
                  onClick={() => handleLanguageChange("km")}
                  style={{ color: "var(--text-main)", cursor: "pointer" }}
                >
                  <img
                    src="/images/Icon/Cambodia.png"
                    alt="KH"
                    style={{ width: "20px", marginRight: "8px" }}
                  />
                  ភាសាខ្មែរ
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleLanguageChange("en")}
                  style={{ color: "var(--text-main)", cursor: "pointer", border: "none", background: "none", width: "100%", textAlign: "left" }}
                >
                  <img
                    src="/images/Icon/england.png"
                    alt="EN"
                    style={{ width: "20px", marginRight: "8px" }}
                  />
                  English
                </button>
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
              className={settings.theme === "light" ? "bi bi-moon-fill" : "bi bi-sun-fill"}
              style={{ color: "var(--text-white-fixed)" }}
            ></i>
          </button>
        </div>
      </div>
    </div>
  );
}
