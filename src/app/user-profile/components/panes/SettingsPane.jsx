"use client";

import React from "react";
import { useSettings } from "@/context/SettingsContext";

const colorPresets = [
  "#000000",
  "#5E17EB",
  "#6F42C1",
  "#0969DA",
  "#0CB6D6",
  "#1A7F37",
];

export default function SettingsPane() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="container-fluid px-0 py-2">
      <div className="vh-section-card mb-5">
        <h4 className="fw-bold mb-4 card-title-theme">Appearance</h4>
        <p className="text-secondary-theme small mb-0">Customize your workspace appearance settings, theme layout, color palettes, and language preferences.</p>
      </div>

      {/* Interface Theme */}
      <div className="vh-section-card mb-4">
        <div className="mb-4">
          <h6 className="fw-bold mb-1 card-title-theme">Interface theme</h6>
          <p className="text-secondary-theme small">Select or customize your UI theme preference.</p>
        </div>
        <div className="row g-4">
          {/* System Preference */}
          <div className="col-md-4 col-sm-6">
            <button
              type="button"
              className="p-0 border-0 bg-transparent w-100 text-start"
              onClick={() => updateSetting("theme", "system")}
            >
              <div
                className={`theme-card-outer ${settings.theme === "system" ? "active" : ""}`}
              >
                <div className="theme-preview-card system-preview">
                  <div className="mock-window-dots">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                  </div>
                  <div className="mock-layout-lines">
                    <span className="line-long"></span>
                    <span className="line-mid"></span>
                    <span className="line-short"></span>
                  </div>
                  {settings.theme === "system" && (
                    <div className="active-check-badge">
                      <i className="bi bi-check-lg"></i>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-center mt-3 small fw-semibold theme-label-text">
                System preference
              </p>
            </button>
          </div>

          {/* Light Mode */}
          <div className="col-md-4 col-sm-6">
            <button
              type="button"
              className="p-0 border-0 bg-transparent w-100 text-start"
              onClick={() => updateSetting("theme", "light")}
            >
              <div
                className={`theme-card-outer ${settings.theme === "light" ? "active" : ""}`}
              >
                <div className="theme-preview-card light-preview">
                  <div className="mock-window-dots">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                  </div>
                  <div className="mock-layout-lines">
                    <span className="line-long"></span>
                    <span className="line-mid"></span>
                    <span className="line-short"></span>
                  </div>
                  {settings.theme === "light" && (
                    <div className="active-check-badge">
                      <i className="bi bi-check-lg"></i>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-center mt-3 small fw-semibold theme-label-text">
                Light
              </p>
            </button>
          </div>

          {/* Dark Mode */}
          <div className="col-md-4 col-sm-6">
            <button
              type="button"
              className="p-0 border-0 bg-transparent w-100 text-start"
              onClick={() => updateSetting("theme", "dark")}
            >
              <div
                className={`theme-card-outer ${settings.theme === "dark" ? "active" : ""}`}
              >
                <div className="theme-preview-card dark-preview">
                  <div className="mock-window-dots">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                  </div>
                  <div className="mock-layout-lines">
                    <span className="line-long"></span>
                    <span className="line-mid"></span>
                    <span className="line-short"></span>
                  </div>
                  {settings.theme === "dark" && (
                    <div className="active-check-badge">
                      <i className="bi bi-check-lg"></i>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-center mt-3 small fw-semibold theme-label-text">
                Dark
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Brand Color */}
      <div className="vh-section-card mb-4">
        <div className="mb-4">
          <h6 className="fw-bold mb-1 card-title-theme">Brand color</h6>
          <p className="text-secondary-theme small">Select or customize your brand accent color scheme.</p>
        </div>
        <div className="d-flex gap-3 align-items-center flex-wrap mb-4">
          {colorPresets.map((color, index) => (
            <button
              key={index}
              type="button"
              className={`p-0 border-0 rounded-circle color-preset-circle ${settings.primaryColor === color ? "active" : ""}`}
              style={{
                width: "38px",
                height: "38px",
                background: color,
              }}
              onClick={() => updateSetting("primaryColor", color)}
            >
              {settings.primaryColor === color && (
                <i className="bi bi-check-lg text-white preset-check-icon"></i>
              )}
            </button>
          ))}
        </div>
        <div className="d-flex gap-3 align-items-center custom-color-picker-wrap">
          <label className="form-label small fw-semibold mb-0 text-secondary-theme">
            Custom color:
          </label>
          <span className="small fw-bold custom-color-val">
            {settings.primaryColor}
          </span>
          <div className="color-picker-input-container">
            <input
              type="color"
              className="p-0 border-0 color-input"
              value={settings.primaryColor}
              onChange={(e) => updateSetting("primaryColor", e.target.value)}
            />
            <div className="color-input-overlay" style={{ backgroundColor: settings.primaryColor }}></div>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="vh-section-card mb-4">
        <div className="mb-4">
          <h6 className="fw-bold mb-1 card-title-theme">Language</h6>
          <p className="text-secondary-theme small">Select your preferred system language.</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4 col-sm-6">
            <button
              type="button"
              className="p-0 border-0 bg-transparent w-100 text-start"
              onClick={() => updateSetting("language", "km")}
            >
              <div
                className={`p-3 rounded-4 border-2 transition-all d-flex align-items-center gap-3 lang-card-outer ${settings.language === "km" ? "active" : ""}`}
              >
                <div className="flag-img-wrap">
                  <img
                    src="/images/Icon/Cambodia.png"
                    alt="KH"
                    style={{ width: "38px", height: "auto", objectFit: "contain" }}
                  />
                </div>
                <div className="min-width-0">
                  <span className="fw-bold d-block text-primary-theme">ភាសាខ្មែរ</span>
                  <span className="small text-secondary-theme">Khmer</span>
                </div>
                {settings.language === "km" && (
                  <div className="lang-active-dot"></div>
                )}
              </div>
            </button>
          </div>

          <div className="col-md-4 col-sm-6">
            <button
              type="button"
              className="p-0 border-0 bg-transparent w-100 text-start"
              onClick={() => updateSetting("language", "en")}
            >
              <div
                className={`p-3 rounded-4 border-2 transition-all d-flex align-items-center gap-3 lang-card-outer ${settings.language === "en" ? "active" : ""}`}
              >
                <div className="flag-img-wrap">
                  <img
                    src="/images/Icon/england.png"
                    alt="EN"
                    style={{ width: "38px", height: "auto", objectFit: "contain" }}
                  />
                </div>
                <div className="min-width-0">
                  <span className="fw-bold d-block text-primary-theme">English</span>
                  <span className="small text-secondary-theme">English</span>
                </div>
                {settings.language === "en" && (
                  <div className="lang-active-dot"></div>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .vh-section-card {
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 20px !important;
          box-shadow: var(--shadow-card) !important;
          padding: 28px !important;
          transition: all 0.3s ease;
        }
        .vh-section-card:hover {
          border-color: var(--color-border-hover) !important;
        }

        .card-title-theme {
          color: var(--color-text-primary) !important;
        }
        .text-secondary-theme {
          color: var(--color-text-secondary) !important;
        }
        .text-primary-theme {
          color: var(--color-text-primary) !important;
        }
        .text-accent-theme {
          color: var(--color-accent) !important;
        }

        /* Theme selection preview card styling */
        .theme-card-outer {
          border: 2px solid var(--color-border);
          border-radius: 18px;
          padding: 6px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .theme-card-outer.active {
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 12px var(--color-accent-glow) !important;
        }
        .theme-card-outer:hover {
          border-color: var(--color-border-hover);
          transform: translateY(-2px);
        }
        .theme-card-outer.active:hover {
          border-color: var(--color-accent) !important;
        }

        .theme-preview-card {
          height: 120px;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        /* Layout line animations in preview cards */
        .mock-window-dots {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          gap: 6px;
        }
        .mock-window-dots .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .dot-red { background-color: #ef4444; }
        .dot-yellow { background-color: #f59e0b; }
        .dot-green { background-color: #10b981; }

        .mock-layout-lines {
          position: absolute;
          top: 38px;
          left: 12px;
          right: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mock-layout-lines span {
          height: 8px;
          border-radius: 4px;
        }
        
        /* System Theme Preview Styling */
        .system-preview {
          background: linear-gradient(90deg, #ffffff 50%, #1f2937 50%);
        }
        .system-preview .line-long { background-color: #e5e7eb; }
        .system-preview .line-mid { background-color: #d1d5db; }
        .system-preview .line-short { background-color: #d1d5db; }

        /* Light Theme Preview Styling */
        .light-preview {
          background-color: #ffffff;
        }
        .light-preview .line-long { background-color: #e5e7eb; }
        .light-preview .line-mid { background-color: #f3f4f6; }
        .light-preview .line-short { background-color: #f3f4f6; }
        .light-preview .mock-layout-lines span {
          box-shadow: inset 0 0 1px rgba(0,0,0,0.05);
        }

        /* Dark Theme Preview Styling */
        .dark-preview {
          background-color: #1f2937;
        }
        .dark-preview .line-long { background-color: #4b5563; }
        .dark-preview .line-mid { background-color: #374151; }
        .dark-preview .line-short { background-color: #374151; }

        .active-check-badge {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--color-accent) !important;
          color: #000000 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 2px 8px var(--color-accent-glow);
          animation: scale-up 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes scale-up {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        .theme-label-text {
          color: var(--color-text-primary) !important;
        }

        /* Color presets circle styling */
        .color-preset-circle {
          position: relative;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .color-preset-circle.active {
          box-shadow: 0 0 0 3px var(--color-text-primary), 0 0 12px var(--color-accent-glow) !important;
          transform: scale(1.1);
        }
        .color-preset-circle:hover {
          transform: scale(1.15);
        }
        .preset-check-icon {
          font-size: 16px;
          font-weight: 700;
        }

        /* Custom color picker formatting */
        .custom-color-picker-wrap {
          border-top: 1px solid var(--color-border);
          padding-top: 20px;
        }
        
        .custom-color-val {
          color: var(--color-text-primary) !important;
          background-color: var(--color-bg-input);
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
        }
        
        .color-picker-input-container {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--color-border);
          cursor: pointer;
        }
        .color-input {
          position: absolute;
          top: -10px;
          left: -10px;
          width: 60px;
          height: 60px;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
        }
        .color-input-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        /* Flag / language styling */
        .lang-card-outer {
          border-color: var(--color-border) !important;
          background-color: var(--color-bg-input) !important;
          cursor: pointer;
          position: relative;
          width: 100%;
          height: 100%;
        }
        .lang-card-outer.active {
          border-color: var(--color-accent) !important;
          background-color: var(--color-bg-card) !important;
          box-shadow: 0 0 10px var(--color-accent-glow) !important;
        }
        .lang-card-outer:hover {
          border-color: var(--color-border-hover) !important;
          transform: translateY(-2px);
        }
        .lang-card-outer.active:hover {
          border-color: var(--color-accent) !important;
        }

        .flag-img-wrap {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .lang-active-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--color-accent);
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          box-shadow: 0 0 8px var(--color-accent-glow);
        }
      `}</style>
    </div>
  );
}
