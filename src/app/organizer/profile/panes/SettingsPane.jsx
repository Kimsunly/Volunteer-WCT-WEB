"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { updateOrganizerProfile, uploadOrganizerAvatar, buildApiUrl } from "@/services/organizer";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";

const colorPresets = [
  "#000000",
  "#5E17EB",
  "#6F42C1",
  "#0969DA",
  "#0CB6D6",
  "#1A7F37",
];

export default function SettingsPane({ profile, onUpdate }) {
    const { settings, updateSetting } = useSettings();
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(buildApiUrl(profile?.logo_url) || "/images/ORG/company-icon.png");
    const [form, setForm] = useState({
        organization_name: profile?.organization_name || "",
        organizer_type: profile?.organizer_type || "ngo",
        phone: profile?.phone || "",
        website: profile?.website || "",
        address: profile?.address || "",
        description: profile?.description || "",
        contact_person: profile?.contact_person || "",
        email: profile?.email || "",
        registration_number: profile?.registration_number || "",
    });

    useEffect(() => {
        if (profile) {
            setForm({
                organization_name: profile.organization_name || "",
                organizer_type: profile.organizer_type || "ngo",
                phone: profile.phone || "",
                website: profile.website || "",
                address: profile.address || "",
                description: profile.description || "",
                contact_person: profile.contact_person || "",
                email: profile.email || "",
                registration_number: profile.registration_number || "",
            });
            if (profile.logo_url) {
                setAvatarPreview(buildApiUrl(profile.logo_url) || profile.logo_url);
            }
        }
    }, [profile]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const url = URL.createObjectURL(file);
        setAvatarPreview(url);

        // Upload
        setAvatarLoading(true);
        try {
            const res = await uploadOrganizerAvatar(file);
            // Update preview with the absolute API URL from the response
            const newLogoUrl = res?.data?.logo_url || res?.logo_url;
            const absoluteLogoUrl = newLogoUrl ? buildApiUrl(newLogoUrl) : null;
            if (absoluteLogoUrl) {
                setAvatarPreview(absoluteLogoUrl);
                // Sync navbar profile icon with the new organizer logo
                if (user) {
                    setUser((prev) => ({ ...prev, avatar_url: absoluteLogoUrl, profileImage: absoluteLogoUrl }));
                }
            }
            toast.success("រូបភាពត្រូវបានបញ្ចូលដោយជោគជ័យ!");
            if (onUpdate) await onUpdate();
        } catch (error) {
            console.error("Avatar upload error:", error);
            toast.error("បរាជ័យក្នុងការបញ្ចូលរូបភាព");
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateOrganizerProfile(form);
            toast.success("ព័ត៌មានត្រូវបានរក្សាទុក!");
            if (onUpdate) await onUpdate();
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("បរាជ័យក្នុងការរក្សាទុកព័ត៌មាន");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column gap-4">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden" data-aos="fade-up">
                <div className="card-header bg-white border-bottom p-4">
                    <h5 className="card-title mb-0 fw-bold">ការកំណត់អង្គការ</h5>
                    <p className="text-muted small mb-0">គ្រប់គ្រងព័ត៌មានមូលដ្ឋាន និងអត្តសញ្ញាណរបស់អង្គការអ្នក</p>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        {/* Avatar uploader */}
                        <div className="d-flex flex-column align-items-center mb-5">
                            <div className="position-relative">
                                <div className={`vh-avatar ring ${avatarLoading ? "opacity-50" : ""}`} style={{ width: "120px", height: "120px" }}>
                                    <Image
                                        src={avatarPreview}
                                        alt="រូបតំណាង"
                                        fill
                                        className="rounded-circle object-fit-cover shadow-sm"
                                        unoptimized
                                    />
                                    {avatarLoading && (
                                        <div className="position-absolute top-50 start-50 translate-middle">
                                            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="orgAvatarInput"
                                    className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle shadow-sm cursor-pointer border border-white"
                                    style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyCenter: "center" }}
                                >
                                    <i className="bi bi-camera-fill"></i>
                                    <input
                                        type="file"
                                        className="d-none"
                                        id="orgAvatarInput"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        disabled={avatarLoading}
                                    />
                                </label>
                            </div>
                            <span className="small text-muted mt-2">ប្តូររូបភាព Profile</span>
                        </div>

                        {/* Form Fields */}
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-secondary">ឈ្មោះអង្គការ</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-building"></i></span>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0 py-2"
                                        placeholder="ឈ្មោះអង្គការរបស់អ្នក"
                                        value={form.organization_name}
                                        onChange={(e) => setForm({ ...form, organization_name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-secondary">ប្រភេទអង្គការ</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-tag"></i></span>
                                    <select
                                        className="form-select bg-light border-0 py-2"
                                        value={form.organizer_type}
                                        onChange={(e) => setForm({ ...form, organizer_type: e.target.value })}
                                    >
                                        <option value="ngo">អង្គការក្រៅរដ្ឋាភិបាល (NGO)</option>
                                        <option value="nonprofit">សប្បុរសធម៌ (Non-Profit)</option>
                                        <option value="community">ក្រុមសហគមន៍</option>
                                        <option value="educational">ស្ថាប័នអប់រំ</option>
                                        <option value="corporate">សាជីវកម្ម (CSR)</option>
                                        <option value="other">ផ្សេងៗ</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-secondary">អ្នកទំនាក់ទំនង (Contact Person)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-person"></i></span>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0 py-2"
                                        placeholder="ឈ្មោះអ្នកទំនាក់ទំនងផ្ទាល់"
                                        value={form.contact_person}
                                        onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-secondary">អ៊ីមែល (Email)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-envelope"></i></span>
                                    <input
                                        type="email"
                                        className="form-control bg-light border-0 py-2"
                                        placeholder="example@org.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-secondary">លេខទូរស័ព្ទ</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-phone"></i></span>
                                    <input
                                        type="tel"
                                        className="form-control bg-light border-0 py-2"
                                        placeholder="012 345 678"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-secondary">គេហទំព័រ (Website)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-globe"></i></span>
                                    <input
                                        type="url"
                                        className="form-control bg-light border-0 py-2"
                                        placeholder="https://example.com"
                                        value={form.website}
                                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-secondary">លេខចុះបញ្ជី (Registration Number)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-card-text"></i></span>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0 py-2"
                                        placeholder="ឧ. លេខចុះបញ្ជីផ្លូវការ..."
                                        value={form.registration_number}
                                        onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label small fw-bold text-secondary">អាសយដ្ឋាន</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-geo-alt"></i></span>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0 py-2"
                                        placeholder="ផ្លូវ លេខផ្ទះ ខណ្ឌ/ក្រុង..."
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label small fw-bold text-secondary">អំពីអង្គការ</label>
                                <textarea
                                    className="form-control bg-light border-0"
                                    rows="4"
                                    placeholder="រៀបរាប់បន្តិចអំពីបេសកកម្មរបស់អង្គការអ្នក..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        <div className="mt-5 d-flex justify-content-end border-top pt-4">
                            <button
                                type="submit"
                                className="btn btn-primary px-5 rounded-pill shadow-sm d-flex align-items-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        កំពុងរក្សាទុក...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle"></i>
                                        រក្សាទុកការផ្លាស់ប្តូរ
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Interface Theme / Appearance Card */}
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden" data-aos="fade-up">
                <div className="card-header bg-white border-bottom p-4">
                    <h5 className="card-title mb-0 fw-bold">ការកំណត់ការបង្ហាញ (Appearance)</h5>
                    <p className="text-muted small mb-0">ជ្រើសរើស ឬកែសម្រួលរូបរាង និងពណ៌នៃកម្មវិធី</p>
                </div>
                <div className="card-body p-4">
                    {/* Interface Theme */}
                    <div className="mb-4 pb-4 border-bottom">
                        <div className="mb-3">
                            <h6 className="fw-semibold mb-1">រូបរាងចំណុចប្រទាក់ (Interface theme)</h6>
                            <p className="text-muted small">ជ្រើសរើសរូបរាងចំណុចប្រទាក់សម្រាប់គណនីរបស់អ្នក។</p>
                        </div>
                        <div className="d-flex flex-wrap gap-4">
                            {/* Light Mode */}
                            <button
                                type="button"
                                className="p-0 border-0 bg-transparent"
                                onClick={() => updateSetting("theme", "light")}
                            >
                                <div
                                    className={`p-2 rounded-4 border border-3 transition-all ${settings.theme === "light" ? "border-primary" : "border-transparent"}`}
                                >
                                    <div
                                        style={{
                                            width: "180px",
                                            height: "120px",
                                            borderRadius: "12px",
                                            background: "#ffffff",
                                            border: "1px solid #e5e7eb",
                                            position: "relative",
                                        }}
                                    >
                                        <div style={{ position: "absolute", top: "10px", left: "10px", width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }}></div>
                                        <div style={{ position: "absolute", top: "10px", left: "30px", width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }}></div>
                                        <div style={{ position: "absolute", top: "10px", left: "50px", width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }}></div>
                                        <div style={{ position: "absolute", top: "40px", left: "15px", right: "15px", height: "12px", borderRadius: "4px", background: "#e5e7eb" }}></div>
                                        <div style={{ position: "absolute", top: "60px", left: "15px", right: "40px", height: "12px", borderRadius: "4px", background: "#f3f4f6" }}></div>
                                        <div style={{ position: "absolute", top: "80px", left: "15px", right: "60px", height: "12px", borderRadius: "4px", background: "#f3f4f6" }}></div>
                                        {settings.theme === "light" && (
                                            <div style={{ position: "absolute", bottom: "10px", right: "10px", width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #0969DA, #0CB6D6)", display: "flex", alignItems: "center", justifyCenter: "center" }}>
                                                <i className="bi bi-check-lg text-white" style={{ fontSize: "16px", margin: "auto" }}></i>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-center mt-2 small fw-medium text-dark">ភ្លឺ (Light)</p>
                            </button>

                            {/* Dark Mode */}
                            <button
                                type="button"
                                className="p-0 border-0 bg-transparent"
                                onClick={() => updateSetting("theme", "dark")}
                            >
                                <div
                                    className={`p-2 rounded-4 border border-3 transition-all ${settings.theme === "dark" ? "border-primary" : "border-transparent"}`}
                                >
                                    <div
                                        style={{
                                            width: "180px",
                                            height: "120px",
                                            borderRadius: "12px",
                                            background: "#1f2937",
                                            border: "1px solid #374151",
                                            position: "relative",
                                        }}
                                    >
                                        <div style={{ position: "absolute", top: "10px", left: "10px", width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }}></div>
                                        <div style={{ position: "absolute", top: "10px", left: "30px", width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }}></div>
                                        <div style={{ position: "absolute", top: "10px", left: "50px", width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }}></div>
                                        <div style={{ position: "absolute", top: "40px", left: "15px", right: "15px", height: "12px", borderRadius: "4px", background: "#4b5563" }}></div>
                                        <div style={{ position: "absolute", top: "60px", left: "15px", right: "40px", height: "12px", borderRadius: "4px", background: "#374151" }}></div>
                                        <div style={{ position: "absolute", top: "80px", left: "15px", right: "60px", height: "12px", borderRadius: "4px", background: "#374151" }}></div>
                                        {settings.theme === "dark" && (
                                            <div style={{ position: "absolute", bottom: "10px", right: "10px", width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #0969DA, #0CB6D6)", display: "flex", alignItems: "center", justifyCenter: "center" }}>
                                                <i className="bi bi-check-lg text-white" style={{ fontSize: "16px", margin: "auto" }}></i>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-center mt-2 small fw-medium text-dark">ងងឹត (Dark)</p>
                            </button>
                        </div>
                    </div>

                    {/* Brand Color */}
                    <div className="mb-4 pb-4 border-bottom">
                        <div className="mb-3">
                            <h6 className="fw-semibold mb-1">ពណ៌ចម្បង (Brand color)</h6>
                            <p className="text-muted small">ជ្រើសរើស ឬកំណត់ពណ៌ចម្បងសម្រាប់កម្មវិធីរបស់អ្នក។</p>
                        </div>
                        <div className="d-flex gap-3 align-items-center mb-3">
                            {colorPresets.map((color, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className="p-0 border-0 rounded-circle"
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        background: color,
                                        boxShadow: settings.primaryColor === color ? "0 0 0 3px rgba(9,105,218,0.2)" : "none",
                                        border: settings.primaryColor === color ? "3px solid #0969DA" : "none",
                                    }}
                                    onClick={() => updateSetting("primaryColor", color)}
                                />
                            ))}
                        </div>
                        <div className="d-flex gap-3 align-items-center">
                            <label className="form-label small fw-medium mb-0 me-2 text-secondary">កំណត់ពណ៌ផ្ទាល់ខ្លួន៖</label>
                            <span className="small fw-semibold">{settings.primaryColor}</span>
                            <input
                                type="color"
                                className="form-control-color p-0 border-0"
                                value={settings.primaryColor}
                                onChange={(e) => updateSetting("primaryColor", e.target.value)}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    boxShadow: settings.primaryColor ? "0 0 0 3px rgba(9,105,218,0.2)" : "none",
                                    border: "3px solid #0969DA",
                                }}
                            />
                        </div>
                    </div>

                    {/* Language */}
                    <div>
                        <div className="mb-3">
                            <h6 className="fw-semibold mb-1">ភាសា (Language)</h6>
                            <p className="text-muted small">ជ្រើសរើសភាសាដែលអ្នកចង់ប្រើប្រាស់។</p>
                        </div>
                        <div className="d-flex flex-wrap gap-4">
                            <button
                                type="button"
                                className="p-0 border-0 bg-transparent"
                                onClick={() => updateSetting("language", "km")}
                            >
                                <div
                                    className={`p-3 rounded-3 border-2 transition-all d-flex align-items-center gap-3 ${settings.language === "km" ? "border-primary bg-white shadow-sm" : "border-light bg-light"}`}
                                    style={{
                                        minWidth: "180px",
                                        borderStyle: "solid",
                                        borderColor: settings.language === "km" ? "#0969DA" : "#d1d5db",
                                    }}
                                >
                                    <img src="/images/Icon/Cambodia.png" alt="KH" style={{ width: "32px", height: "auto" }} />
                                    <span className="fw-semibold text-dark">ភាសាខ្មែរ</span>
                                </div>
                            </button>

                            <button
                                type="button"
                                className="p-0 border-0 bg-transparent"
                                onClick={() => updateSetting("language", "en")}
                            >
                                <div
                                    className={`p-3 rounded-3 border-2 transition-all d-flex align-items-center gap-3 ${settings.language === "en" ? "border-primary bg-white shadow-sm" : "border-light bg-light"}`}
                                    style={{
                                        minWidth: "180px",
                                        borderStyle: "solid",
                                        borderColor: settings.language === "en" ? "#0969DA" : "#d1d5db",
                                    }}
                                >
                                    <img src="/images/Icon/england.png" alt="EN" style={{ width: "32px", height: "auto" }} />
                                    <span className="fw-semibold text-dark">English</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
