"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { reportComment } from "@/services/comments";

export default function ReportCommentModal({ open, onClose, commentId, onReportSuccess }) {
  const [reason, setReason] = useState("Spam / Inappropriate");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      toast.error("សូមជ្រើសរើសមូលហេតុនៃការរាយការណ៍");
      return;
    }

    setIsSubmitting(true);
    try {
      await reportComment(commentId, { reason, details });
      toast.success("បានផ្ញើការរាយការណ៍ដោយជោគជ័យទៅកាន់ Admin!");
      if (onReportSuccess) {
        onReportSuccess();
      }
      onClose();
      // Reset form
      setReason("Spam / Inappropriate");
      setDetails("");
    } catch (err) {
      console.error("Report error:", err);
      const errMsg = err.response?.data?.message || "បរាជ័យក្នុងការរាយការណ៍មតិយោបល់";
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
          maxWidth: '500px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div 
          className="modal-header-custom p-4 text-white text-center"
          style={{
            background: 'linear-gradient(135deg, #ef473a 0%, #d63031 100%)'
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <h4 className="mb-1 fw-bold">រាយការណ៍មតិយោបល់</h4>
              <p className="mb-0 opacity-75 small">Report Inappropriate Comment</p>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              style={{ position: 'absolute', right: '20px', top: '25px' }}
            ></button>
          </div>
        </div>

        <div className="modal-body-custom p-4 overflow-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold small">
                មូលហេតុចម្បង <span className="text-danger">*</span>
              </label>
              <select
                className="form-select py-2"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              >
                <option value="Spam / Inappropriate">សារឥតបានការ ឬមិនសមរម្យ (Spam / Inappropriate)</option>
                <option value="Harassment / Hate Speech">ការបៀតបៀន ឬការស្អប់ខ្ពើម (Harassment / Hate Speech)</option>
                <option value="Misinformation">ព័ត៌មានមិនពិត (Misinformation)</option>
                <option value="Offensive / Rude">អសុរោះ ឬរំលោភបំពាន (Offensive / Rude)</option>
                <option value="Other">ផ្សេងៗ (Other)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold small">ព័ត៌មានលម្អិតបន្ថែម (ជាជម្រើស)</label>
              <textarea
                className="form-control py-2"
                rows="3"
                placeholder="រៀបរាប់បន្ថែមអំពីមូលហេតុដែលអ្នករាយការណ៍មតិនេះ..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2 justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary px-4 rounded-pill btn-sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                បោះបង់
              </button>
              <button
                type="submit"
                className="btn btn-danger px-4 rounded-pill btn-sm fw-bold"
                disabled={isSubmitting}
                style={{ background: '#ef473a', borderColor: '#ef473a' }}
              >
                {isSubmitting ? "កំពុងផ្ញើ..." : "ផ្ញើការរាយការណ៍"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
