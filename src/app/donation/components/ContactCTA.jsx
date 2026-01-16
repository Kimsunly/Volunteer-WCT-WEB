"use client";

import React from "react";
import Link from "next/link";

export default function ContactCTA() {
  return (
    <div
      className="mt-5 p-4 rounded-4 text-center"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        boxShadow: "0 10px 40px rgba(102, 126, 234, 0.3)",
      }}
      data-aos="fade-up"
      data-aos-delay="700"
    >
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-3 text-white">
        <i className="bi bi-chat-dots-fill" style={{ fontSize: "3rem" }}></i>
        <div className="text-center text-md-start">
          <h4 className="fw-bold mb-1">មានសំណួរផ្សេងទៀត?</h4>
          <p className="mb-0">ទាក់ទងមកយើង ហើយយើងនឹងជួយឆ្លើយសំណួររបស់អ្នក</p>
        </div>
        <Link
          href="/contact"
          className="btn btn-light px-4 py-2 fw-bold"
          style={{ borderRadius: 50, boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
        >
          ទាក់ទង
        </Link>
      </div>
    </div>
  );
}
