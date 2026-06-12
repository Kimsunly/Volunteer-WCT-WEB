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
    <div className="container py-4">
      <h4 className="fw-bold mb-5" style={{ color: "#111827" }}>
        Appearance
      </h4>

      {/* Interface Theme */}
      <div className="mb-6 pb-5" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div className="mb-3">
          <h6 className="fw-semibold mb-1" style={{ color: "#111827" }}>
            Interface theme
          </h6>
          <p className="text-muted small">Select or customize your UI theme.</p>
        </div>
        <div className="d-flex gap-4">
          {/* System Preference */}
          <button
            type="button"
            className="p-0 border-0 bg-transparent"
            onClick={() => updateSetting("theme", "light")}
          >
            <div
              className={`p-2 rounded-4 border-3 transition-all ${settings.theme === "light" ? "border-primary" : "border-transparent"}`}
            >
              <div
                style={{
                  width: "180px",
                  height: "120px",
                  borderRadius: "12px",
                  background: `linear-gradient(90deg, #ffffff 50%, #1f2937 50%)`,
                  border: "1px solid #e5e7eb",
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
                    background: "#e5e7eb",
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
                    background: "#f3f4f6",
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
                    background: "#f3f4f6",
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
                      background: "linear-gradient(135deg, #0969DA, #0CB6D6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className="bi bi-check-lg text-white"
                      style={{ fontSize: "16px" }}
                    ></i>
                  </div>
                )}
              </div>
            </div>
            <p
              className="text-center mt-2 small fw-medium"
              style={{ color: "#111827" }}
            >
              System preference
            </p>
          </button>

          {/* Light Mode */}
          <button
            type="button"
            className="p-0 border-0 bg-transparent"
            onClick={() => updateSetting("theme", "light")}
          >
            <div
              className={`p-2 rounded-4 border-3 transition-all ${settings.theme === "light" ? "border-primary" : "border-transparent"}`}
            >
              <div
                style={{
                  width: "180px",
                  height: "120px",
                  borderRadius: "12px",
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
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
                    background: "#e5e7eb",
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
                    background: "#f3f4f6",
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
                    background: "#f3f4f6",
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
                      background: "linear-gradient(135deg, #0969DA, #0CB6D6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className="bi bi-check-lg text-white"
                      style={{ fontSize: "16px" }}
                    ></i>
                  </div>
                )}
              </div>
            </div>
            <p
              className="text-center mt-2 small fw-medium"
              style={{ color: "#111827" }}
            >
              Light
            </p>
          </button>

          {/* Dark Mode */}
          <button
            type="button"
            className="p-0 border-0 bg-transparent"
            onClick={() => updateSetting("theme", "dark")}
          >
            <div
              className={`p-2 rounded-4 border-3 transition-all ${settings.theme === "dark" ? "border-primary" : "border-transparent"}`}
            >
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
                      background: "linear-gradient(135deg, #0969DA, #0CB6D6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className="bi bi-check-lg text-white"
                      style={{ fontSize: "16px" }}
                    ></i>
                  </div>
                )}
              </div>
            </div>
            <p
              className="text-center mt-2 small fw-medium"
              style={{ color: "#111827" }}
            >
              Dark
            </p>
          </button>
        </div>
      </div>

      {/* Brand Color */}
      <div className="mb-6 pb-5" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div className="mb-3">
          <h6 className="fw-semibold mb-1" style={{ color: "#111827" }}>
            Brand color
          </h6>
          <p className="text-muted small">
            Select or customize your brand color.
          </p>
        </div>
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
                    ? "0 0 0 3px rgba(9,105,218,0.2)"
                    : "none",
                border:
                  settings.primaryColor === color
                    ? "3px solid #0969DA"
                    : "none",
              }}
              onClick={() => updateSetting("primaryColor", color)}
            />
          ))}
        </div>
        <div className="d-flex gap-3 align-items-center">
          <label
            className="form-label small fw-medium mb-0 me-2"
            style={{ color: "#6b7280" }}
          >
            Custom color:
          </label>
          <span className="small fw-medium" style={{ color: "#111827" }}>
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
                ? "0 0 0 3px rgba(9,105,218,0.2)"
                : "none",
              border: "3px solid #0969DA",
            }}
          />
        </div>
      </div>

      {/* Language */}
      <div className="mb-6 pb-5" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div className="mb-3">
          <h6 className="fw-semibold mb-1" style={{ color: "#111827" }}>
            Language
          </h6>
          <p className="text-muted small">Select your preferred language.</p>
        </div>
        <div className="d-flex gap-4">
          <button
            type="button"
            className="p-0 border-0 bg-transparent"
            onClick={() => updateSetting("language", "km")}
          >
            <div
              className={`p-3 rounded-3 border-2 transition-all d-flex align-items-center gap-3 ${settings.language === "km" ? "border-primary bg-white" : "border-gray-200 bg-gray-50"}`}
              style={{
                minWidth: "180px",
                borderColor: settings.language === "km" ? "#0969DA" : "#d1d5db",
                boxShadow:
                  settings.language === "km"
                    ? "0 0 0 1px rgba(9, 105, 218, 0.2)"
                    : "none",
              }}
            >
              <img
                src="/images/Icon/Cambodia.png"
                alt="KH"
                style={{ width: "48px", height: "auto" }}
              />
              <span className="fw-semibold" style={{ color: "#111827" }}>
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
              className={`p-3 rounded-3 border-2 transition-all d-flex align-items-center gap-3 ${settings.language === "en" ? "border-primary bg-white" : "border-gray-200 bg-gray-50"}`}
              style={{
                minWidth: "180px",
                borderColor: settings.language === "en" ? "#0969DA" : "#d1d5db",
                boxShadow:
                  settings.language === "en"
                    ? "0 0 0 1px rgba(9, 105, 218, 0.2)"
                    : "none",
              }}
            >
              <img
                src="/images/Icon/england.png"
                alt="EN"
                style={{ width: "48px", height: "auto" }}
              />
              <span className="fw-semibold" style={{ color: "#111827" }}>
                English
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
