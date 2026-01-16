"use client";

import React from "react";
import Image from "next/image";

export default function OpportunityDetailModal({ open, onClose, opportunity, onEdit, onDelete }) {
    if (!open || !opportunity) return null;

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains("modal-backdrop")) {
            onClose();
        }
    };

    return (
        <div
            className="modal fade show"
            style={{ display: "block" }}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="modal-backdrop fade show"
                style={{ zIndex: 1050 }}
                onClick={handleBackdropClick}
            ></div>
            <div
                className="modal-dialog modal-lg modal-dialog-centered"
                style={{ zIndex: 1060 }}
            >
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    {/* Header Image Section */}
                    <div className="position-relative" style={{ height: "240px" }}>
                        <Image
                            src={opportunity.image || "/images/ORG/Tree-conservation.png"}
                            alt={opportunity.titleKh}
                            fill
                            style={{ objectFit: "cover" }}
                            priority
                        />
                        <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                                background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))",
                            }}
                        ></div>
                        <button
                            type="button"
                            className="btn-close btn-close-white position-absolute top-0 end-0 m-3 shadow-sm"
                            style={{ zIndex: 10 }}
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                        <div className="position-absolute bottom-0 start-0 p-4 text-white">
                            <span className="badge bg-primary mb-2">
                                {opportunity.raw?.category_label || "ទિដ្ឋភាពទូទៅ"}
                            </span>
                            <h3 className="mb-0 fw-bold">{opportunity.titleKh}</h3>
                            <p className="mb-0 opacity-75">{opportunity.titleEn}</p>
                        </div>
                    </div>

                    <div className="modal-body p-4 bg-light">
                        <div className="row g-4">
                            {/* Left Column: Core Info */}
                            <div className="col-md-7">
                                <div className="card border-0 shadow-sm rounded-3 p-3 mb-3">
                                    <h6 className="fw-bold text-primary mb-3">
                                        <i className="bi bi-info-circle me-2"></i>ពិពណ៌នា
                                    </h6>
                                    <p className="text-muted mb-0" style={{ whiteSpace: "pre-wrap" }}>
                                        {opportunity.raw?.description || "គ្មានការពិពណ៌នាបង្ហាញ"}
                                    </p>
                                </div>

                                <div className="card border-0 shadow-sm rounded-3 p-3">
                                    <h6 className="fw-bold text-primary mb-3">
                                        <i className="bi bi-plus-circle me-2"></i>ព័ត៌មានបន្ថែម
                                    </h6>
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-center mb-2 text-secondary">
                                                <i className="bi bi-truck me-2"></i>
                                                <small className="fw-bold">ការដឹកជញ្ជូន</small>
                                            </div>
                                            <p className="small mb-0">{opportunity.raw?.transport || "—"}</p>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-center mb-2 text-secondary">
                                                <i className="bi bi-house me-2"></i>
                                                <small className="fw-bold">កន្លែងស្នាក់នៅ</small>
                                            </div>
                                            <p className="small mb-0">{opportunity.raw?.housing || "—"}</p>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-center mb-2 text-secondary">
                                                <i className="bi bi-cup-hot me-2"></i>
                                                <small className="fw-bold">អាហារ</small>
                                            </div>
                                            <p className="small mb-0">{opportunity.raw?.meals || "—"}</p>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-center mb-2 text-secondary">
                                                <i className="bi bi-shield-check me-2"></i>
                                                <small className="fw-bold">ភាពមើលឃើញ</small>
                                            </div>
                                            <p className="small mb-0">
                                                {opportunity.raw?.is_private ? "ឯកជន (Private)" : "សាធារណៈ (Public)"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Quick Stats & Actions */}
                            <div className="col-md-5">
                                <div className="card border-0 shadow-sm rounded-3 p-3 mb-3">
                                    <h6 className="fw-bold text-primary mb-3">
                                        <i className="bi bi-bar-chart-fill me-2"></i>ស្ថានភាពសង្ខេប
                                    </h6>
                                    <div className="d-grid gap-2 mb-3">
                                        <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded border border-light">
                                            <span className="small text-muted">ស្ថានភាព</span>
                                            <span className={`badge ${opportunity.status === 'active' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {opportunity.status === 'active' ? 'សកម្ម' : 'កំពុងរង់ចាំ'}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded border border-light">
                                            <span className="small text-muted">ការចុះឈ្មោះ</span>
                                            <span className="fw-bold">
                                                {opportunity.registrations} / {opportunity.capacity}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="progress mb-2" style={{ height: "8px" }}>
                                        <div
                                            className="progress-bar bg-success"
                                            role="progressbar"
                                            style={{ width: `${(opportunity.registrations / (opportunity.capacity || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                    <small className="text-muted d-block text-center">
                                        {(opportunity.registrations / (opportunity.capacity || 1)) * 100}% បំពេញ
                                    </small>
                                </div>

                                <div className="card border-0 shadow-sm rounded-3 p-3">
                                    <h6 className="fw-bold text-primary mb-3">
                                        <i className="bi bi-geo-alt-fill me-2"></i>ទីតាំង និងកាលបរិច្ឆេទ
                                    </h6>
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-1 text-secondary">
                                            <i className="bi bi-calendar-event me-2"></i>
                                            <small className="fw-bold">កាលបរិច្ឆេទ</small>
                                        </div>
                                        <p className="mb-0">{opportunity.dateKh}</p>
                                        <small className="text-muted">{opportunity.raw?.time_range || "—"}</small>
                                    </div>
                                    <div>
                                        <div className="d-flex align-items-center mb-1 text-secondary">
                                            <i className="bi bi-pin-map-fill me-2"></i>
                                            <small className="fw-bold">ទីតាំង</small>
                                        </div>
                                        <p className="mb-0">{opportunity.locationKh}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer bg-white border-top justify-content-between p-3">
                        <button
                            type="button"
                            className="btn btn-outline-danger px-4 rounded-pill d-flex align-items-center gap-2"
                            onClick={() => {
                                onClose();
                                onDelete && onDelete(opportunity.id);
                            }}
                        >
                            <i className="bi bi-trash"></i> លុប
                        </button>
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-light px-4 rounded-pill"
                                onClick={onClose}
                            >
                                បិទ
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary px-4 rounded-pill d-flex align-items-center gap-2"
                                onClick={() => {
                                    onClose();
                                    onEdit && onEdit(opportunity);
                                }}
                            >
                                <i className="bi bi-pencil-square"></i> កែប្រែព័ត៌មាន
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
