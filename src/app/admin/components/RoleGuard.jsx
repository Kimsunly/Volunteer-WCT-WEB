"use client";

import React, { useEffect, useState } from "react";

// ========================================
// TESTING MODE: Set to true to auto-login as admin
// ========================================
const TESTING_MODE = false;

/**
 * RoleGuard
 * - Front-end only gate: shows banner and disables content if role !== 'admin'
 * - In TESTING_MODE, automatically sets admin credentials
 */
export default function RoleGuard() {
  const [mounted, setMounted] = useState(false);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Auto-set admin credentials in testing mode
    if (TESTING_MODE) {
      // Testing mode disabled in production; left for local tests
      setAllowed(true);
      return;
    }

    const role = localStorage.getItem("role") || "admin";
    setAllowed(role === "admin");
  }, []);

  // Don't render anything until after mount to avoid hydration mismatch
  if (!mounted) return null;
  if (allowed) return null;

  return (
    <div
      className="alert alert-danger d-flex align-items-center mb-3"
      role="alert"
    >
      <i className="bi bi-shield-exclamation me-2"></i>
      <div>Admin access required. Please sign in as admin.</div>
    </div>
  );
}
