"use client";

import React from "react";

export default function SidebarContact() {
  return (
    <>
      <h6>
        <i className="bi bi-headset me-2"></i>
        ត្រូវការជំនួយ?
      </h6>
      <div className="contact-info-list">
        <a href="tel:+85523123456">
          <i className="bi bi-telephone-fill"></i>
          <span>+855 23 123 456</span>
        </a>
        <a href="mailto:donate@volunteerhub.kh">
          <i className="bi bi-envelope-fill"></i>
          <span>donate@volunteerhub.kh</span>
        </a>
        <a href="https://volunteerhub.kh/">
          <i className="bi bi-globe"></i>
          <span>www.volunteerhub.kh</span>
        </a>
      </div>
    </>
  );
}
