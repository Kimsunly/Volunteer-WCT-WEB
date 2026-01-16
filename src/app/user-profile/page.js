"use client";

import React, { useState } from "react";
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
} from "./components";

export default function UserProfilePage() {
    // Controlled tab (we will NOT use Bootstrap's tab JS)
    const [activeTab, setActiveTab] = useState("overview"); // overview | activities | registrations | achievements | recs

    // Account settings modal state
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Authentication and role handling via context (avoids SSR/localStorage issues)
    const { user: authUser, loading } = useAuth();
    const roleAllowed = !!authUser && authUser.role === "user";

    // User for header: prefer authenticated user, fallback to mock
    const profileUser = authUser
        ? {
            name: (authUser.first_name && authUser.last_name)
                ? `${authUser.first_name} ${authUser.last_name}`
                : (authUser.name ?? "អ្នកប្រើប្រាស់"),
            avatar: authUser.avatar_url ?? authUser.profileImage ?? "/images/profile.png",
            tierLabel: authUser.volunteer_level ?? authUser.tierLabel ?? "Volunteer",
            rating: authUser.rating ?? 4.5,
            ratingText: String(authUser.rating ?? 4.8),
            notifCount: Array.isArray(authUser.notifications) ? authUser.notifications.length : 0,
        }
        : {
            name: "ដារា លី",
            avatar: "/images/profile.png",
            tierLabel: "Gold Volunteer",
            rating: 4.5,
            ratingText: "4.8",
            notifCount: 2,
        };

    return (
        <main className="flex-grow-1" style={{ marginTop: 130 }}>
            <div className="container py-4">
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
                        { id: "recs", icon: "bi bi-heart", label: "ការណែនាំ" },
                    ]}
                />

                {/* Tab panes — we disable interactions if not allowed */}
                <div className={`tab-content mt-4 w-100 ${(!loading && !roleAllowed) ? "opacity-50 pe-none" : ""}`}>
                    {activeTab === "overview" && <OverviewPane />}
                    {activeTab === "activities" && <ActivitiesPane />}
                    {activeTab === "registrations" && <RegistrationsPane />}
                    {activeTab === "achievements" && <AchievementsPane />}
                    {activeTab === "recs" && <RecommendationsPane />}
                </div>
            </div>

            {/* Account Settings Modal (React-based, no Bootstrap JS required) */}
            <AccountSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </main>
    );
}
