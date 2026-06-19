"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";
import RightPanel from "./components/RightPanel";
import { getUserProfile } from "@/services/user";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, setUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { settings, updateSetting } = useSettings();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const latestProfile = await getUserProfile();
        if (latestProfile) {
          setUser((prev) => ({
            ...prev,
            ...latestProfile,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch latest admin profile in layout:", err);
      }
    };
    if (user && user.role?.toLowerCase() === "admin") {
      fetchLatestProfile();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!loading && (!user || user.role?.toLowerCase() !== "admin")) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const getActiveSection = () => {
    if (pathname.includes("/admin/dashboard")) return "dashboard";
    if (pathname.includes("/admin/organizers")) return "organizers";
    if (pathname.includes("/admin/opportunities")) return "opportunities";
    if (pathname.includes("/admin/categories")) return "categories";
    if (pathname.includes("/admin/blogs")) return "blogs";
    if (pathname.includes("/admin/community")) return "community";
    if (pathname.includes("/admin/comments")) return "comments";
    if (pathname.includes("/admin/users")) return "users";
    if (pathname.includes("/admin/donations")) return "donations";
    if (pathname.includes("/admin/contact-messages")) return "contact-messages";
    if (pathname.includes("/admin/settings/profile")) return "settings-profile";
    if (pathname.includes("/admin/settings")) return "settings";
    return "dashboard";
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="dashboard-shell">
        <div className="sidebar"></div>
        <div className="main-area">
          <div className="topbar"></div>
          <div className="main-content flex items-center justify-center">
            <div style={{ color: "var(--color-text-primary)" }}>Loading...</div>
          </div>
        </div>
        <div className="right-panel"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="dashboard-shell">
      <AdminSidebar active={getActiveSection()} />
      <div className="main-area">
        <AdminNavbar />
        <div className="main-content">{children}</div>
      </div>
      <RightPanel />
    </div>
  );
}
