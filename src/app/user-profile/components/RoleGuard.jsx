"use client";

import React from "react";

export default function RoleGuard({ enabled }) {
  if (!enabled) return null;
  return (
    <div className="alert alert-warning d-flex align-items-center" role="alert">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      <div>
        សម្រាប់អ្នកប្រើប្រាស់ដែលបានចូលគណនីប៉ុណ្ណោះ។ សូមចូលគណនីរបស់អ្នកដើម្បីមើល
        និងគ្រប់គ្រងការចុះឈ្មោះ។
      </div>
    </div>
  );
}
``;
