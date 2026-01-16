"use client";

import { usePathname } from "next/navigation";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    // Determine which sidebar item is active based on pathname
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
        return "dashboard";
    };

    return (
        <>
            <AdminNavbar title="Admin Panel" subtitle="Manage your platform" />
            <div className="container-fluid py-4">
                <div className="row g-3">
                    <AdminSidebar active={getActiveSection()} />
                    <main className="col-lg-9 col-xl-10">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
