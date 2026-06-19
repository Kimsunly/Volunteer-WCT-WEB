"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { applyOrganizer, getMyOrganizerApplication } from "@/services/organizer";
import { useAuth } from "@/context/AuthContext";

export default function BecomeOrganizerModal({ open, onClose }) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myApplication, setMyApplication] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [applyForm, setApplyForm] = useState({
    organization_name: "",
    organizer_type: "NGO",
    phone: "",
    description: "",
  });
  const [documentFile, setDocumentFile] = useState(null);

  const fetchApplication = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const appRes = await getMyOrganizerApplication();
      setMyApplication(appRes.data || null);
      if (appRes.data) {
        setApplyForm({
          organization_name: appRes.data.organization_name || "",
          organizer_type: appRes.data.organizer_type || "NGO",
          phone: appRes.data.phone || "",
          description: appRes.data.description || "",
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setMyApplication(null);
      } else {
        console.error("Error fetching organizer application:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (open) {
      fetchApplication();
    }
  }, [open, fetchApplication]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.organization_name.trim()) {
      toast.error("សូមបញ្ចូលឈ្មោះអង្គការ");
      return;
    }
    if (!applyForm.phone.trim()) {
      toast.error("សូមបញ្ចូលលេខទូរស័ព្ទ");
      return;
    }
    if (!documentFile && !myApplication?.document_url) {
      toast.error("សូមជ្រើសរើសឯកសារផ្ទៀងផ្ទាត់");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("organization_name", applyForm.organization_name);
      data.append("organizer_type", applyForm.organizer_type);
      data.append("phone", applyForm.phone);
      data.append("description", applyForm.description || "");

      if (documentFile) {
        data.append("document", documentFile);
      } else if (myApplication?.document_url) {
        data.append("document", myApplication.document_url);
      }

      await applyOrganizer(data);
      toast.success("បានដាក់ពាក្យស្នើសុំដោយជោគជ័យ!");
      onClose();
    } catch (err) {
      console.error("Apply error:", err);
      const errMsg = err.response?.data?.message || "បរាជ័យក្នុងការដាក់ពាក្យ";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div 
      className="modal-backdrop-custom d-flex align-items-center justify-content-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content-custom bg-white rounded-4 shadow-lg overflow-hidden">
        <div className="modal-header-custom p-4 text-center">
          <div className="header-glow-orb"></div>
          <div className="header-badge">
            <i className="bi bi-patch-check-fill"></i>
          </div>
          <h4 className="mb-1 fw-bold text-center w-100">ស្នើសុំធ្វើជាអ្នករៀបចំកម្មវិធី</h4>
          <p className="mb-0 text-muted small text-center w-100">Apply to Become a Verified Organizer</p>
          <button 
            type="button" 
            className="btn-close-filter" 
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="modal-body-custom p-4 p-md-5 overflow-auto">
          {loading ? (
            <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center">
              <div className="spinner-border text-primary" role="status" style={{ color: 'var(--primary-color) !important' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted small">កំពុងទាញយកព័ត៌មាន...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {myApplication && (
                <div className={`status-banner p-3 mb-4 d-flex align-items-center gap-3 ${
                  myApplication.status === "approved" || myApplication.status === "active" ? "status-approved" : 
                  myApplication.status === "rejected" ? "status-rejected" : "status-pending"
                }`}>
                  <div className="status-icon">
                    <i className={`bi ${
                      myApplication.status === "approved" || myApplication.status === "active" ? "bi-check-circle-fill" :
                      myApplication.status === "rejected" ? "bi-x-circle-fill" : "bi-clock-history"
                    }`}></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">
                      {myApplication.status === "approved" || myApplication.status === "active" ? "ពាក្យស្នើសុំត្រូវបានអនុម័ត" :
                       myApplication.status === "rejected" ? "ពាក្យស្នើសុំត្រូវបានបដិសេធ" : "ពាក្យស្នើសុំកំពុងស្ថិតក្នុងការពិនិត្យ"}
                    </h6>
                    <p className="small mb-0 opacity-85">
                      {myApplication.status === "approved" || myApplication.status === "active" ? "គណនីរបស់អ្នកឥឡូវនេះជាអ្នករៀបចំកម្មវិធីច្បាប់រួចរាល់ហើយ។" :
                       myApplication.status === "rejected" ? "សូមត្រួតពិនិត្យព័ត៌មាន និងឯកសារឡើងវិញ រួចធ្វើការដាក់ស្នើសុំម្ដងទៀត។" : "ក្រុមការងារកំពុងផ្ទៀងផ្ទាត់ព័ត៌មានរបស់អ្នក។ យើងនឹងជូនដំណឹងក្នុងពេលឆាប់ៗ។"}
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-4 form-group-custom">
                <label className="form-label-custom">
                  <i className="bi bi-building me-2" style={{ color: 'var(--primary-color)' }}></i>
                  ឈ្មោះអង្គការ / ក្រុម / ស្ថាប័ន <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="ឧ. សមាគមយុវជនស្ម័គ្រចិត្ត"
                  value={applyForm.organization_name}
                  onChange={(e) => setApplyForm({ ...applyForm, organization_name: e.target.value })}
                  required
                />
              </div>

              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0 form-group-custom">
                  <label className="form-label-custom">
                    <i className="bi bi-tag me-2" style={{ color: 'var(--primary-color)' }}></i>
                    ប្រភេទអ្នករៀបចំ <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select-custom"
                    value={applyForm.organizer_type}
                    onChange={(e) => setApplyForm({ ...applyForm, organizer_type: e.target.value })}
                  >
                    <option value="NGO">អង្គការក្រៅរដ្ឋាភិបាល (NGO)</option>
                    <option value="Community group">ក្រុមសហគមន៍ (Community group)</option>
                    <option value="School/University">សាលារៀន/សាកលវិទ្យាល័យ (School/University)</option>
                    <option value="Government">ស្ថាប័នរដ្ឋ (Government)</option>
                    <option value="Corporate">ក្រុមហ៊ុន/សាជីវកម្ម (Corporate)</option>
                    <option value="Other">ផ្សេងៗ (Other)</option>
                  </select>
                </div>
                <div className="col-md-6 form-group-custom">
                  <label className="form-label-custom">
                    <i className="bi bi-telephone me-2" style={{ color: 'var(--primary-color)' }}></i>
                    លេខទូរស័ព្ទទំនាក់ទំនង <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="ឧ. 099111222"
                    value={applyForm.phone}
                    onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-4 form-group-custom">
                <label className="form-label-custom">
                  <i className="bi bi-file-earmark-text me-2" style={{ color: 'var(--primary-color)' }}></i>
                  ការពិពណ៌នាសង្ខេបពីបេសកកម្ម
                </label>
                <textarea
                  className="form-control-custom"
                  rows="4"
                  placeholder="រៀបរាប់សង្ខេបអំពីគោលបំណង និងសកម្មភាពចម្បងៗ..."
                  value={applyForm.description}
                  onChange={(e) => setApplyForm({ ...applyForm, description: e.target.value })}
                />
              </div>

              <div className="mb-4 form-group-custom">
                <label className="form-label-custom">
                  <i className="bi bi-file-earmark-arrow-up me-2" style={{ color: 'var(--primary-color)' }}></i>
                  ឯកសារផ្ទៀងផ្ទាត់ (លិខិតអនុញ្ញាត ច្បាប់បញ្ជាក់ ឬអត្តសញ្ញាណប័ណ្ណ) <span className="text-danger">*</span>
                </label>
                <div 
                  className="file-upload-zone"
                  onClick={() => document.getElementById("doc-file-input").click()}
                >
                  <input
                    id="doc-file-input"
                    type="file"
                    className="d-none"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setDocumentFile(e.target.files[0])}
                    required={!myApplication?.document_url}
                  />
                  <div className="upload-zone-content">
                    <i className="bi bi-cloud-arrow-up fs-2 mb-2" style={{ color: 'var(--primary-color)' }}></i>
                    {documentFile ? (
                      <div>
                        <span className="fw-semibold d-block" style={{ color: 'var(--primary-color)' }}>{documentFile.name}</span>
                        <span className="text-muted small">{(documentFile.size / 1024 / 1024).toFixed(2)} MB - ចុចដើម្បីប្ដូរ</span>
                      </div>
                    ) : (
                      <div>
                        <span className="fw-semibold d-block text-primary">ជ្រើសរើសឯកសារផ្ទៀងផ្ទាត់</span>
                        <span className="text-muted small">អូសនិងទម្លាក់ ឬ ចុចដើម្បីជ្រើសរើសឯកសារ</span>
                      </div>
                    )}
                  </div>
                </div>
                {myApplication?.document_url && (
                  <div className="existing-file-card d-flex align-items-center justify-content-between mt-3 p-3">
                    <div className="d-flex align-items-center">
                      <div className="file-icon-box me-3">
                        <i className="bi bi-file-earmark-check fs-4"></i>
                      </div>
                      <div>
                        <span className="small text-muted d-block" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>DOCUMENT IN RECORD</span>
                        <span className="fw-semibold" style={{ fontSize: '14px' }}>ឯកសារផ្ទៀងផ្ទាត់បច្ចុប្បន្ន</span>
                      </div>
                    </div>
                    <a href={myApplication.document_url} target="_blank" rel="noopener noreferrer" className="btn-link-custom small">
                      មើលឯកសារ <i className="bi bi-box-arrow-up-right ms-1"></i>
                    </a>
                  </div>
                )}
              </div>

              <div className="d-flex gap-2 justify-content-end mt-4">
                <button
                  type="button"
                  className="btn-cancel-custom"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="btn-submit-custom d-flex align-items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      កំពុងបញ្ជូន...
                    </>
                  ) : "ដាក់ពាក្យស្នើសុំ"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop-custom {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(8px);
          z-index: 1050;
          padding: 1rem;
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-content-custom {
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid var(--color-border);
          background-color: var(--color-bg-card) !important;
          color: var(--color-text-primary) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .modal-header-custom {
          position: relative;
          background: var(--color-bg-surface) !important;
          border-bottom: 1px solid var(--color-border) !important;
          padding: 24px !important;
        }
        .header-glow-orb {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 120px;
          background: var(--primary-color);
          filter: blur(45px);
          opacity: 0.12;
          pointer-events: none;
        }
        .header-badge {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--color-accent-dim);
          color: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin: 0 auto 12px;
          box-shadow: 0 0 15px var(--color-accent-glow);
          border: 1px solid rgba(163, 230, 53, 0.2);
        }
        .btn-close-filter {
          position: absolute;
          right: 24px;
          top: 24px;
          background: none;
          border: none;
          font-size: 1.25rem;
          color: var(--color-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: all 0.15s ease;
        }
        .btn-close-filter:hover {
          color: var(--color-text-primary);
          background-color: var(--color-bg-input);
        }
        
        .modal-body-custom {
          padding: 30px !important;
        }
        .status-banner {
          border-radius: 12px;
          border: 1px solid transparent;
        }
        .status-pending {
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.25);
          color: #F59E0B;
        }
        .status-approved {
          background: rgba(170, 255, 0, 0.1);
          border-color: rgba(170, 255, 0, 0.25);
          color: var(--primary-color);
        }
        .status-rejected {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.25);
          color: #EF4444;
        }
        .status-icon {
          font-size: 20px;
          display: flex;
          align-items: center;
        }
        
        .form-group-custom {
          display: flex;
          flex-direction: column;
        }
        .form-label-custom {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        .form-control-custom, .form-select-custom {
          border: 1.5px solid var(--color-border);
          border-radius: 12px;
          font-size: 14.5px;
          padding: 12px 16px;
          color: var(--color-text-primary);
          background-color: var(--color-bg-input);
          width: 100%;
          transition: all 0.2s ease;
        }
        .form-control-custom:focus, .form-select-custom:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px var(--color-accent-dim);
          background-color: var(--color-bg-surface);
          outline: none;
        }
        
        .form-select-custom {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23888' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px 12px;
          cursor: pointer;
        }
        
        .file-upload-zone {
          border: 2px dashed var(--color-border);
          background: var(--color-bg-input);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .file-upload-zone:hover {
          border-color: var(--primary-color);
          background: var(--color-accent-dim);
        }
        
        .existing-file-card {
          background: var(--color-bg-input);
          border: 1px solid var(--color-border);
          border-radius: 12px;
        }
        .file-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: var(--color-accent-dim);
          color: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-link-custom {
          color: var(--primary-color);
          font-weight: 600;
          text-decoration: none;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }
        .btn-link-custom:hover {
          text-decoration: underline;
          opacity: 0.85;
        }
        
        .btn-cancel-custom {
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-secondary);
          padding: 10px 24px;
          border-radius: 12px;
          font-size: 14.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-cancel-custom:hover {
          background: var(--color-bg-card-hover);
          color: var(--color-text-primary);
        }
        
        .btn-submit-custom {
          border: none;
          background: var(--primary-color);
          color: #000000;
          padding: 10px 32px;
          border-radius: 12px;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px var(--color-accent-glow);
          transition: all 0.2s ease;
        }
        .btn-submit-custom:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }
      `}</style>
    </div>
  );
}
