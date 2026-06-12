"use client";

import React from "react";
import Image from "next/image";

export default function QRDonateModal({ open, onClose, hospital }) {
  if (!open) return null;

  return (
    <div
      className="modal fade show d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
        padding: "20px 0",
      }}
      role="dialog"
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "700px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content"
          style={{
            borderRadius: "24px",
            border: "none",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          }}
        >
          <div className="modal-header border-0 pb-0">
            <h5
              className="modal-title fw-bold fs-3"
              style={{ color: "#1f2a37" }}
            >
              <i
                className="bi bi-qr-code-scan me-2"
                style={{ color: "#667eea" }}
              ></i>
              ស្កែន QR Code ដើម្បីបរិច្ចាគ
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
              style={{ fontSize: "1.5rem" }}
            ></button>
          </div>
          <div className="modal-body">
            {/* Hospital Header */}
            <div className="mb-4">
              <h4 className="fw-bold mb-2" style={{ color: "#1f2a37" }}>
                {hospital.name}
              </h4>
              <p className="text-muted mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt"></i> {hospital.location}
              </p>
              <p className="text-muted mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-calendar"></i> បង្កើតនៅ {hospital.founded}
              </p>
            </div>

            {/* Description & Mission */}
            <div className="mb-4">
              <h6 className="fw-semibold mb-2" style={{ color: "#374151" }}>
                អំពីមន្ទីរពេទ្យ
              </h6>
              <p className="text-secondary mb-3" style={{ lineHeight: "1.7" }}>
                {hospital.description}
              </p>
              <p
                className="text-secondary mb-3"
                style={{ lineHeight: "1.7", fontWeight: 500 }}
              >
                <i className="bi bi-bullseye me-2 text-primary"></i>
                {hospital.mission}
              </p>
            </div>

            {/* Services */}
            <div className="mb-4">
              <h6 className="fw-semibold mb-3" style={{ color: "#374151" }}>
                សេវាដែលផ្តល់
              </h6>
              <div className="row g-2">
                {hospital.services.map((service, index) => (
                  <div key={index} className="col-12 col-md-6">
                    <div
                      className="d-flex align-items-center gap-2 p-2 rounded-3"
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span className="small text-secondary">{service}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center mt-4 pt-4 border-top">
              <h6 className="fw-semibold mb-3" style={{ color: "#374151" }}>
                ស្កែនដើម្បីបរិច្ចាគ
              </h6>
              <div className="d-flex justify-content-center mb-3">
                <div
                  style={{
                    width: "300px",
                    height: "300px",
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <Image
                    src={hospital.qrImage}
                    alt={`${hospital.name} QR Code`}
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: "0.95rem" }}>
                សូមស្កែន QR Code ដើម្បីបរិច្ចាគដោយផ្ទាល់ទៅកាន់ {hospital.name}
              </p>
            </div>
          </div>
          <div className="modal-footer border-0 justify-content-center pt-0 pb-4">
            <button
              type="button"
              className="btn btn-lg"
              onClick={onClose}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "14px 36px",
                borderRadius: "12px",
                fontWeight: 700,
                border: "none",
              }}
            >
              <i className="bi bi-check-circle-fill me-2"></i>
              យល់ព្រម
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
