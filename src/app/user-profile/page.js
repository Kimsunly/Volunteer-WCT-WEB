"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    ProfileHeader,
    AccountSettingsModal,
    RoleGuard,
    Tabs,
    OverviewPane,
    ActivitiesPane,
    RegistrationsPane,
    AchievementsPane,
    RecommendationsPane,
    ConnectionsPane,
    FavoritesPane,
} from "./components";
import SettingsPane from "./components/panes/SettingsPane";

export default function UserProfilePage() {
    const router = useRouter();
    // Controlled tab (we will NOT use Bootstrap's tab JS)
    const [activeTab, setActiveTab] = useState("overview"); // overview | activities | registrations | achievements | connections | recs

    // Account settings modal state
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Authentication and role handling via context (avoids SSR/localStorage issues)
    const { user: authUser, loading } = useAuth();

    // Prevent back-button access after logout or redirect organizers
    useEffect(() => {
        if (!loading) {
            if (!authUser) {
                router.push("/auth/login");
            } else if (authUser.role === "organizer") {
                router.push("/organizer/profile");
            }
        }
    }, [authUser, loading, router]);

    if (loading) return <div className="min-vh-100 d-flex align-items-center justify-content-center">Loading...</div>;
    if (!authUser || authUser.role === "organizer") return null; // Hide content while redirecting

    const roleAllowed = !!authUser && authUser.role === "user";

    // User for header: prefer authenticated user, fallback to mock
    const profileUser = authUser
        ? {
            name: (authUser.first_name && authUser.last_name)
                ? `${authUser.first_name} ${authUser.last_name}`
                : (authUser.name ?? "អ្នកប្រើប្រាស់"),
            avatar: authUser.avatar_url ?? authUser.profileImage ?? "/images/profile.png",
            tierLabel: authUser.role === "organizer" ? "Organizer" : (authUser.volunteer_level ?? authUser.tierLabel ?? "Volunteer"),
            notifCount: Array.isArray(authUser.notifications) ? authUser.notifications.length : 0,
            providers: authUser.providers ?? [],
            status: authUser.status,
        }
        : {
            name: "ដារា លី",
            avatar: "/images/profile.png",
            tierLabel: "Gold Volunteer",
            notifCount: 2,
            providers: [],
            status: null,
        };

    return (
        <main className="flex-grow-1" style={{ marginTop: 130 }}>
            <div className="container pt-4 pb-5">
                {/* Role guard (banner + content disabling) */}
                <RoleGuard enabled={!loading && !roleAllowed} />

                {/* Header: avatar, name, badges, notifications, gear (modal) */}
                <ProfileHeader
                    user={profileUser}
                    onOpenSettings={() => setSettingsOpen(true)}
                />

                {/* Tabs */}
                <Tabs
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    tabs={[
                        { id: "overview", icon: "bi bi-grid-3x3-gap", label: "សង្ខេបសកម្មភាព" },
                        { id: "activities", icon: "bi bi-calendar2-check", label: "សកម្មភាព" },
                        { id: "registrations", icon: "bi bi-ticket-perforated", label: "ការចុះឈ្មោះរបស់ខ្ញុំ" },
                        { id: "achievements", icon: "bi bi-award", label: "សមិទ្ធិផល" },
                        { id: "connections", icon: "bi bi-link-45deg", label: "តំណភ្ជាប់" },
                        { id: "recs", icon: "bi bi-heart", label: "ការណែនាំ" },
                        { id: "favorites", icon: "bi bi-heart-fill text-danger", label: "ឱកាសពេញចិត្ត" },
                        { id: "settings", icon: "bi bi-gear", label: "ការកំណត់" },
                    ]}
                />

                {/* Tab panes — we disable interactions if not allowed */}
                <div className={`tab-content mt-4 w-100 ${(!loading && !roleAllowed) ? "opacity-50 pe-none" : ""}`}>
                    {activeTab === "overview" && <OverviewPane />}
                    {activeTab === "activities" && <ActivitiesPane />}
                    {activeTab === "registrations" && <RegistrationsPane />}
                    {activeTab === "achievements" && <AchievementsPane />}
                    {activeTab === "connections" && <ConnectionsPane providers={profileUser.providers} />}
                    {activeTab === "recs" && <RecommendationsPane />}
                    {activeTab === "favorites" && <FavoritesPane />}
                    {activeTab === "settings" && <SettingsPane />}
                </div>
            </div>

            {/* Account Settings Modal (React-based, no Bootstrap JS required) */}
            <AccountSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </main>
    );
}
