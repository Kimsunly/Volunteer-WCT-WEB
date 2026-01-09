"use client";

import React from "react";

export default function SidebarSecurity() {
  return (
    <>
      <h6>
        <i className="bi bi-shield-check me-2"></i>
        ការពារ និងសុវត្ថិភាព
      </h6>
      <div className="security-features">
        <div className="security-item">
          <i className="bi bi-shield-lock-fill"></i>
          <span>ការទូទាត់មានសុវត្ថិភាព</span>
        </div>
        <div className="security-item">
          <i className="bi bi-lock-fill"></i>
          <span>ការពារឯកជនភាពអ្នកបរិច្ចាគ</span>
        </div>
        <div className="security-item">
          <i className="bi bi-file-earmark-lock-fill"></i>
          <span>SSL encrypted transactions</span>
        </div>
      </div>
    </>
  );
}

