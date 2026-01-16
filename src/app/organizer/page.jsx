"use client";


import Image from "next/image";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  OrgBrand,
  CreateOpportunityModal,
  Tabs,
  OverviewPane,
  OpportunitiesPane,
  ApplicationsPane,
  AnalyticsPane,
  OpportunityDetailModal,
  EditOpportunityModal,
  SettingsPane,
} from "./profile";
import CommunityManager from "@/components/organizer/CommunityManager";
import { getMyOpportunities, createOpportunity, deleteOpportunity, updateOpportunity } from "@/services/opportunities";
import { getOrganizerApplications, updateApplicationStatus } from "@/services/applications";
import { getOrganizerProfile, getOrganizerDashboard } from "@/services/organizer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function OrgDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orgProfile, setOrgProfile] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);



  // Tabs (React-controlled)
  const [activeTab, setActiveTab] = useState("overview"); // overview | opportunities | applications | analytics | community | settings

  // Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);

  // Opportunities state + filters
  const [opSearch, setOpSearch] = useState("");
  const [opStatusFilter, setOpStatusFilter] = useState("all"); // all | active | closed | pending

  // Applications state + filters
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("");

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [oppsRes, appsRes, profileRes, dashRes] = await Promise.all([
        getMyOpportunities(),
        getOrganizerApplications(),
        getOrganizerProfile(),
        getOrganizerDashboard()
      ]);
      const dashboardStats = dashRes;

      // Map opportunities to UI expectation
      const mappedOpps = (oppsRes.data || []).map(op => ({
        id: op.id,
        titleKh: op.title,
        titleEn: op.title, // Fallback
        dateKh: op.date_range || "—",
        locationKh: op.location_label || op.location || "—",
        current: 0, // Need to fetch dynamicly if needed
        capacity: op.capacity || 0,
        registrations: 0, // Need stats
        status: op.status,
        image: Array.isArray(op.images) ? op.images[0] : (typeof op.images === 'string' ? op.images.split(',')[0] : "/images/ORG/Tree-conservation.png"),
        category: op.category_label || op.category,
        raw: op,
      }));

      // Map applications to UI expectation
      const mappedApps = (appsRes.data || []).map(app => ({
        id: app.id,
        avatar: app.user_avatar || "/images/ORG/computer-icons-user-profile-circle-abstract.jpg",
        nameKh: (app.user_first_name || app.user_last_name)
          ? `${app.user_first_name || ''} ${app.user_last_name || ''}`.trim()
          : app.name,
        nameEn: app.name,
        jobKh: app.opportunity_title || `ឱកាស #${app.opportunity_id}`,
        meta: `ជំនាញ៖ ${app.skills || '—'}`,
        dateKh: new Date(app.created_at).toLocaleDateString('km-KH'),
        status: app.status,
        // Full fields for modal
        email: app.user_email || app.email, // Prefer user profile email if available
        phone_number: app.user_phone || app.phone_number,
        message: app.message,
        cv_url: app.cv_url,
        skills: app.user_skills || app.skills, // Prefer user general skills, fallback to app specific
        availability: app.availability,
        sex: app.sex,
        // New Profile Fields
        bio: app.user_bio,
        address: app.user_address,
        education: app.user_education,
        experience: app.user_experience,
        interests: app.user_interests,
      }));

      setOpportunities(mappedOpps);
      setApplications(mappedApps);
      setOrgProfile(profileRes);
      setDashboardStats(dashRes || {});
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("បរាជ័យក្នុងការទាញយកទិន្នន័យ");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const filteredOps = useMemo(() => {
    const term = opSearch.trim().toLowerCase();
    return opportunities.filter((op) => {
      const matchStatus =
        opStatusFilter === "all" || op.status === opStatusFilter;
      const matchText =
        !term ||
        op.titleKh.toLowerCase().includes(term) ||
        op.locationKh.toLowerCase().includes(term);
      return matchStatus && matchText;
    });
  }, [opportunities, opSearch, opStatusFilter]);

  const filteredApps = useMemo(() => {
    const term = appSearch.trim().toLowerCase();
    return applications.filter((app) => {
      const matchStatus = !appStatusFilter || app.status === appStatusFilter;
      const matchText =
        !term ||
        app.nameKh.toLowerCase().includes(term) ||
        app.jobKh.toLowerCase().includes(term);
      return matchStatus && matchText;
    });
  }, [applications, appSearch, appStatusFilter]);

  // Stats for OverviewPane
  const stats = useMemo(() => {
    // Use fetched stats if available, otherwise fallback (or mix)
    if (dashboardStats) {
      return {
        activeOpps: dashboardStats.opportunities_count || 0,
        totalVolunteers: dashboardStats.applications_total || 0, // Mapping total applications to volunteers logic
        rating: 5.0,
        eventsThisMonth: dashboardStats.applications_pending || 0 // Re-purposing for now or just 0
      };
    }

    const activeOpps = opportunities.filter(o => o.status === 'active').length;
    const totalVolunteers = applications.length;

    return {
      activeOpps: activeOpps,
      totalVolunteers: totalVolunteers,
      rating: 5.0,
      eventsThisMonth: 0
    };
  }, [opportunities, applications, dashboardStats]);

  const recentApps = useMemo(() => applications.slice(0, 5), [applications]);


  const handleCreateOpportunity = async (payload) => {
    try {
      const formData = new FormData();
      formData.append("title", payload.titleKh);
      formData.append("description", payload.description || "");
      formData.append("category_label", payload.category);
      formData.append("location_label", payload.locationKh);
      formData.append("date_range", payload.dateISO || "");
      formData.append("time_range", payload.timeRange || "");
      formData.append("capacity", payload.capacity);
      formData.append("transport", payload.transport || "");
      formData.append("housing", payload.housing || "");
      formData.append("meals", payload.meals || "");
      formData.append("skills", JSON.stringify(payload.skills || []));
      formData.append("tasks", JSON.stringify(payload.tasks || []));
      formData.append("impact_description", payload.impactDescription || "");
      formData.append("organization", user?.name || "អង្គការ");
      formData.append("is_private", payload.visibility === "private");
      if (payload.visibility === "private" && payload.accessCode) {
        formData.append("access_key", payload.accessCode);
      }
      if (payload.imageFile) {
        formData.append("images", payload.imageFile);
      }

      await createOpportunity(formData);
      setCreateOpen(false);
      fetchData(); // Refresh
      toast.success("បានបង្កើតឱកាសដោយជោគជ័យ!");
    } catch (error) {
      console.error("Create opportunity error:", error);
      toast.error("បរាជ័យក្នុងការបង្កើតឱកាស");
    }
  };

  const handleUpdateOpportunity = async (payload) => {
    try {
      // payload: { id, titleKh, titleEn, description, locationKh, dateISO, category, capacity, status, imageFile }
      // For now, text-only update using PATCH. 
      // If imageFile is provided, we might need a separate call or multipart patch.
      const updateData = {
        title: payload.titleKh, // Backend expects 'title'
        // title_en: payload.titleEn, // Ignored by backend model if not present
        description: payload.description,
        location_label: payload.locationKh,
        date_range: payload.dateISO || null,
        time_range: payload.timeRange || null,
        category_label: payload.category,
        capacity: payload.capacity,
        transport: payload.transport,
        housing: payload.housing,
        meals: payload.meals,
        skills: payload.skills,
        tasks: payload.tasks,
        impact_description: payload.impactDescription,
        status: payload.status,
        is_private: payload.visibility === "private",
        access_key: payload.accessCode || null,
      };

      await updateOpportunity(payload.id, updateData);
      setEditOpen(false);
      fetchData();
      toast.success("បានកែប្រែទិន្នន័យដោយជោគជ័យ!");
    } catch (error) {
      console.error("Update opportunity error:", error);
      toast.error("បរាជ័យក្នុងការកែប្រែទិន្នន័យ");
    }
  };

  const handleOpStatusUpdate = async (id, status) => {
    try {
      await updateOpportunity(id, { status });
      fetchData();
      toast.success(`បានប្តូរស្ថានភាពទៅជា ${status}`);
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("បរាជ័យក្នុងការប្តូរស្ថានភាព");
    }
  };

  const handleDeleteOpportunity = async (id) => {
    if (!window.confirm("តើអ្នកពិតជាចង់លុបឱកាសនេះមែនទេ?")) return;
    try {
      await deleteOpportunity(id);
      fetchData();
      toast.success("បានលុបឱកាសដោយជោគជ័យ!");
    } catch (error) {
      console.error("Delete opportunity error:", error);
      toast.error("បរាជ័យក្នុងការលុបឱកាស");
    }
  };

  const handleAppStatusUpdate = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពស្ថានភាព");
    }
  };

  const org = {
    logo: orgProfile?.card_image_url || user?.profileImage || "/images/ORG/company-icon.png",
    nameKh: orgProfile?.organization_name || user?.name || "អ្នករៀបចំ",
    nameEn: user?.role === "organizer" ? "Verified Organizer" : "Pending Approval",
    isVerified: !!orgProfile?.verified_at,
  };

  if (authLoading) return <div>Loading...</div>;

  return (
    <main className="flex-grow-1 org-dashboard">
      <div className="container py-4">
        {/* Role Guard */}
        {user?.role !== "organizer" && (
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <i className="bi bi-shield-lock-fill me-2"></i>
            <div>
              សម្រាប់ Organizer ដែលត្រូវបានបញ្ជាក់ដោយ Admin ប៉ុណ្ណោះ។ សូមចូលគណនី
              Organizer ឬស្នើសុំការផ្ទៀងផ្ទាត់។
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Org brand header + CTA */}
        <OrgBrand org={org} onCreate={() => setCreateOpen(true)} />

        {/* Tabs */}
        <Tabs
          active={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: "overview", label: "ទិដ្ឋភាពទូទៅ" },
            { id: "opportunities", label: "ឱកាស" },
            { id: "applications", label: "ការដាក់ពាក្យ" },
            { id: "analytics", label: "វិភាគទិន្នន័យ" },
            { id: "community", label: "សហគមន៍" },
            { id: "settings", label: "ការកំណត់" },
          ]}
        />

        {/* Panes */}
        <div className={`tab-content mt-4 w-100 ${user?.role !== "organizer" ? "opacity-50 pe-none" : ""}`}>
          {activeTab === "overview" && (
            <OverviewPane
              stats={stats}
              recentApps={recentApps}
            />
          )}

          {activeTab === "opportunities" && (
            <OpportunitiesPane
              items={filteredOps}
              search={opSearch}
              onSearch={setOpSearch}
              statusFilter={opStatusFilter}
              onStatusFilter={setOpStatusFilter}
              onCreate={() => setCreateOpen(true)}
              onView={(op) => {
                setSelectedOp(op);
                setDetailOpen(true);
              }}
              onEdit={(op) => {
                setSelectedOp(op);
                setEditOpen(true);
              }}
              onDelete={handleDeleteOpportunity}
              onStatusUpdate={handleOpStatusUpdate}
            />
          )}

          {activeTab === "applications" && (
            <ApplicationsPane
              items={filteredApps}
              search={appSearch}
              onSearch={setAppSearch}
              statusFilter={appStatusFilter}
              onStatusFilter={setAppStatusFilter}
              onApprove={(id) => handleAppStatusUpdate(id, "approved")}
              onReject={(id) => handleAppStatusUpdate(id, "rejected")}
              onPending={(id) => handleAppStatusUpdate(id, "pending")}
            />
          )}

          {activeTab === "analytics" && <AnalyticsPane />}

          {activeTab === "community" && <CommunityManager />}

          {activeTab === "settings" && (
            <SettingsPane
              profile={orgProfile}
              onUpdate={fetchData}
            />
          )}
        </div>
      </div>

      {/* Create Opportunity Modal (React) */}
      <CreateOpportunityModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateOpportunity}
      />

      {/* Opportunity Detail Modal */}
      <OpportunityDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        opportunity={selectedOp}
        onEdit={(op) => {
          setSelectedOp(op);
          setEditOpen(true);
        }}
        onDelete={handleDeleteOpportunity}
      />

      {/* Edit Opportunity Modal */}
      <EditOpportunityModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        opportunity={selectedOp}
        onSubmit={handleUpdateOpportunity}
      />
    </main>
  );
}
``;
