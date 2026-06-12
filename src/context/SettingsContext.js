"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: "light",
    language: "km",
    primaryColor: "#4e54c8",
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

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
    if (settings.primaryColor) {
      document.documentElement.style.setProperty("--primary-color", settings.primaryColor);
      document.documentElement.style.setProperty("--btn-primary", settings.primaryColor);
      document.documentElement.style.setProperty("--link-color", settings.primaryColor);
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
