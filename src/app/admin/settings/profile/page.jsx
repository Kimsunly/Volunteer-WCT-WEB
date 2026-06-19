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

export default function AdminProfileSettingsPage() {
  const { setUser, refreshUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(
    "/images/ORG/computer-icons-user-profile-circle-abstract.jpg"
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "", // Read only
    phone: "",
    location: "",
    about_me: "",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile();
      if (data) {
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          about_me: data.about_me || "",
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
      }
    } catch (error) {
      console.error("Failed to fetch admin profile:", error);
      toast.error("បរាជ័យក្នុងការទាញយកទិន្នន័យ / Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    const oldAvatarUrl = avatarUrl;
    setAvatarUrl(previewUrl);

    // Upload immediately
    const uploadToast = toast.loading("កំពុងផ្លាស់ប្តូររូបភាព... / Changing avatar...");
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

      // Update global context
      setUser((prev) => prev ? ({
        ...prev,
        avatar: finalUrl,
        avatar_url: finalUrl,
      }) : prev);

      toast.success("បានផ្លាស់ប្តូររូបភាពដោយជោគជ័យ / Avatar changed successfully", { id: uploadToast });
      await refreshUser();
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("បរាជ័យក្នុងការផ្លាស់ប្តូររូបភាព / Failed to upload avatar", { id: uploadToast });
      setAvatarUrl(oldAvatarUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile(formData);
      toast.success("បានរក្សាទុកការកែប្រែដោយជោគជ័យ / Profile updated successfully");
      await refreshUser();
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("បរាជ័យក្នុងការរក្សាទុក / Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div>
          <h1 className="page-title">Profile Settings</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "4px", marginBottom: 0 }}>
            កែប្រែព័ត៌មានផ្ទាល់ខ្លួនរបស់គណនីអភិបាល / Edit your admin account information
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-5">
          <div className="flex items-center justify-center gap-2" style={{ color: "var(--color-text-muted)" }}>
            <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }}></i>
            Loading profile...
          </div>
        </div>
      ) : (
        <div className="card" style={{ maxWidth: "800px", padding: "24px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Profile Avatar Upload */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--color-border)", paddingBottom: "24px" }}>
              <div 
                style={{ 
                  width: "120px", 
                  height: "120px", 
                  borderRadius: "50%", 
                  overflow: "hidden", 
                  position: "relative",
                  border: "3px solid var(--color-accent)",
                  boxShadow: "var(--shadow-card)"
                }}
              >
                <Image
                  src={avatarUrl}
                  alt="Admin Profile"
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: "8px 16px", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "8px" }}
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="bi bi-camera"></i> ជ្រើសរើសរូបភាព / Change Photo
              </button>
            </div>

            {/* Form Fields Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="first_name" style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--color-text-primary)" }}>
                  នាមខ្លួន / First Name
                </label>
                <input
                  id="first_name"
                  type="text"
                  className="search-input"
                  style={{ padding: "10px 14px", borderRadius: "var(--radius-btn)" }}
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="last_name" style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--color-text-primary)" }}>
                  នាមត្រកូល / Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  className="search-input"
                  style={{ padding: "10px 14px", borderRadius: "var(--radius-btn)" }}
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="email" style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--color-text-primary)" }}>
                  អ៊ីមែល / Email (អានតែប៉ុណ្ណោះ / Read-only)
                </label>
                <input
                  id="email"
                  type="email"
                  className="search-input"
                  style={{ padding: "10px 14px", borderRadius: "var(--radius-btn)", opacity: 0.7, backgroundColor: "var(--color-bg-input)", cursor: "not-allowed" }}
                  placeholder="Email"
                  value={formData.email}
                  disabled
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="phone" style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--color-text-primary)" }}>
                  ទូរស័ព្ទ / Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="search-input"
                  style={{ padding: "10px 14px", borderRadius: "var(--radius-btn)" }}
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="location" style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--color-text-primary)" }}>
                  ទីតាំង / Location
                </label>
                <input
                  id="location"
                  type="text"
                  className="search-input"
                  style={{ padding: "10px 14px", borderRadius: "var(--radius-btn)" }}
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Biography / Bio */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label htmlFor="about_me" style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--color-text-primary)" }}>
                អំពីខ្ញុំ / About Me
              </label>
              <textarea
                id="about_me"
                className="search-input"
                style={{ padding: "10px 14px", borderRadius: "var(--radius-btn)", minHeight: "100px", resize: "vertical" }}
                placeholder="Brief biography..."
                value={formData.about_me}
                onChange={handleChange}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid var(--color-border)", paddingTop: "20px", marginTop: "10px" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={fetchProfile}
                disabled={saving}
                style={{ padding: "10px 20px" }}
              >
                បោះបង់ / Reset
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
                style={{ padding: "10px 24px", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                {saving ? (
                  <>
                    <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }}></i>
                    កំពុងរក្សាទុក... / Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle"></i> រក្សាទុក / Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}
