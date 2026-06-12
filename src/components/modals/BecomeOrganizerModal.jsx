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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1050,
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="modal-content-custom bg-white rounded-4 shadow-lg overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div 
          className="modal-header-custom p-4 text-white text-center"
          style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <h3 className="mb-1 fw-bold">ស្នើសុំធ្វើជាអ្នករៀបចំកម្មវិធី</h3>
              <p className="mb-0 opacity-75">Apply to Become a Verified Organizer</p>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              style={{ position: 'absolute', right: '20px', top: '25px' }}
            ></button>
          </div>
        </div>

        <div className="modal-body-custom p-4 p-md-5 overflow-auto">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">កំពុងទាញយកព័ត៌មាន...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-bold">
                  ឈ្មោះអង្គការ / ក្រុម / ស្ថាប័ន <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control py-2"
                  placeholder="ឧ. សមាគមយុវជនស្ម័គ្រចិត្ត"
                  value={applyForm.organization_name}
                  onChange={(e) => setApplyForm({ ...applyForm, organization_name: e.target.value })}
                  required
                />
              </div>

              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label fw-bold">
                    ប្រភេទអ្នករៀបចំ <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select py-2"
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
                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    លេខទូរស័ព្ទទំនាក់ទំនង <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control py-2"
                    placeholder="ឧ. 099111222"
                    value={applyForm.phone}
                    onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">ការពិពណ៌នាសង្ខេបពីបេសកកម្ម</label>
                <textarea
                  className="form-control py-2"
                  rows="4"
                  placeholder="រៀបរាប់សង្ខេបអំពីគោលបំណង និងសកម្មភាពចម្បងៗ..."
                  value={applyForm.description}
                  onChange={(e) => setApplyForm({ ...applyForm, description: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  ឯកសារផ្ទៀងផ្ទាត់ (លិខិតអនុញ្ញាត ច្បាប់បញ្ជាក់ ឬអត្តសញ្ញាណប័ណ្ណ) <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control py-2"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => setDocumentFile(e.target.files[0])}
                  required={!myApplication?.document_url}
                />
                {myApplication?.document_url && (
                  <div className="form-text text-muted mt-2">
                    <i className="bi bi-file-earmark-check me-1"></i>
                    មានឯកសារចាស់រួចហើយ៖ <a href={myApplication.document_url} target="_blank" rel="noopener noreferrer">មើលឯកសារ</a>
                  </div>
                )}
              </div>

              <div className="d-flex gap-2 justify-content-end mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 rounded-pill"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-5 rounded-pill fw-bold"
                  disabled={isSubmitting}
                  style={{ background: '#2a5298', borderColor: '#2a5298' }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      កំពុងបញ្ជូន...
                    </>
                  ) : "ដាក់ពាក្យស្នើសុំ"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
