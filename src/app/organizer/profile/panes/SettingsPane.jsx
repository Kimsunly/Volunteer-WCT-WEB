"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { updateOrganizerProfile, uploadOrganizerAvatar } from "@/services/organizer";

export default function SettingsPane({ profile, onUpdate }) {
    const [loading, setLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(profile?.card_image_url || "/images/ORG/Tree-conservation.png");
    const [form, setForm] = useState({
        organization_name: profile?.organization_name || "",
        organizer_type: profile?.organizer_type || "ngo",
        phone: profile?.phone || "",
        website: profile?.website || "",
        address: profile?.address || "",
        description: profile?.description || "",
        contact_person: profile?.contact_person || "",
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
            });
            if (profile.card_image_url) {
                setAvatarPreview(profile.card_image_url);
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
            toast.success("រូបភាពត្រូវបានបញ្ចូលដោយជោគជ័យ!");
            if (onUpdate) onUpdate();
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
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("បរាជ័យក្នុងការរក្សាទុកព័ត៌មាន");
        } finally {
            setLoading(false);
        }
    };

    return (
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
    );
}
