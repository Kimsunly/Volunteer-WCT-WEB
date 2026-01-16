"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { getUserProfile, updateUserProfile, uploadUserAvatar } from "@/services/user";

export default function AccountSettingsModal({ open, onClose }) {
  const [avatarUrl, setAvatarUrl] = useState(
    "/images/ORG/computer-icons-user-profile-circle-abstract.jpg"
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "", // Read only ideally
    phone: "",
    location: "",
    birth_date: "",
    about_me: "",
    skills: "",
    availability: "weekend",
    time_preference: "morning",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    address_street: "",
    address_city: "",
    address_district: "",
    address_province: ""
  });

  const aboutMax = 400;
  const fileInputRef = useRef(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      fetchProfile();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile();
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        birth_date: data.birth_date ? data.birth_date.split('T')[0] : "",
        about_me: data.about_me || "",
        skills: data.skills || "",
        availability: data.availability || "weekend",
        time_preference: data.time_preference || "morning",
        emergency_contact_name: data.emergency_contact_name || "",
        emergency_contact_phone: data.emergency_contact_phone || "",
        address_street: data.address_street || "",
        address_city: data.address_city || "",
        address_district: data.address_district || "",
        address_province: data.address_province || ""
      });
      if (data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
      toast.error("បរាជ័យក្នុងការទាញយកទិន្នន័យ");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Handle select inputs which might not have id matching state key perfectly in previous code, 
    // but we will align them.
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);

    // Upload immediately
    const uploadToast = toast.loading("កំពុងផ្លាស់ប្តូររូបភាព...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadUserAvatar(formData);
      setAvatarUrl(res.avatar_url);
      toast.success("បានផ្លាស់ប្តូររូបភាពដោយជោគជ័យ", { id: uploadToast });
    } catch (error) {
      console.error("Avatar upload error", error);
      toast.error("បរាជ័យក្នុងការផ្លាស់ប្តូររូបភាព", { id: uploadToast });
      // Revert preview if needed, or just let it stay as 'failed' state visually? 
      // Better to revert if we had old one, but simplify for now.
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // Clean up empty dates to null if backend expects
      const payload = { ...formData };
      if (!payload.birth_date) delete payload.birth_date;

      await updateUserProfile(payload);
      toast.success("បានរក្សាទុកការកែប្រែ");
      onClose();
      // Optional: Refresh page or trigger context update? 
      // For now assume local state is enough or user reloads manually.
      window.location.reload();
    } catch (error) {
      console.error("Update profile error", error);
      toast.error("បរាជ័យក្នុងការរក្សាទុក");
    } finally {
      setSaving(false);
    }
  };

  const close = () => onClose?.();

  if (!open) return null;

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
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Avatar Upload */}
                  <div className="d-flex align-items-center justify-content-center mb-4">
                    <label className="vh-avatar-uploader mb-0 position-relative cursor-pointer">
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
                            htmlFor="first_name"
                          >
                            នាមខ្លួន
                          </label>
                          <input
                            id="first_name"
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="ឧ. សុភា"
                            value={formData.first_name}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-sm-6">
                          <label
                            className="form-label fw-medium"
                            htmlFor="last_name"
                          >
                            នាមត្រកូល
                          </label>
                          <input
                            id="last_name"
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="ឧ. ចាន់"
                            value={formData.last_name}
                            onChange={handleChange}
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
                              value={formData.email}
                              disabled // Email usually not editable directly
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
                              value={formData.phone}
                              onChange={handleChange}
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
                              value={formData.location}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <label className="form-label fw-medium" htmlFor="birth_date">
                            ថ្ងៃខែឆ្នាំកំណើត
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-calendar-event-fill"></i>
                            </span>
                            <input
                              id="birth_date"
                              type="date"
                              className="form-control form-control-lg"
                              value={formData.birth_date}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-medium" htmlFor="about_me">
                            ពីអំពីខ្ញុំ
                          </label>
                          <textarea
                            id="about_me"
                            className="form-control form-control-lg"
                            rows={3}
                            maxLength={aboutMax}
                            value={formData.about_me}
                            onChange={handleChange}
                            placeholder="សូមពិពណ៌នាខ្លីៗអំពីបទពិសោធន៍ និងចំណាប់អារម្មណ៍…"
                          />
                          <div className="d-flex justify-content-end mt-1">
                            <small>
                              {(formData.about_me || "").length}/{aboutMax}
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
                            value={formData.skills}
                            onChange={handleChange}
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
                          value={formData.availability}
                          onChange={(e) => handleSelectChange('availability', e.target.value)}
                        >
                          <option value="weekend">អាទិត្យ / Weekend</option>
                          <option value="weekdays">ថ្ងៃធ្វើការ / Weekdays</option>
                          <option value="flexible">បត់បែនពេល / Flexible</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <select
                          className="form-select form-select-lg"
                          value={formData.time_preference}
                          onChange={(e) => handleSelectChange('time_preference', e.target.value)}
                        >
                          <option value="morning">ព្រឹក</option>
                          <option value="afternoon">រសៀល</option>
                          <option value="evening">ល្ងាច</option>
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
                          id="emergency_contact_name"
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="ឈ្មោះ"
                          value={formData.emergency_contact_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          id="emergency_contact_phone"
                          type="tel"
                          className="form-control form-control-lg"
                          placeholder="+855 92 123 456"
                          value={formData.emergency_contact_phone}
                          onChange={handleChange}
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
                          id="address_street"
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="ផ្លូវ, ផ្ទះលេខ"
                          value={formData.address_street}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          id="address_city"
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="Phnom Penh"
                          value={formData.address_city}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          id="address_district"
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="សង្កាត់/ឃុំ"
                          value={formData.address_district}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          id="address_province"
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="ខណ្ឌ/ស្រុក"
                          value={formData.address_province}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer border-0 justify-content-end p-4">
              <button
                type="button"
                className="btn btn-light btn-lg rounded-pill"
                onClick={close}
                disabled={saving}
              >
                បិទ / Close
              </button>
              <button
                type="button"
                className="btn btn-primary btn-lg rounded-pill"
                onClick={handleSubmit}
                disabled={loading || saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                    <span role="status">កំពុងរក្សាទុក...</span>
                  </>
                ) : "រក្សាទុក / Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
