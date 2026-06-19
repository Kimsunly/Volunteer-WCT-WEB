"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

const hexToRgba = (hex, alpha) => {
  if (!hex) return "";
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
    : "";
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: "system",
    language: "km",
    primaryColor: "#A3E635",
    secondaryColor: "#8f94fb",
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("volunteer-settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  // Apply theme and variables to DOM whenever settings change
  useEffect(() => {
    const applyTheme = () => {
      let resolvedTheme = settings.theme;
      if (settings.theme === "system") {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        resolvedTheme = systemPrefersDark ? "dark" : "light";
      }
      document.documentElement.setAttribute("data-theme", resolvedTheme);
    };

    applyTheme();

    if (settings.primaryColor) {
      document.documentElement.style.setProperty("--primary-color", settings.primaryColor);
      document.documentElement.style.setProperty("--btn-primary", settings.primaryColor);
      document.documentElement.style.setProperty("--link-color", settings.primaryColor);
      document.documentElement.style.setProperty("--color-accent", settings.primaryColor);
      
      const dim = hexToRgba(settings.primaryColor, 0.15);
      const glow = hexToRgba(settings.primaryColor, 0.25);
      if (dim) document.documentElement.style.setProperty("--color-accent-dim", dim);
      if (glow) document.documentElement.style.setProperty("--color-accent-glow", glow);
    }
    if (settings.secondaryColor) {
      document.documentElement.style.setProperty("--secondary-color", settings.secondaryColor);
      document.documentElement.style.setProperty("--btn-secondary", settings.secondaryColor);
    }
    if (settings.language) {
      document.documentElement.setAttribute("lang", settings.language);
    }
    // Save to localStorage
    localStorage.setItem("volunteer-settings", JSON.stringify(settings));

    // Listen for system changes if system theme is selected
    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
