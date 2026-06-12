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
  "#A3E635", // our lime green
];

export default function AdminSettingsPage() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appearance</h1>
          <p className="page-subtitle">Customize your admin dashboard look</p>
        </div>
      </div>

      {/* Interface Theme */}
      <div className="card mb-6">
        <div className="card-header">
          <h5 className="card-title">Interface theme</h5>
          <p className="card-description">Select or customize your UI theme.</p>
        </div>
        <div className="card-body">
          <div className="d-flex gap-4 flex-wrap">
            {/* System/Light Mode */}
            <button
              type="button"
              className="p-0 border-0 bg-transparent"
              onClick={() => updateSetting("theme", "light")}
            >
              <div className={`p-2 rounded-4 border-3 transition-all ${settings.theme === "light" ? "border-accent" : "border-transparent"}`}>
                <div
                  style={{
                    width: "180px",
                    height: "120px",
                    borderRadius: "12px",
                    background: "#ffffff",
                    border: "1px solid var(--color-border)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#ef4444",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "30px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#f59e0b",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "50px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#10b981",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "40px",
                      left: "15px",
                      right: "15px",
                      height: "12px",
                      borderRadius: "4px",
                      background: "var(--color-border)",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "60px",
                      left: "15px",
                      right: "40px",
                      height: "12px",
                      borderRadius: "4px",
                      background: "var(--color-border-light)",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "80px",
                      left: "15px",
                      right: "60px",
                      height: "12px",
                      borderRadius: "4px",
                      background: "var(--color-border-light)",
                    }}
                  ></div>
                  {settings.theme === "light" && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "var(--color-accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="bi bi-check-lg text-white"></i>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-center mt-2 small fw-medium" style={{ color: "var(--color-text-primary)" }}>
                Light
              </p>
            </button>

            {/* Dark Mode */}
            <button
              type="button"
              className="p-0 border-0 bg-transparent"
              onClick={() => updateSetting("theme", "dark")}
            >
              <div className={`p-2 rounded-4 border-3 transition-all ${settings.theme === "dark" ? "border-accent" : "border-transparent"}`}>
                <div
                  style={{
                    width: "180px",
                    height: "120px",
                    borderRadius: "12px",
                    background: "#1f2937",
                    border: "1px solid #374151",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#ef4444",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "30px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#f59e0b",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "50px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#10b981",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "40px",
                      left: "15px",
                      right: "15px",
                      height: "12px",
                      borderRadius: "4px",
                      background: "#4b5563",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "60px",
                      left: "15px",
                      right: "40px",
                      height: "12px",
                      borderRadius: "4px",
                      background: "#374151",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "80px",
                      left: "15px",
                      right: "60px",
                      height: "12px",
                      borderRadius: "4px",
                      background: "#374151",
                    }}
                  ></div>
                  {settings.theme === "dark" && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "var(--color-accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="bi bi-check-lg text-white"></i>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-center mt-2 small fw-medium" style={{ color: "var(--color-text-primary)" }}>
                Dark
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Brand Color */}
      <div className="card mb-6">
        <div className="card-header">
          <h5 className="card-title">Brand color</h5>
          <p className="card-description">Select or customize your brand color.</p>
        </div>
        <div className="card-body">
          <div className="d-flex gap-3 align-items-center mb-3">
            {colorPresets.map((color, index) => (
              <button
                key={index}
                type="button"
                className="p-0 border-0 rounded-circle"
                style={{
                  width: "32px",
                  height: "32px",
                  background: color,
                  boxShadow:
                    settings.primaryColor === color
                      ? "0 0 0 3px rgba(163,230,53,0.2)"
                      : "none",
                  border:
                    settings.primaryColor === color
                      ? "3px solid var(--color-accent)"
                      : "none",
                }}
                onClick={() => updateSetting("primaryColor", color)}
              />
            ))}
          </div>
          <div className="d-flex gap-3 align-items-center">
            <label
              className="form-label small fw-medium mb-0 me-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Custom color:
            </label>
            <span className="small fw-medium" style={{ color: "var(--color-text-primary)" }}>
              {settings.primaryColor}
            </span>
            <input
              type="color"
              className="form-control-color p-0 border-0"
              value={settings.primaryColor}
              onChange={(e) => updateSetting("primaryColor", e.target.value)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                boxShadow: settings.primaryColor
                  ? "0 0 0 3px rgba(163,230,53,0.2)"
                  : "none",
                border: "3px solid var(--color-accent)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="card mb-6">
        <div className="card-header">
          <h5 className="card-title">Language</h5>
          <p className="card-description">Select your preferred language.</p>
        </div>
        <div className="card-body">
          <div className="d-flex gap-4 flex-wrap">
            <button
              type="button"
              className="p-0 border-0 bg-transparent"
              onClick={() => updateSetting("language", "km")}
            >
              <div
                className={`p-3 rounded-3 border-2 transition-all d-flex align-items-center gap-3 ${settings.language === "km" ? "border-accent" : "border-gray-200"}`}
                style={{
                  minWidth: "180px",
                  borderColor: settings.language === "km" ? "var(--color-accent)" : "var(--color-border)",
                  background: settings.language === "km" ? "var(--color-surface)" : "var(--color-surface-secondary)",
                  boxShadow:
                    settings.language === "km"
                      ? "0 0 0 1px rgba(163,230,53,0.2)"
                      : "none",
                }}
              >
                <img
                  src="/images/Icon/Cambodia.png"
                  alt="KH"
                  style={{ width: "48px", height: "auto" }}
                />
                <span className="fw-semibold" style={{ color: "var(--color-text-primary)" }}>
                  ភាសាខ្មែរ
                </span>
              </div>
            </button>

            <button
              type="button"
              className="p-0 border-0 bg-transparent"
              onClick={() => updateSetting("language", "en")}
            >
              <div
                className={`p-3 rounded-3 border-2 transition-all d-flex align-items-center gap-3 ${settings.language === "en" ? "border-accent" : "border-gray-200"}`}
                style={{
                  minWidth: "180px",
                  borderColor: settings.language === "en" ? "var(--color-accent)" : "var(--color-border)",
                  background: settings.language === "en" ? "var(--color-surface)" : "var(--color-surface-secondary)",
                  boxShadow:
                    settings.language === "en"
                      ? "0 0 0 1px rgba(163,230,53,0.2)"
                      : "none",
                }}
              >
                <img
                  src="/images/Icon/england.png"
                  alt="EN"
                  style={{ width: "48px", height: "auto" }}
                />
                <span className="fw-semibold" style={{ color: "var(--color-text-primary)" }}>
                  English
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
