"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function AccountSettingsModal({ open, onClose }) {
  const [avatarUrl, setAvatarUrl] = useState(
    "/images/ORG/computer-icons-user-profile-circle-abstract.jpg"
  );
  const [about, setAbout] = useState("");
  const aboutMax = 400;
  const fileInputRef = useRef(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Clean up created object URLs
  useEffect(() => {
    return () => {
      if (avatarUrl && avatarUrl.startsWith("blob:"))
        URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);

  if (!open) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const close = () => onClose?.();

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={close}
        style={{ zIndex: 1050 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        style={{
          display: "block",
          zIndex: 1055,
          overflow: "auto",
        }}
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow-lg rounded-4">
            {/* Modal Header */}
            <div
              className="modal-header p-4 text-white"
              style={{
                background: "linear-gradient(90deg, #4e54c8, #8f94fb)",
                borderBottom: "none",
              }}
            >
              <h6 className="modal-title fw-bold mb-0" id="accSetTitle">
                ការកំណត់គណនី /{" "}
                <span className="fw-normal">Account Settings</span>
              </h6>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={close}
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body p-4">
              {/* Avatar Upload */}
              <div className="d-flex align-items-center justify-content-center mb-4">
                <label className="vh-avatar-uploader mb-0 position-relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <span
                    className="vh-avatar ring rounded-circle overflow-hidden d-block"
                    role="img"
                    aria-label="avatar"
                  >
                    <Image
                      src={avatarUrl}
                      alt="រូបភាព"
                      className="w-100 h-100 object-fit-cover"
                      width={120}
                      height={120}
                    />
                  </span>
                  <span className="small d-block mt-2 text-center text-muted">
                    ជ្រើសរើសរូបភាព
                  </span>
                </label>
              </div>

              {/* Personal Info Section */}
              <div className="mb-4">
                <h6 className="fw-bold text-secondary mb-3">
                  ព័ត៌មានផ្ទាល់ខ្លួន / Personal Info
                </h6>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label
                        className="form-label fw-medium"
                        htmlFor="firstName"
                      >
                        នាមខ្លួន
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="ឧ. សុភា"
                      />
                    </div>

                    <div className="col-sm-6">
                      <label
                        className="form-label fw-medium"
                        htmlFor="lastName"
                      >
                        នាមត្រកូល
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="ឧ. ចាន់"
                      />
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label fw-medium" htmlFor="email">
                        អ៊ីមែល
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-envelope-fill"></i>
                        </span>
                        <input
                          id="email"
                          type="email"
                          className="form-control form-control-lg"
                          placeholder="sophea.chan@email.com"
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label fw-medium" htmlFor="phone">
                        ទូរស័ព្ទ
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-telephone-fill"></i>
                        </span>
                        <input
                          id="phone"
                          type="tel"
                          className="form-control form-control-lg"
                          placeholder="+855 23 123 456"
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <label
                        className="form-label fw-medium"
                        htmlFor="location"
                      >
                        ទីតាំង
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-geo-alt-fill"></i>
                        </span>
                        <input
                          id="location"
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="Phnom Penh"
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label fw-medium" htmlFor="dob">
                        ថ្ងៃខែឆ្នាំកំណើត
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-calendar-event-fill"></i>
                        </span>
                        <input
                          id="dob"
                          type="date"
                          className="form-control form-control-lg"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium" htmlFor="aboutMe">
                        ពីអំពីខ្ញុំ
                      </label>
                      <textarea
                        id="aboutMe"
                        className="form-control form-control-lg"
                        rows={3}
                        maxLength={aboutMax}
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="សូមពិពណ៌នាខ្លីៗអំពីបទពិសោធន៍ និងចំណាប់អារម្មណ៍…"
                      />
                      <div className="d-flex justify-content-end mt-1">
                        <small>
                          {about.length}/{aboutMax}
                        </small>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium" htmlFor="skills">
                        ជំនាញ
                      </label>
                      <input
                        id="skills"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="ឧ. ការទំនាក់ទំនង, ការបណ្តុះបណ្តា, ការរៀបចំព្រឹត្តិការណ៍"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Availability Section */}
              <div className="mb-4">
                <h6 className="fw-bold text-secondary mb-3">
                  ការស្រេចចិត្ត/អាចចូលរួម / Availability
                </h6>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <select
                      className="form-select form-select-lg"
                      defaultValue="អាទិត្យ / Weekend"
                    >
                      <option>អាទិត្យ / Weekend</option>
                      <option>ថ្ងៃធ្វើការ / Weekdays</option>
                      <option>បត់បែនពេល / Flexible</option>
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <select
                      className="form-select form-select-lg"
                      defaultValue="ព្រឹក"
                    >
                      <option>ព្រឹក</option>
                      <option>រសៀល</option>
                      <option>ល្ងាច</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mb-4">
                <h6 className="fw-bold text-secondary mb-3">
                  ទំនាក់ទំនងបន្ទាន់ / Emergency Contact
                </h6>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="ឈ្មោះ"
                    />
                  </div>
                  <div className="col-sm-6">
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      placeholder="+855 92 123 456"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mb-3">
                <h6 className="fw-bold text-secondary mb-3">
                  អាសយដ្ឋាន / Address
                </h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="ផ្លូវ 271, ភ្នំពេញ"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Phnom Penh"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="សង្កាត់/ឃុំ"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="ខណ្ឌ/ស្រុក"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer border-0 justify-content-end p-4">
              <button
                type="button"
                className="btn btn-light btn-lg rounded-pill"
                onClick={close}
              >
                បិទ / Close
              </button>
              {/* TODO: Wire to API later */}
              <button
                type="button"
                className="btn btn-primary btn-lg rounded-pill"
              >
                រក្សាទុក / Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
