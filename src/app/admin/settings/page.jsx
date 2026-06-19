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
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appearance</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "4px" }}>
            Customize your admin dashboard look
          </p>
        </div>
      </div>

      {/* Interface Theme */}
      <div className="card">
        <div className="card-header" style={{ marginBottom: "16px" }}>
          <div>
            <h5 className="card-title" style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "var(--color-text-primary)" }}>Interface theme</h5>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.8125rem", margin: "4px 0 0 0" }}>Select or customize your UI theme.</p>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-6">
            {/* System Preference */}
            <button
              type="button"
              className="p-0 border-0 bg-transparent"
              onClick={() => updateSetting("theme", "system")}
              style={{ cursor: "pointer", textAlign: "left" }}
            >
              <div 
                className="transition-all"
                style={{
                  padding: "8px",
                  borderRadius: "16px",
                  border: "3px solid",
                  borderColor: settings.theme === "system" ? "var(--color-accent)" : "transparent",
                }}
              >
                <div
                  style={{
                    width: "180px",
                    height: "120px",
                    borderRadius: "12px",
                    background: "linear-gradient(90deg, #ffffff 50%, #1e1e1e 50%)",
                    border: "1px solid var(--color-border)",
                    position: "relative",
                  }}
                >
                  <div style={{ position: "absolute", top: "10px", left: "10px", width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }}></div>
                  <div style={{ position: "absolute", top: "10px", left: "30px", width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }}></div>
                  <div style={{ position: "absolute", top: "10px", left: "50px", width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }}></div>
                  <div style={{ position: "absolute", top: "40px", left: "15px", right: "15px", height: "12px", borderRadius: "4px", background: "var(--color-border)" }}></div>
                  <div style={{ position: "absolute", top: "60px", left: "15px", right: "40px", height: "12px", borderRadius: "4px", background: "var(--color-bg-input)" }}></div>
                  <div style={{ position: "absolute", top: "80px", left: "15px", right: "60px", height: "12px", borderRadius: "4px", background: "var(--color-bg-input)" }}></div>
                  {settings.theme === "system" && (
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
                      <i className="bi bi-check-lg" style={{ color: "#000000", fontWeight: "bold" }}></i>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-center mt-2 small" style={{ color: "var(--color-text-primary)", fontWeight: "500", margin: "8px 0 0 0", textAlign: "center" }}>
                System preference
              </p>
            </button>

            {/* Light Mode */}
            <button
              type="button"
              className="p-0 border-0 bg-transparent"
              onClick={() => updateSetting("theme", "light")}
              style={{ cursor: "pointer", textAlign: "left" }}
            >
              <div 
                className="transition-all"
                style={{
                  padding: "8px",
                  borderRadius: "16px",
                  border: "3px solid",
                  borderColor: settings.theme === "light" ? "var(--color-accent)" : "transparent",
                }}
              >
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
                        background: "var(--color-accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="bi bi-check-lg" style={{ color: "#000000", fontWeight: "bold" }}></i>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-center mt-2 small" style={{ color: "var(--color-text-primary)", fontWeight: "500", margin: "8px 0 0 0", textAlign: "center" }}>
                Light
              </p>
            </button>

            {/* Dark Mode */}
            <button
              type="button"
              className="p-0 border-0 bg-transparent"
              onClick={() => updateSetting("theme", "dark")}
              style={{ cursor: "pointer", textAlign: "left" }}
            >
              <div 
                className="transition-all"
                style={{
                  padding: "8px",
                  borderRadius: "16px",
                  border: "3px solid",
                  borderColor: settings.theme === "dark" ? "var(--color-accent)" : "transparent",
                }}
              >
                <div
                  style={{
                    width: "180px",
                    height: "120px",
                    borderRadius: "12px",
                    background: "#1e1e1e",
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
                      background: "var(--color-bg-input)",
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
                      background: "var(--color-border)",
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
                      background: "var(--color-border)",
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
                      <i className="bi bi-check-lg" style={{ color: "#000000", fontWeight: "bold" }}></i>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-center mt-2 small" style={{ color: "var(--color-text-primary)", fontWeight: "500", margin: "8px 0 0 0", textAlign: "center" }}>
                Dark
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Brand Color */}
      <div className="card">
        <div className="card-header" style={{ marginBottom: "16px" }}>
          <div>
            <h5 className="card-title" style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "var(--color-text-primary)" }}>Brand color</h5>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.8125rem", margin: "4px 0 0 0" }}>Select or customize your brand color.</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
            {colorPresets.map((color, index) => (
              <button
                key={index}
                type="button"
                className="p-0 border-0 rounded-circle"
                style={{
                  width: "36px",
                  height: "36px",
                  background: color,
                  borderRadius: "50%",
                  cursor: "pointer",
                  boxShadow:
                    settings.primaryColor === color
                      ? "0 0 0 3px var(--color-accent-glow)"
                      : "none",
                  border:
                    settings.primaryColor === color
                      ? "3px solid var(--color-accent)"
                      : "1px solid var(--color-border)",
                  transition: "all 0.15s ease",
                }}
                onClick={() => updateSetting("primaryColor", color)}
              />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label
              style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", fontWeight: "500", margin: 0 }}
            >
              Custom color:
            </label>
            <span style={{ fontSize: "0.875rem", color: "var(--color-text-primary)", fontWeight: "600" }}>
              {settings.primaryColor}
            </span>
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => updateSetting("primaryColor", e.target.value)}
              style={{
                width: "40px",
                height: "40px",
                padding: "4px",
                borderRadius: "50%",
                background: "var(--color-bg-input)",
                border: "1px solid var(--color-border)",
                cursor: "pointer",
                boxShadow: "var(--shadow-card)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="card">
        <div className="card-header" style={{ marginBottom: "16px" }}>
          <div>
            <h5 className="card-title" style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "var(--color-text-primary)" }}>Language</h5>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.8125rem", margin: "4px 0 0 0" }}>Select your preferred language.</p>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-6">
            <button
              type="button"
              className="p-0 border-0 bg-transparent"
              onClick={() => updateSetting("language", "km")}
              style={{ cursor: "pointer" }}
            >
              <div
                className="transition-all flex items-center gap-3"
                style={{
                  minWidth: "180px",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "2px solid",
                  borderColor: settings.language === "km" ? "var(--color-accent)" : "var(--color-border)",
                  background: settings.language === "km" ? "var(--color-accent-dim)" : "var(--color-bg-card)",
                }}
              >
                <img
                  src="/images/Icon/Cambodia.png"
                  alt="KH"
                  style={{ width: "40px", height: "auto", borderRadius: "4px" }}
                />
                <span style={{ color: "var(--color-text-primary)", fontWeight: "600", fontSize: "0.875rem" }}>
                  ភាសាខ្មែរ
                </span>
              </div>
            </button>

            <button
              type="button"
              className="p-0 border-0 bg-transparent"
              onClick={() => updateSetting("language", "en")}
              style={{ cursor: "pointer" }}
            >
              <div
                className="transition-all flex items-center gap-3"
                style={{
                  minWidth: "180px",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "2px solid",
                  borderColor: settings.language === "en" ? "var(--color-accent)" : "var(--color-border)",
                  background: settings.language === "en" ? "var(--color-accent-dim)" : "var(--color-bg-card)",
                }}
              >
                <img
                  src="/images/Icon/england.png"
                  alt="EN"
                  style={{ width: "40px", height: "auto", borderRadius: "4px" }}
                />
                <span style={{ color: "var(--color-text-primary)", fontWeight: "600", fontSize: "0.875rem" }}>
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
