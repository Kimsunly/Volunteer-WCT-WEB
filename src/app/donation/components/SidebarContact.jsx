"use client";

import React from "react";

export default function SidebarContact() {
  return (
    <>
      <h6 className="fw-bold mb-3" style={{ color: "#1f2a37" }}>
        <i className="bi bi-headset me-2 text-primary"></i>
        ត្រូវការជំនួយ?
      </h6>
      <div className="d-flex flex-column gap-3">
        <a
          href="tel:+85523123456"
          className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light text-decoration-none transition-all hover:bg-primary bg-opacity-10"
        >
          <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary">
            <i className="bi bi-telephone-fill"></i>
          </div>
          <span className="fw-medium text-dark">+855 23 123 456</span>
        </a>
        <a
          href="mailto:donate@volunteerhub.kh"
          className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light text-decoration-none transition-all hover:bg-primary bg-opacity-10"
        >
          <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary">
            <i className="bi bi-envelope-fill"></i>
          </div>
          <span className="fw-medium text-dark">donate@volunteerhub.kh</span>
        </a>
        <a
          href="https://volunteerhub.kh/"
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light text-decoration-none transition-all hover:bg-primary bg-opacity-10"
        >
          <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary">
            <i className="bi bi-globe"></i>
          </div>
          <span className="fw-medium text-dark">www.volunteerhub.kh</span>
        </a>
      </div>
    </>
  );
}
