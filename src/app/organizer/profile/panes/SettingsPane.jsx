"use client";

import React, { useState, useEffect, useRef } from "react";
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
    const [avatarPreview, setAvatarPreview] = useState(
        buildApiUrl(profile?.logo_url) ||
        user?.avatar_url ||
        user?.avatar ||
        "/images/ORG/company-icon.png"
    );
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

    // Track which profile ID we last initialised from so we only reset
    // the form when a genuinely different profile is loaded, not on every
    // parent re-render that creates a new object reference.
    const initialisedProfileId = useRef(profile?.id ?? null);

    useEffect(() => {
        if (!profile) return;
        // Only reset if this is a different profile record
        if (initialisedProfileId.current === profile.id) return;
        initialisedProfileId.current = profile.id;

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
        const logoSrc = buildApiUrl(profile.logo_url) || user?.avatar_url || user?.avatar || null;
        if (logoSrc) {
            setAvatarPreview(logoSrc);
        }
    }, [profile]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show immediate local preview while uploading
        const blobUrl = URL.createObjectURL(file);
        setAvatarPreview(blobUrl);

        setAvatarLoading(true);
        try {
            const res = await uploadOrganizerAvatar(file);
            // The API wraps the payload: { success, data: { logo_url, data: profile } }
            const newLogoUrl = res?.data?.logo_url || res?.logo_url;
            const absoluteLogoUrl = newLogoUrl ? buildApiUrl(newLogoUrl) : null;

            // Add a cache-busting query param so the browser always re-fetches
            // even if the server reused the same filename for dedup reasons
            const cacheBustedUrl = absoluteLogoUrl
                ? `${absoluteLogoUrl}?t=${Date.now()}`
                : null;

            if (cacheBustedUrl) {
                setAvatarPreview(cacheBustedUrl);
            }

            toast.success("រូបភាពត្រូវបានបញ្ចូលដោយជោគជ័យ!");

            // Refresh parent data first (fetchData → setOrgProfile)
            if (onUpdate) await onUpdate();

            // THEN sync navbar — called last so it overrides any stale value
            // that the page's logo-sync useEffect may have written
            if (cacheBustedUrl) {
                setUser((prev) =>
                    prev
                        ? { ...prev, avatar_url: cacheBustedUrl, avatar: cacheBustedUrl, profileImage: cacheBustedUrl }
                        : prev
                );
                setAvatarPreview(cacheBustedUrl);
            }
        } catch (error) {
            console.error("Avatar uploader error:", error);
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
            {/* Organization Settings Card */}
            <div className="vh-section-card" data-aos="fade-up">
                <div className="section-card-header">
                    <h5 className="mb-0 fw-bold title-theme">ការកំណត់អង្គការ</h5>
                    <p className="text-secondary-theme small mb-0">គ្រប់គ្រងព័ត៌មានមូលដ្ឋាន និងអត្តសញ្ញាណរបស់អង្គការអ្នក</p>
                </div>
                <div className="section-card-body pt-4">
                    <form onSubmit={handleSubmit}>
                        {/* Avatar uploader */}
                        <div className="d-flex flex-column align-items-center mb-5">
                            <div className="position-relative">
                                <div className={`uploader-avatar-bubble ${avatarLoading ? "opacity-50" : ""}`} style={{ width: "120px", height: "120px" }}>
                                    <Image
                                        src={avatarPreview}
                                        alt="រូបតំណាង"
                                        fill
                                        className="rounded-circle object-fit-cover shadow-sm avatar-preview-img"
                                        unoptimized
                                    />
                                    {avatarLoading && (
                                        <div className="position-absolute top-50 start-50 translate-middle">
                                            <div className="spinner-border spinner-border-sm text-accent-theme" role="status"></div>
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="orgAvatarInput"
                                    className="position-absolute bottom-0 end-0 uploader-camera-btn cursor-pointer"
                                    style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
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
                            <span className="small text-secondary-theme mt-2">ប្តូររូបភាព Profile</span>
                        </div>

                        {/* Form Fields */}
                        <div className="row g-4">
                            <div className="col-md-6 premium-field-wrapper">
                                <label className="premium-field-label">ឈ្មោះអង្គការ</label>
                                <div className="premium-input-box">
                                    <div className="premium-input-icon"><i className="bi bi-building"></i></div>
                                    <input
                                        type="text"
                                        className="premium-input-field"
                                        placeholder="ឈ្មោះអង្គការរបស់អ្នក"
                                        value={form.organization_name}
                                        onChange={(e) => setForm({ ...form, organization_name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 premium-field-wrapper">
                                <label className="premium-field-label">ប្រភេទអង្គការ</label>
                                <div className="premium-input-box">
                                    <div className="premium-input-icon"><i className="bi bi-tag"></i></div>
                                    <select
                                        className="premium-input-field premium-select-field"
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

                            <div className="col-md-6 premium-field-wrapper">
                                <label className="premium-field-label">អ្នកទំនាក់ទំនង (Contact Person)</label>
                                <div className="premium-input-box">
                                    <div className="premium-input-icon"><i className="bi bi-person"></i></div>
                                    <input
                                        type="text"
                                        className="premium-input-field"
                                        placeholder="ឈ្មោះអ្នកទំនាក់ទំនងផ្ទាល់"
                                        value={form.contact_person}
                                        onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 premium-field-wrapper">
                                <label className="premium-field-label">អ៊ីមែល (Email)</label>
                                <div className="premium-input-box">
                                    <div className="premium-input-icon"><i className="bi bi-envelope"></i></div>
                                    <input
                                        type="email"
                                        className="premium-input-field"
                                        placeholder="example@org.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 premium-field-wrapper">
                                <label className="premium-field-label">លេខទូរស័ព្ទ</label>
                                <div className="premium-input-box">
                                    <div className="premium-input-icon"><i className="bi bi-phone"></i></div>
                                    <input
                                        type="tel"
                                        className="premium-input-field"
                                        placeholder="012 345 678"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 premium-field-wrapper">
                                <label className="premium-field-label">គេហទំព័រ (Website)</label>
                                <div className="premium-input-box">
                                    <div className="premium-input-icon"><i className="bi bi-globe"></i></div>
                                    <input
                                        type="url"
                                        className="premium-input-field"
                                        placeholder="https://example.com"
                                        value={form.website}
                                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 premium-field-wrapper">
                                <label className="premium-field-label">លេខចុះបញ្ជី (Registration Number)</label>
                                <div className="premium-input-box">
                                    <div className="premium-input-icon"><i className="bi bi-card-text"></i></div>
                                    <input
                                        type="text"
                                        className="premium-input-field"
                                        placeholder="ឧ. លេខចុះបញ្ជីផ្លូវការ..."
                                        value={form.registration_number}
                                        onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-12 premium-field-wrapper">
                                <label className="premium-field-label">អាសយដ្ឋាន</label>
                                <div className="premium-input-box">
                                    <div className="premium-input-icon"><i className="bi bi-geo-alt"></i></div>
                                    <input
                                        type="text"
                                        className="premium-input-field"
                                        placeholder="ផ្លូវ លេខផ្ទះ ខណ្ឌ/ក្រុង..."
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-12 premium-field-wrapper">
                                <label className="premium-field-label">អំពីអង្គការ</label>
                                <div className="premium-input-box align-items-start pt-2">
                                    <div className="premium-input-icon mt-1"><i className="bi bi-chat-left-text"></i></div>
                                    <textarea
                                        className="premium-input-field"
                                        rows="4"
                                        placeholder="រៀបរាប់បន្តិចអំពីបេសកកម្មរបស់អង្គការអ្នក..."
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        style={{ resize: "none" }}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 d-flex justify-content-end border-top-theme pt-4">
                            <button
                                type="submit"
                                className="btn btn-save-accent"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        កំពុងរក្សាទុក...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle me-1"></i>
                                        រក្សាទុកការផ្លាស់ប្តូរ
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Interface Theme / Appearance Card */}
            <div className="vh-section-card" data-aos="fade-up">
                <div className="section-card-header">
                    <h5 className="mb-0 fw-bold title-theme">ការកំណត់ការបង្ហាញ (Appearance)</h5>
                    <p className="text-secondary-theme small mb-0">ជ្រើសរើស ឬកែសម្រួលរូបរាង និងពណ៌នៃកម្មវិធី</p>
                </div>
                <div className="section-card-body pt-4">
                    {/* Interface Theme */}
                    <div className="mb-4 pb-4 border-bottom-theme">
                        <div className="mb-3">
                            <h6 className="fw-semibold mb-1 title-theme">រូបរាងចំណុចប្រទាក់ (Interface theme)</h6>
                            <p className="text-secondary-theme small">ជ្រើសរើសរូបរាងចំណុចប្រទាក់សម្រាប់គណនីរបស់អ្នក។</p>
                        </div>
                        <div className="d-flex flex-wrap gap-4">
                            {/* System Preference */}
                            <button
                                type="button"
                                className="p-0 border-0 bg-transparent"
                                onClick={() => updateSetting("theme", "system")}
                            >
                                <div
                                    className={`p-2 rounded-4 border border-3 transition-all ${settings.theme === "system" ? "border-accent-active" : "border-transparent-inactive"}`}
                                >
                                    <div
                                        style={{
                                            width: "180px",
                                            height: "120px",
                                            borderRadius: "12px",
                                            background: "linear-gradient(90deg, #ffffff 50%, #1a1a1a 50%)",
                                            border: "1px solid var(--color-border)",
                                            position: "relative",
                                        }}
                                    >
                                        <div style={{ position: "absolute", top: "10px", left: "10px", width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }}></div>
                                        <div style={{ position: "absolute", top: "10px", left: "30px", width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }}></div>
                                        <div style={{ position: "absolute", top: "10px", left: "50px", width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }}></div>
                                        <div style={{ position: "absolute", top: "40px", left: "15px", right: "15px", height: "12px", borderRadius: "4px", background: "rgba(100,100,100,0.3)" }}></div>
                                        <div style={{ position: "absolute", top: "60px", left: "15px", right: "40px", height: "12px", borderRadius: "4px", background: "rgba(100,100,100,0.2)" }}></div>
                                        <div style={{ position: "absolute", top: "80px", left: "15px", right: "60px", height: "12px", borderRadius: "4px", background: "rgba(100,100,100,0.2)" }}></div>
                                        {settings.theme === "system" && (
                                            <div style={{ position: "absolute", bottom: "10px", right: "10px", width: "28px", height: "28px", borderRadius: "50%", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <i className="bi bi-check-lg text-black" style={{ fontSize: "16px", margin: "auto" }}></i>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-center mt-2 small fw-semibold title-theme">ប្រព័ន្ធ (System)</p>
                            </button>

                            {/* Light Mode */}
                            <button
                                type="button"
                                className="p-0 border-0 bg-transparent"
                                onClick={() => updateSetting("theme", "light")}
                            >
                                <div
                                    className={`p-2 rounded-4 border border-3 transition-all ${settings.theme === "light" ? "border-accent-active" : "border-transparent-inactive"}`}
                                >
                                    <div
                                        style={{
                                            width: "180px",
                                            height: "120px",
                                            borderRadius: "12px",
                                            background: "#ffffff",
                                            border: "1px solid #E5E7EB",
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
                                            <div style={{ position: "absolute", bottom: "10px", right: "10px", width: "28px", height: "28px", borderRadius: "50%", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <i className="bi bi-check-lg text-black" style={{ fontSize: "16px", margin: "auto" }}></i>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-center mt-2 small fw-semibold title-theme">ភ្លឺ (Light)</p>
                            </button>

                            {/* Dark Mode */}
                            <button
                                type="button"
                                className="p-0 border-0 bg-transparent"
                                onClick={() => updateSetting("theme", "dark")}
                            >
                                <div
                                    className={`p-2 rounded-4 border border-3 transition-all ${settings.theme === "dark" ? "border-accent-active" : "border-transparent-inactive"}`}
                                >
                                    <div
                                        style={{
                                            width: "180px",
                                            height: "120px",
                                            borderRadius: "12px",
                                            background: "#1a1a1a",
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
                                            <div style={{ position: "absolute", bottom: "10px", right: "10px", width: "28px", height: "28px", borderRadius: "50%", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <i className="bi bi-check-lg text-black" style={{ fontSize: "16px", margin: "auto" }}></i>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-center mt-2 small fw-semibold title-theme">ងងឹត (Dark)</p>
                            </button>
                        </div>
                    </div>

                    {/* Brand Color */}
                    <div className="mb-4 pb-4 border-bottom-theme">
                        <div className="mb-3">
                            <h6 className="fw-semibold mb-1 title-theme">ពណ៌ចម្បង (Brand color)</h6>
                            <p className="text-secondary-theme small">ជ្រើសរើស ឬកំណត់ពណ៌ចម្បងសម្រាប់កម្មវិធីរបស់អ្នក។</p>
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
                                        background: color === "#000000" ? "var(--color-accent)" : color,
                                        boxShadow: settings.primaryColor === color ? "0 0 0 3px var(--color-accent-glow)" : "none",
                                        border: settings.primaryColor === color ? "3px solid var(--color-accent)" : "none",
                                    }}
                                    onClick={() => updateSetting("primaryColor", color)}
                                />
                            ))}
                        </div>
                        <div className="d-flex gap-3 align-items-center">
                            <label className="form-label small fw-medium mb-0 me-2 text-secondary-theme">កំណត់ពណ៌ផ្ទាល់ខ្លួន៖</label>
                            <span className="small fw-semibold title-theme">{settings.primaryColor}</span>
                            <input
                                type="color"
                                className="form-control-color p-0 border-0 color-input-circle"
                                value={settings.primaryColor}
                                onChange={(e) => updateSetting("primaryColor", e.target.value)}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    boxShadow: settings.primaryColor ? "0 0 0 3px var(--color-accent-glow)" : "none",
                                    border: "3px solid var(--color-accent)",
                                }}
                            />
                        </div>
                    </div>

                    {/* Language */}
                    <div>
                        <div className="mb-3">
                            <h6 className="fw-semibold mb-1 title-theme">ភាសា (Language)</h6>
                            <p className="text-secondary-theme small">ជ្រើសរើសភាសាដែលអ្នកចង់ប្រើប្រាស់។</p>
                        </div>
                        <div className="d-flex flex-wrap gap-4">
                            <button
                                type="button"
                                className="p-0 border-0 bg-transparent"
                                onClick={() => updateSetting("language", "km")}
                            >
                                <div
                                    className={`p-3 rounded-3 border-2 transition-all d-flex align-items-center gap-3 ${settings.language === "km" ? "lang-btn-active" : "lang-btn-inactive"}`}
                                    style={{
                                        minWidth: "180px",
                                        borderStyle: "solid",
                                    }}
                                >
                                    <img src="/images/Icon/Cambodia.png" alt="KH" style={{ width: "32px", height: "auto" }} />
                                    <span className="fw-semibold title-theme">ភាសាខ្មែរ</span>
                                </div>
                            </button>

                            <button
                                type="button"
                                className="p-0 border-0 bg-transparent"
                                onClick={() => updateSetting("language", "en")}
                            >
                                <div
                                    className={`p-3 rounded-3 border-2 transition-all d-flex align-items-center gap-3 ${settings.language === "en" ? "lang-btn-active" : "lang-btn-inactive"}`}
                                    style={{
                                        minWidth: "180px",
                                        borderStyle: "solid",
                                    }}
                                >
                                    <img src="/images/Icon/england.png" alt="EN" style={{ width: "32px", height: "auto" }} />
                                    <span className="fw-semibold title-theme">English</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .vh-section-card {
                    background-color: var(--color-bg-card) !important;
                    border: 1px solid var(--color-border) !important;
                    border-radius: 20px !important;
                    box-shadow: var(--shadow-card) !important;
                    overflow: hidden;
                }
                .section-card-header {
                    border-bottom: 1px solid var(--color-border) !important;
                    padding: 24px !important;
                }
                .section-card-body {
                    padding: 24px !important;
                }

                .title-theme {
                    color: var(--color-text-primary) !important;
                }
                .text-secondary-theme {
                    color: var(--color-text-secondary) !important;
                }
                
                .uploader-avatar-bubble {
                    border: 3px solid var(--color-border);
                    border-radius: 50%;
                    padding: 2px;
                    background: var(--color-bg-base);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
                    position: relative;
                }
                .avatar-preview-img {
                    border-radius: 50%;
                }

                .uploader-camera-btn {
                    background: var(--color-accent) !important;
                    color: #000000 !important;
                    border-radius: 50%;
                    border: 2px solid var(--color-bg-card) !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    transition: all 0.2s;
                }
                .uploader-camera-btn:hover {
                    transform: scale(1.1);
                }

                .premium-field-wrapper {
                    display: flex;
                    flex-direction: column;
                }

                .premium-field-label {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--color-text-secondary);
                    margin-bottom: 8px;
                    transition: color 0.2s ease;
                }

                .premium-input-box {
                    display: flex;
                    align-items: center;
                    background-color: var(--color-bg-input) !important;
                    border: 1px solid var(--color-border) !important;
                    border-radius: 14px;
                    padding: 4px 8px;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    width: 100%;
                }
                .premium-input-box:hover {
                    border-color: var(--color-border-hover) !important;
                }
                .premium-input-box:focus-within {
                    border-color: var(--color-accent) !important;
                    box-shadow: 0 0 0 3px var(--color-accent-glow) !important;
                    background-color: var(--color-bg-card) !important;
                }

                .premium-field-wrapper:focus-within .premium-field-label {
                    color: var(--color-text-primary) !important;
                }

                .premium-input-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--color-bg-base);
                    color: var(--color-text-secondary);
                    transition: all 0.25s ease;
                    margin-right: 12px;
                    flex-shrink: 0;
                    font-size: 15px;
                }
                .premium-input-box:focus-within .premium-input-icon {
                    background: var(--color-accent-dim) !important;
                    color: var(--color-accent) !important;
                }

                .premium-input-field {
                    border: none !important;
                    background: transparent !important;
                    box-shadow: none !important;
                    padding: 8px 4px !important;
                    color: var(--color-text-primary) !important;
                    font-size: 14.5px;
                    width: 100%;
                    outline: none;
                    line-height: 1.5;
                }
                .premium-input-field::placeholder {
                    color: var(--color-text-muted) !important;
                }

                .premium-select-field {
                    cursor: pointer;
                    appearance: none !important;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
                    background-repeat: no-repeat !important;
                    background-position: right 12px center !important;
                    background-size: 14px 12px !important;
                    padding-right: 40px !important;
                }
                :global([data-theme="dark"]) .premium-select-field {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23FFFFFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
                }

                .border-top-theme {
                    border-top: 1px solid var(--color-border) !important;
                }
                .border-bottom-theme {
                    border-bottom: 1px solid var(--color-border) !important;
                }

                .btn-save-accent {
                    background-color: var(--color-accent) !important;
                    color: #000000 !important;
                    border: none !important;
                    font-weight: 700 !important;
                    border-radius: 100px !important;
                    padding: 10px 32px !important;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    box-shadow: 0 4px 12px var(--color-accent-glow) !important;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                :global([data-theme="light"]) .btn-save-accent {
                    color: #ffffff !important;
                    background-color: #15803d !important;
                    box-shadow: 0 4px 12px rgba(21, 128, 61, 0.25) !important;
                }
                .btn-save-accent:hover:not(:disabled) {
                    transform: scale(1.02) translateY(-1px) !important;
                    box-shadow: 0 6px 18px var(--color-accent-glow), 0 0 0 3px var(--color-accent-dim) !important;
                }
                :global([data-theme="light"]) .btn-save-accent:hover:not(:disabled) {
                    box-shadow: 0 6px 18px rgba(21, 128, 61, 0.35), 0 0 0 3px rgba(21, 128, 61, 0.15) !important;
                }

                /* Theme preferences */
                .border-accent-active {
                    border-color: var(--color-accent) !important;
                    box-shadow: 0 0 12px var(--color-accent-glow) !important;
                    background: var(--color-bg-input) !important;
                }
                .border-transparent-inactive {
                    border-color: transparent !important;
                    background: transparent !important;
                }
                .border-transparent-inactive:hover {
                    border-color: var(--color-border) !important;
                    background: var(--color-bg-input) !important;
                }

                /* Language select buttons */
                .lang-btn-active {
                    background: var(--color-accent-dim) !important;
                    border-color: var(--color-accent) !important;
                    box-shadow: 0 0 10px var(--color-accent-glow) !important;
                }
                .lang-btn-inactive {
                    background: var(--color-bg-input) !important;
                    border-color: var(--color-border) !important;
                }
                .lang-btn-inactive:hover {
                    border-color: var(--color-border-hover) !important;
                }
            `}</style>
        </div>
    );
}
