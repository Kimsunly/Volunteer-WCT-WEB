"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  getUserProfile,
  updateUserProfile,
  uploadUserAvatar,
} from "@/services/user";
import { useAuth } from "@/context/AuthContext";

export default function AccountSettingsModal({ open, onClose }) {
  const { setUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(
    "/images/ORG/computer-icons-user-profile-circle-abstract.jpg",
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // profile | availability | emergency | address

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
    address_province: "",
  });

  const aboutMax = 400;
  const fileInputRef = useRef(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setActiveTab("profile");
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
        birth_date: data.birth_date ? data.birth_date.split("T")[0] : "",
        about_me: data.about_me || "",
        skills: data.skills || "",
        availability: data.availability || "weekend",
        time_preference: data.time_preference || "morning",
        emergency_contact_name: data.emergency_contact_name || "",
        emergency_contact_phone: data.emergency_contact_phone || "",
        address_street: data.address_street || "",
        address_city: data.address_city || "",
        address_district: data.address_district || "",
        address_province: data.address_province || "",
      });
      if (data.avatar_url) {
        let finalAvatar = data.avatar_url;
        if (finalAvatar && !finalAvatar.startsWith("http")) {
          const apiBase =
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
          finalAvatar = `${apiBase.replace(/\/$/, "")}/${finalAvatar.replace(/^\//, "")}`;
        }
        setAvatarUrl(finalAvatar);
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
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    const oldAvatarUrl = avatarUrl;
    setAvatarUrl(previewUrl);

    // Upload immediately
    const uploadToast = toast.loading("កំពុងផ្លាស់ប្តូររូបភាព...");
    try {
      const fd = new FormData();
      fd.append("avatar", file); // Backend expects 'avatar' key
      const res = await uploadUserAvatar(fd);

      // Ensure the URL is absolute for Next.js Image
      let finalUrl = res.avatar_url;
      if (finalUrl && !finalUrl.startsWith("http")) {
        const apiBase =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        finalUrl = `${apiBase.replace(/\/$/, "")}/${finalUrl.replace(/^\//, "")}`;
      }

      setAvatarUrl(finalUrl);

      // Update global user context immediately
      setUser((prev) => ({
        ...prev,
        avatar: finalUrl,
        avatar_url: finalUrl,
      }));

      toast.success("បានផ្លាស់ប្តូររូបភាពដោយជោគជ័យ", { id: uploadToast });
    } catch (error) {
      console.error("Avatar upload error", error);
      toast.error("បរាជ័យក្នុងការផ្លាស់ប្តូររូបភាព", { id: uploadToast });
      setAvatarUrl(oldAvatarUrl);
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

      // Update global user context
      const updatedUser = await getUserProfile();
      setUser(updatedUser);

      close();
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
        className="modal-backdrop fade show custom-modal-backdrop"
        onClick={close}
        style={{ zIndex: 1050 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show modern-settings-modal"
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
          <div className="modal-content border-0">
            {/* Modal Header */}
            <div className="modal-header">
              <h6 className="modal-title" id="accSetTitle">
                ការកំណត់គណនី /{" "}
                <span className="fw-normal">Account Settings</span>
              </h6>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={close}
              ></button>
            </div>

            {/* Modal Body with Split Pane */}
            <div className="modal-body">
              {/* Sidebar Navigation */}
              <div className="modal-sidebar">
                <button
                  type="button"
                  className={`sidebar-tab-btn ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <i className="bi bi-person-fill"></i>
                  <span>ព័ត៌មានផ្ទាល់ខ្លួន</span>
                </button>
                <button
                  type="button"
                  className={`sidebar-tab-btn ${activeTab === "availability" ? "active" : ""}`}
                  onClick={() => setActiveTab("availability")}
                >
                  <i className="bi bi-calendar-week-fill"></i>
                  <span>ការចូលរួម & ជំនាញ</span>
                </button>
                <button
                  type="button"
                  className={`sidebar-tab-btn ${activeTab === "emergency" ? "active" : ""}`}
                  onClick={() => setActiveTab("emergency")}
                >
                  <i className="bi bi-telephone-outbound-fill"></i>
                  <span>ទំនាក់ទំនងបន្ទាន់</span>
                </button>
                <button
                  type="button"
                  className={`sidebar-tab-btn ${activeTab === "address" ? "active" : ""}`}
                  onClick={() => setActiveTab("address")}
                >
                  <i className="bi bi-geo-alt-fill"></i>
                  <span>អាសយដ្ឋាន</span>
                </button>
              </div>

              {/* Tab Content Area */}
              <div className="modal-tab-content">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Tab 1: Profile Info */}
                    {activeTab === "profile" && (
                      <div>
                        <h5 className="tab-section-title">
                          <i className="bi bi-person-fill"></i> ព័ត៌មានផ្ទាល់ខ្លួន / Profile Details
                        </h5>

                        {/* Avatar Upload */}
                        <div className="avatar-upload-section">
                          <div
                            className="avatar-container"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="d-none"
                              accept="image/*"
                              onChange={handleAvatarChange}
                            />
                            <Image
                              src={avatarUrl}
                              alt="រូបភាព"
                              className="avatar-preview"
                              width={90}
                              height={90}
                              unoptimized
                            />
                            <div className="avatar-overlay">
                              <i className="bi bi-camera-fill"></i>
                              <span>ប្តូររូបភាព</span>
                            </div>
                          </div>
                          <div className="avatar-upload-info">
                            <h6>រូបថតគណនី / Account Photo</h6>
                            <p>បញ្ចូលរូបថតផ្ទាល់ខ្លួនដើម្បីបង្ហាញលើកម្រងព័ត៌មាន។</p>
                            <button
                              type="button"
                              className="btn-upload-avatar"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              ប្តូររូបភាព / Change Photo
                            </button>
                          </div>
                        </div>

                        {/* Profile Info Form */}
                        <form onSubmit={(e) => e.preventDefault()}>
                          <div className="row g-3">
                            <div className="col-sm-6">
                              <label className="form-label" htmlFor="first_name">
                                នាមខ្លួន / First Name
                              </label>
                              <input
                                id="first_name"
                                type="text"
                                className="form-control"
                                placeholder="ឧ. សុភា"
                                value={formData.first_name}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="col-sm-6">
                              <label className="form-label" htmlFor="last_name">
                                នាមត្រកូល / Last Name
                              </label>
                              <input
                                id="last_name"
                                type="text"
                                className="form-control"
                                placeholder="ឧ. ចាន់"
                                value={formData.last_name}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="col-12">
                              <label className="form-label" htmlFor="email">
                                អ៊ីមែល / Email Address
                              </label>
                              <div className="input-group">
                                <span className="input-group-text">
                                  <i className="bi bi-envelope-fill"></i>
                                </span>
                                <input
                                  id="email"
                                  type="email"
                                  className="form-control"
                                  placeholder="sophea.chan@email.com"
                                  value={formData.email}
                                  disabled
                                />
                              </div>
                            </div>

                            <div className="col-sm-6">
                              <label className="form-label" htmlFor="phone">
                                លេខទូរស័ព្ទ / Phone
                              </label>
                              <div className="input-group">
                                <span className="input-group-text">
                                  <i className="bi bi-telephone-fill"></i>
                                </span>
                                <input
                                  id="phone"
                                  type="tel"
                                  className="form-control"
                                  placeholder="+855 23 123 456"
                                  value={formData.phone}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div className="col-sm-6">
                              <label className="form-label" htmlFor="location">
                                ទីតាំង / Location
                              </label>
                              <div className="input-group">
                                <span className="input-group-text">
                                  <i className="bi bi-geo-alt-fill"></i>
                                </span>
                                <input
                                  id="location"
                                  type="text"
                                  className="form-control"
                                  placeholder="Phnom Penh"
                                  value={formData.location}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div className="col-12">
                              <label className="form-label" htmlFor="birth_date">
                                ថ្ងៃខែឆ្នាំកំណើត / Birth Date
                              </label>
                              <div className="input-group">
                                <span className="input-group-text">
                                  <i className="bi bi-calendar-event-fill"></i>
                                </span>
                                <input
                                  id="birth_date"
                                  type="date"
                                  className="form-control"
                                  value={formData.birth_date}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Tab 2: Availability & Skills */}
                    {activeTab === "availability" && (
                      <div>
                        <h5 className="tab-section-title">
                          <i className="bi bi-calendar-week-fill"></i> ការចូលរួម & ជំនាញ / Availability & Skills
                        </h5>

                        <form onSubmit={(e) => e.preventDefault()}>
                          <div className="row g-3">
                            <div className="col-12">
                              <label className="form-label" htmlFor="about_me">
                                អំពីខ្ញុំ / About Me
                              </label>
                              <div className="position-relative">
                                <textarea
                                  id="about_me"
                                  className="form-control"
                                  rows={4}
                                  maxLength={aboutMax}
                                  value={formData.about_me}
                                  onChange={handleChange}
                                  placeholder="សូមពិពណ៌នាខ្លីៗអំពីបទពិសោធន៍ និងចំណាប់អារម្មណ៍…"
                                  style={{ paddingBottom: "25px" }}
                                />
                                <div
                                  className="position-absolute bottom-0 end-0 p-2"
                                  style={{ pointerEvents: "none" }}
                                >
                                  <small className="text-muted">
                                    {(formData.about_me || "").length}/{aboutMax}
                                  </small>
                                </div>
                              </div>
                            </div>

                            <div className="col-12">
                              <label className="form-label" htmlFor="skills">
                                ជំនាញ / Skills
                              </label>
                              <input
                                id="skills"
                                type="text"
                                className="form-control"
                                placeholder="ឧ. ការទំនាក់ទំនង, ការបណ្តុះបណ្តា, ការរៀបចំព្រឹត្តិការណ៍"
                                value={formData.skills}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="col-sm-6">
                              <label className="form-label">
                                ថ្ងៃអាចចូលរួម / Availability
                              </label>
                              <select
                                className="form-select"
                                value={formData.availability}
                                onChange={(e) =>
                                  handleSelectChange("availability", e.target.value)
                                }
                              >
                                <option value="weekend">អាទិត្យ / Weekend</option>
                                <option value="weekdays">ថ្ងៃធ្វើការ / Weekdays</option>
                                <option value="flexible">បត់បែនពេល / Flexible</option>
                              </select>
                            </div>

                            <div className="col-sm-6">
                              <label className="form-label">
                                ពេលអាចចូលរួម / Time Preference
                              </label>
                              <select
                                className="form-select"
                                value={formData.time_preference}
                                onChange={(e) =>
                                  handleSelectChange("time_preference", e.target.value)
                                }
                              >
                                <option value="morning">ព្រឹក / Morning</option>
                                <option value="afternoon">រសៀល / Afternoon</option>
                                <option value="evening">ល្ងាច / Evening</option>
                              </select>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Tab 3: Emergency Contact */}
                    {activeTab === "emergency" && (
                      <div>
                        <h5 className="tab-section-title">
                          <i className="bi bi-telephone-outbound-fill"></i> ទំនាក់ទំនងបន្ទាន់ / Emergency Contact
                        </h5>

                        <form onSubmit={(e) => e.preventDefault()}>
                          <div className="row g-3">
                            <div className="col-12">
                              <label className="form-label" htmlFor="emergency_contact_name">
                                ឈ្មោះអ្នកទាក់ទង / Contact Name
                              </label>
                              <input
                                id="emergency_contact_name"
                                type="text"
                                className="form-control"
                                placeholder="ឧ. ចាន់ ធារី"
                                value={formData.emergency_contact_name}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="col-12">
                              <label className="form-label" htmlFor="emergency_contact_phone">
                                លេខទូរស័ព្ទ / Phone Number
                              </label>
                              <div className="input-group">
                                <span className="input-group-text">
                                  <i className="bi bi-telephone-fill"></i>
                                </span>
                                <input
                                  id="emergency_contact_phone"
                                  type="tel"
                                  className="form-control"
                                  placeholder="+855 92 123 456"
                                  value={formData.emergency_contact_phone}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Tab 4: Address */}
                    {activeTab === "address" && (
                      <div>
                        <h5 className="tab-section-title">
                          <i className="bi bi-geo-alt-fill"></i> អាសយដ្ឋាន / Address
                        </h5>

                        <form onSubmit={(e) => e.preventDefault()}>
                          <div className="row g-3">
                            <div className="col-12">
                              <label className="form-label" htmlFor="address_street">
                                ផ្លូវ និងផ្ទះលេខ / Street & House No.
                              </label>
                              <input
                                id="address_street"
                                type="text"
                                className="form-control"
                                placeholder="ឧ. ផ្លូវ ១២៣, ផ្ទះលេខ ៤៥A"
                                value={formData.address_street}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="col-sm-6">
                              <label className="form-label" htmlFor="address_district">
                                សង្កាត់/ឃុំ / Commune
                              </label>
                              <input
                                id="address_district"
                                type="text"
                                className="form-control"
                                placeholder="សង្កាត់/ឃុំ"
                                value={formData.address_district}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="col-sm-6">
                              <label className="form-label" htmlFor="address_province">
                                ខណ្ឌ/ស្រុក / District
                              </label>
                              <input
                                id="address_province"
                                type="text"
                                className="form-control"
                                placeholder="ខណ្ឌ/ស្រុក"
                                value={formData.address_province}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="col-12">
                              <label className="form-label" htmlFor="address_city">
                                រាជធានី/ខេត្ត / Province/City
                              </label>
                              <input
                                id="address_city"
                                type="text"
                                className="form-control"
                                placeholder="Phnom Penh"
                                value={formData.address_city}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer justify-content-end">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={close}
                disabled={saving}
              >
                បិទ / Close
              </button>
              <button
                type="button"
                className="btn btn-save"
                onClick={handleSubmit}
                disabled={loading || saving}
              >
                {saving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>
                    <span role="status">កំពុងរក្សាទុក...</span>
                  </>
                ) : (
                  "រក្សាទុក / Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
