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
  ReportedCommentsPane,
} from "./profile";
import CommunityManager from "@/components/organizer/CommunityManager";
import ConfirmModal from "@/components/modals/ConfirmModal";
import {
  getMyOpportunities,
  createOpportunity,
  deleteOpportunity,
  updateOpportunity,
  closeOpportunity,
} from "@/services/opportunities";
import {
  getOrganizerApplications,
  updateApplicationStatus,
} from "@/services/applications";
import {
  getOrganizerProfile,
  getOrganizerDashboard,
  applyOrganizer,
  getMyOrganizerApplication,
  uploadOrganizerCard,
  buildApiUrl,
} from "@/services/organizer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { showToast } from "@/components/common/CustomToaster";
import { parseApiError } from "@/lib/utils/apiError";

// Helper: build a display name from API application fields
function buildApplicantDisplayName(app) {
  const first = app.user?.first_name;
  const last = app.user?.last_name;
  const fromParts = [first, last].filter(Boolean).join(" ").trim();
  return fromParts || app.name_snapshot || app.user?.name || "Anonymous";
}

function buildApplicantSearchText(app) {
  const displayName = buildApplicantDisplayName(app);
  return [
    displayName,
    app.name_snapshot,
    app.user?.name,
    app.user?.first_name,
    app.user?.last_name,
    app.email_snapshot,
    app.user?.email,
    app.opportunity_title,
    app.opportunity?.title,
    app.skills_text,
    app.user?.skills,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

// Helper: returns a category-specific default image path
function getCategoryDefaultImage(category) {
  const cat = (category || "").toLowerCase();
  const map = {
    environment: "/images/opportunities/Categories/environment.png",
    education: "/images/opportunities/Categories/teaching.png",
    health: "/images/opportunities/Categories/img-1.png",
    wildlife: "/images/opportunities/Categories/wildlife.png",
    childcare: "/images/opportunities/Categories/childcare.png",
    agriculture: "/images/opportunities/Categories/agriculture.png",
    event: "/images/opportunities/Categories/event.png",
  };
  return map[cat] || "/images/opportunities/default-opportunity.png";
}

export default function OrgDashboardPage() {
  const router = useRouter();
  const { user, setUser, loading: authLoading } = useAuth();
  
  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orgProfile, setOrgProfile] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);

  const [myApplication, setMyApplication] = useState(null);
  const [appLoading, setAppLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCard, setIsUploadingCard] = useState(false);
  const [forceShowForm, setForceShowForm] = useState(false);

  // Apply Form State
  const [applyForm, setApplyForm] = useState({
    organization_name: "",
    organizer_type: "NGO",
    phone: "",
    description: "",
  });
  const [documentFile, setDocumentFile] = useState(null);

  // Pending card upload state
  const [cardFile, setCardFile] = useState(null);

  // Tabs (React-controlled)
  const [activeTab, setActiveTab] = useState("overview"); // overview | opportunities | applications | analytics | community | settings

  // Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);

  // Delete opportunity confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingOpportunityId, setDeletingOpportunityId] = useState(null);

  // Opportunities state + filters
  const [opSearch, setOpSearch] = useState("");
  const [opStatusFilter, setOpStatusFilter] = useState("all"); // all | active | closed | draft

  // Applications state + filters
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("");

  const fetchApplication = useCallback(async () => {
    setAppLoading(true);
    try {
      const appRes = await getMyOrganizerApplication();
      setMyApplication(appRes.data || null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setMyApplication(null);
      } else {
        console.error("Error fetching organizer application:", err);
      }
    } finally {
      setAppLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) return;
    if (user.role !== "organizer") {
      await fetchApplication();
      return;
    }

    setLoading(true);
    try {
      const [oppsRes, appsRes, profileRes, dashRes] = await Promise.all([
        getMyOpportunities(),
        getOrganizerApplications(),
        getOrganizerProfile(),
        getOrganizerDashboard(),
      ]);
      
      const profileData = profileRes?.data || profileRes;
      const dashData = dashRes?.data || dashRes;

      // Map opportunities to UI expectation
      const mappedOpps = (oppsRes.data || []).map((op) => ({
        id: op.id,
        titleKh: op.title,
        titleEn: op.title, // Fallback
        dateKh: op.date_range || "—",
        locationKh: op.location_label || op.location || "—",
        current: op.accepted_applications_count || 0,
        capacity: op.capacity || 0,
        registrations: op.applications_count || 0,
        status: op.status,
        category: op.category_label || op.category,
        image: op.details?.images_json?.[0] ||
          (Array.isArray(op.images) && op.images.length > 0
            ? op.images[0]
            : typeof op.images === "string" && op.images.trim()
              ? op.images.split(",")[0]
              : getCategoryDefaultImage(op.category_label || op.category)),
        raw: op,
      }));

      // Map applications to UI expectation
      const mappedApps = (appsRes.data || []).map((app) => {
        const displayName = buildApplicantDisplayName(app);
        const skills = app.skills_text || app.user?.skills;
        const userAddress = [
          app.user?.address_street,
          app.user?.address_district,
          app.user?.address_city,
          app.user?.address_province,
        ]
          .filter(Boolean)
          .join(", ");

        return {
          id: app.id,
          avatar:
            app.user?.avatar_url ||
            app.user?.avatar ||
            "/images/ORG/computer-icons-user-profile-circle-abstract.jpg",
          nameKh: displayName,
          nameEn: app.name_snapshot || app.user?.name || displayName,
          searchText: buildApplicantSearchText(app),
          jobKh:
            app.opportunity_title ||
            app.opportunity?.title ||
            `ឱកាស #${app.opportunity_id}`,
          meta: `ជំនាញ៖ ${skills || "—"}`,
          dateKh: new Date(app.created_at).toLocaleDateString("km-KH"),
          status: app.status,
          // Full fields for modal
          email: app.email_snapshot || app.user?.email,
          phone_number: app.phone_snapshot || app.user?.phone,
          message: app.message,
          cv_url: app.cv_url,
          skills,
          availability: app.availability_text || app.user?.availability,
          sex: app.sex,
          bio: app.user?.about_me,
          address: userAddress || app.user?.location,
          education: app.user?.education,
          experience: app.user?.experience,
          interests: app.user?.interests,
        };
      });

      setOpportunities(mappedOpps);
      setApplications(mappedApps);
      setOrgProfile(profileData);
      setDashboardStats(dashData || {});
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("បរាជ័យក្នុងការទាញយកទិន្នន័យ");
    } finally {
      setLoading(false);
    }
  }, [user, fetchApplication]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  // Sync organizer logo to navbar avatar whenever orgProfile loads
  useEffect(() => {
    if (orgProfile?.logo_url && user) {
      const absoluteLogoUrl = buildApiUrl(orgProfile.logo_url);
      if (absoluteLogoUrl && absoluteLogoUrl !== user.avatar_url) {
        setUser((prev) => prev ? ({ ...prev, avatar_url: absoluteLogoUrl, profileImage: absoluteLogoUrl }) : prev);
      }
    }
  }, [orgProfile?.logo_url]);

  const handleSubmitApply = async (e) => {
    e.preventDefault();
    if (!applyForm.organization_name.trim()) {
      toast.error("សូមបញ្ចូលឈ្មោះអង្គការ");
      return;
    }
    if (!applyForm.phone.trim()) {
      toast.error("សូមបញ្ចូលលេខទូរស័ព្ទ");
      return;
    }
    if (!documentFile && !forceShowForm) {
      toast.error("សូមជ្រើសរើសឯកសារផ្ទៀងផ្ទាត់");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("organization_name", applyForm.organization_name);
      data.append("organizer_type", applyForm.organizer_type);
      data.append("phone", applyForm.phone);
      data.append("description", applyForm.description || "");

      if (documentFile) {
        data.append("document", documentFile);
      } else if (myApplication?.document_url) {
        data.append("document", myApplication.document_url);
      }

      await applyOrganizer(data);
      toast.success("បានដាក់ពាក្យស្នើសុំដោយជោគជ័យ!");
      setForceShowForm(false);
      setDocumentFile(null);
      await fetchApplication();
    } catch (err) {
      console.error("Apply error:", err);
      const errMsg = err.response?.data?.message || "បរាជ័យក្នុងការដាក់ពាក្យ";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardUpload = async (e) => {
    e.preventDefault();
    if (!cardFile) {
      toast.error("សូមជ្រើសរើសឯកសារកាតសិន");
      return;
    }
    setIsUploadingCard(true);
    try {
      const res = await uploadOrganizerCard(myApplication.id, cardFile);
      if (res.message && res.message.includes("already uploaded")) {
        toast.success("កាតនេះត្រូវបានផ្ទុកឡើងរួចហើយ (គ្មានការផ្លាស់ប្តូរ)", {
          icon: "ℹ️",
        });
      } else {
        toast.success("បានផ្ទុកឡើងកាតដោយជោគជ័យ!");
      }
      setCardFile(null);
      await fetchApplication();
    } catch (err) {
      console.error("Card upload error:", err);
      const errMsg = err.response?.data?.message || "បរាជ័យក្នុងការផ្ទុកឡើងកាត";
      toast.error(errMsg);
    } finally {
      setIsUploadingCard(false);
    }
  };

  const handleReapply = () => {
    if (myApplication) {
      setApplyForm({
        organization_name: myApplication.organization_name || "",
        organizer_type: myApplication.organizer_type || "NGO",
        phone: myApplication.phone || "",
        description: myApplication.description || "",
      });
    }
    setForceShowForm(true);
  };

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
      
      const nameKhMatch = (app.nameKh || "").toLowerCase().includes(term);
      const nameEnMatch = (app.nameEn || "").toLowerCase().includes(term);
      const emailMatch = (app.email || "").toLowerCase().includes(term);
      const phoneMatch = (app.phone_number || "").toLowerCase().includes(term);
      const jobMatch = (app.jobKh || "").toLowerCase().includes(term);
      const skillMatch = (app.skills || "").toLowerCase().includes(term);
      const textMatch = (app.searchText || "").includes(term);
      
      const matchText =
        !term ||
        nameKhMatch ||
        nameEnMatch ||
        emailMatch ||
        phoneMatch ||
        jobMatch ||
        skillMatch ||
        textMatch;

      return matchStatus && matchText;
    });
  }, [applications, appSearch, appStatusFilter]);

  const appStats = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      approved: applications.filter((a) => a.status === "approved").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    }),
    [applications],
  );

  // Stats for OverviewPane
  const stats = useMemo(() => {
    // Use fetched stats if available, otherwise fallback (or mix)
    if (dashboardStats) {
      return {
        activeOpps: dashboardStats.activeOpps ?? dashboardStats.opportunities_count ?? 0,
        totalVolunteers: dashboardStats.totalVolunteers ?? dashboardStats.applications_total ?? 0,
        rating: dashboardStats.rating ?? 0,
        rating_count: dashboardStats.rating_count ?? 0,
        eventsThisMonth: dashboardStats.eventsThisMonth ?? dashboardStats.applications_pending ?? 0,
      };
    }

    const activeOpps = opportunities.filter(
      (o) => o.status === "active",
    ).length;
    const totalVolunteers = applications.length;

    return {
      activeOpps: activeOpps,
      totalVolunteers: totalVolunteers,
      rating: 0,
      rating_count: 0,
      eventsThisMonth: 0,
    };
  }, [opportunities, applications, dashboardStats]);

  const recentApps = useMemo(() => applications.slice(0, 5), [applications]);

  const handleCreateOpportunity = async (payload) => {
    try {
      const formData = new FormData();
      formData.append("title", payload.titleKh);
      formData.append("description", payload.description || "");
      formData.append("category_id", payload.category_id || "");
      formData.append(
        "visibility",
        payload.visibility === "private" ? "private" : "public",
      );
      formData.append("status", "active");
      formData.append("capacity", payload.capacity || 10);

      if (payload.visibility === "private" && payload.accessCode) {
        formData.append("access_key", payload.accessCode);
        formData.append("access_key_confirmation", payload.accessCode);
      }

      // Logistic (Nested)
      formData.append("logistic[location_label]", payload.locationKh || "");
      formData.append("logistic[start_date]", payload.dateISO || "");
      formData.append("logistic[time_range]", payload.timeRange || "");
      formData.append("logistic[transport]", payload.transport || "None");
      formData.append("logistic[housing]", payload.housing || "None");
      formData.append("logistic[meals]", payload.meals || "None");

      // Details (Nested)
      formData.append(
        "details[skills_json]",
        JSON.stringify(payload.skills || []),
      );
      formData.append(
        "details[tasks_json]",
        JSON.stringify(payload.tasks || []),
      );
      formData.append(
        "details[impact_description]",
        payload.impactDescription || "",
      );
      formData.append("details[help_type]", "Volunteer");

      if (payload.imageFiles && payload.imageFiles.length > 0) {
        payload.imageFiles.forEach((file) => {
          formData.append("images[]", file);
        });
      }

      await createOpportunity(formData);
      setCreateOpen(false);
      fetchData(); // Refresh
      showToast.success("បានបង្កើតឱកាសដោយជោគជ័យ!", "បង្កើតឱកាសជោគជ័យ");
    } catch (error) {
      console.error("Create opportunity error:", error);
      const msg = parseApiError(error) || "បរាជ័យក្នុងការបង្កើតឱកាស";
      showToast.error(msg, "បង្កើតឱកាសបរាជ័យ");
    }
  };

  const handleUpdateOpportunity = async (payload) => {
    try {
      // payload: { id, titleKh, titleEn, description, locationKh, dateISO, category, capacity, status, imageFiles, existingImages, replace_images, ... }

      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("title", payload.titleKh);
      formData.append("description", payload.description || "");
      formData.append("category_id", payload.category_id || payload.category || "");
      formData.append(
        "visibility",
        payload.visibility === "private" ? "private" : "public",
      );
      if (payload.visibility === "private" && payload.accessCode) {
        formData.append("access_key", payload.accessCode);
        formData.append("access_key_confirmation", payload.accessCode);
      }
      formData.append("status", payload.status || "active");
      formData.append("capacity", payload.capacity || 10);

      // Logistic
      formData.append("logistic[location_label]", payload.locationKh || "");
      formData.append("logistic[start_date]", payload.dateISO || "");
      formData.append("logistic[time_range]", payload.timeRange || "");
      formData.append("logistic[transport]", payload.transport || "None");
      formData.append("logistic[housing]", payload.housing || "None");
      formData.append("logistic[meals]", payload.meals || "None");

      // Details
      formData.append(
        "details[impact_description]",
        payload.impactDescription || "",
      );
      formData.append(
        "details[images_json]",
        JSON.stringify(payload.existingImages || []),
      );
      formData.append("replace_images", payload.replace_images ? "1" : "0");

      if (payload.imageFiles && payload.imageFiles.length > 0) {
        payload.imageFiles.forEach((file) => {
          formData.append("images[]", file);
        });
      }

      await updateOpportunity(payload.id, formData);
      setEditOpen(false);
      setSelectedOp(null);
      fetchData();
      showToast.success("បានកែសម្រួលដោយជោគជ័យ!", "កែសម្រួលជោគជ័យ");
    } catch (error) {
      console.error("Update opportunity error:", error);
      const msg = parseApiError(error) || "បរាជ័យក្នុងការកែសម្រួល";
      showToast.error(msg, "កែសម្រួលបរាជ័យ");
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

  const handleDeleteOpportunity = (id) => {
    setDeletingOpportunityId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteOpportunity = async () => {
    try {
      await deleteOpportunity(deletingOpportunityId);
      fetchData();
      toast.success("បានលុបឱកាសដោយជោគជ័យ!");
    } catch (error) {
      console.error("Delete opportunity error:", error);
      toast.error("បរាជ័យក្នុងការលុបឱកាស");
    }
  };

  const handleCloseOpportunity = async (id) => {
    try {
      await closeOpportunity(id);
      fetchData();
      showToast.success("បានបិទឱកាសដោយជោគជ័យ!", "បិទឱកាសជោគជ័យ");
    } catch (error) {
      console.error("Close opportunity error:", error);
      throw error;
    }
  };

  const handleAppStatusUpdate = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពស្ថានភាព");
    }
  };

  const org = {
    logo:
      buildApiUrl(orgProfile?.logo_url) ||
      buildApiUrl(orgProfile?.card_image_url) ||
      user?.profileImage ||
      "/images/ORG/company-icon.png",
    nameKh: orgProfile?.organization_name || user?.name || "អ្នករៀបចំ",
    nameEn:
      user?.role === "organizer" ? "Verified Organizer" : "Pending Approval",
    isVerified: !!orgProfile?.verified_at,
    rating: dashboardStats?.rating ?? 0,
    ratingCount: dashboardStats?.rating_count ?? 0,
  };

  if (authLoading || (user && user.role !== "organizer" && appLoading)) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">កំពុងទាញយកព័ត៌មាន...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">សូមចូលគណនីរបស់អ្នកដើម្បីបន្ត។</div>
      </div>
    );
  }

  if (user.role !== "organizer") {
    const showForm = !myApplication || forceShowForm;

    return (
      <main
        className="flex-grow-1 org-dashboard py-5"
        style={{ background: "#f8f9fa" }}
      >
        <style>{`
          .premium-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(220, 224, 230, 0.6);
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.04);
            transition: all 0.3s ease;
          }
          .premium-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.06);
          }
          .gradient-header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            padding: 1.5rem;
          }
          .gradient-header-yellow {
            background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
            color: white;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            padding: 1.5rem;
          }
          .gradient-header-red {
            background: linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%);
            color: white;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            padding: 1.5rem;
          }
          .form-control-premium {
            border-radius: 8px;
            border: 1.5px solid #dee2e6;
            padding: 0.75rem 1rem;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .form-control-premium:focus {
            border-color: #2a5298;
            box-shadow: 0 0 0 3.5px rgba(42, 82, 152, 0.15);
            outline: none;
          }
          .pulse-badge {
            animation: pulse-animation 2s infinite;
          }
          @keyframes pulse-animation {
            0% {
              box-shadow: 0 0 0 0 rgba(245, 175, 25, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(245, 175, 25, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(245, 175, 25, 0);
            }
          }
          .info-label {
            font-weight: 600;
            color: #495057;
            font-size: 0.9rem;
          }
          .info-val {
            color: #212529;
            font-size: 1rem;
          }
        `}</style>

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {showForm ? (
                <div className="card premium-card border-0">
                  <div className="gradient-header text-center">
                    <h3 className="mb-1 fw-bold">
                      ស្នើសុំធ្វើជាអ្នករៀបចំកម្មវិធី
                    </h3>
                    <p className="mb-0 opacity-75">
                      Apply to Become a Verified Organizer
                    </p>
                  </div>
                  <div className="card-body p-4 p-md-5">
                    <form onSubmit={handleSubmitApply}>
                      <div className="mb-4">
                        <label className="form-label fw-bold">
                          ឈ្មោះអង្គការ / ក្រុម / ស្ថាប័ន{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-premium"
                          placeholder="ឧ. សមាគមយុវជនស្ម័គ្រចិត្ត"
                          value={applyForm.organization_name}
                          onChange={(e) =>
                            setApplyForm({
                              ...applyForm,
                              organization_name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <label className="form-label fw-bold">
                            ប្រភេទអ្នករៀបចំ{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select form-control-premium"
                            value={applyForm.organizer_type}
                            onChange={(e) =>
                              setApplyForm({
                                ...applyForm,
                                organizer_type: e.target.value,
                              })
                            }
                          >
                            <option value="NGO">
                              អង្គការក្រៅរដ្ឋាភិបាល (NGO)
                            </option>
                            <option value="Community group">
                              ក្រុមសហគមន៍ (Community group)
                            </option>
                            <option value="School/University">
                              សាលារៀន/សាកលវិទ្យាល័យ (School/University)
                            </option>
                            <option value="Government">
                              ស្ថាប័នរដ្ឋ (Government)
                            </option>
                            <option value="Corporate">
                              ក្រុមហ៊ុន/សាជីវកម្ម (Corporate)
                            </option>
                            <option value="Other">ផ្សេងៗ (Other)</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">
                            លេខទូរស័ព្ទទំនាក់ទំនង{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-premium"
                            placeholder="ឧ. 099111222"
                            value={applyForm.phone}
                            onChange={(e) =>
                              setApplyForm({
                                ...applyForm,
                                phone: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-bold">
                          ការពិពណ៌នាសង្ខេបពីបេសកកម្ម
                        </label>
                        <textarea
                          className="form-control form-control-premium"
                          rows="4"
                          placeholder="រៀបរាប់សង្ខេបអំពីគោលបំណង និងសកម្មភាពចម្បងៗ..."
                          value={applyForm.description}
                          onChange={(e) =>
                            setApplyForm({
                              ...applyForm,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-bold">
                          ឯកសារផ្ទៀងផ្ទាត់ (លិខិតអនុញ្ញាត ច្បាប់បញ្ជាក់
                          ឬអត្តសញ្ញាណប័ណ្ណ){" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          className="form-control form-control-premium"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => setDocumentFile(e.target.files[0])}
                          required={!myApplication?.document_url}
                        />
                        {myApplication?.document_url && (
                          <div className="form-text text-muted mt-1">
                            <i className="bi bi-file-earmark-check me-1"></i>
                            មានឯកសារចាស់រួចហើយ៖{" "}
                            <a
                              href={myApplication.document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              មើលឯកសារ
                            </a>{" "}
                            (ជ្រើសរើសឯកសារថ្មីដើម្បីជំនួស)
                          </div>
                        )}
                      </div>

                      <div className="d-flex gap-2 justify-content-end mt-5">
                        {forceShowForm && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary px-4 py-2"
                            onClick={() => setForceShowForm(false)}
                            disabled={isSubmitting}
                          >
                            បោះបង់
                          </button>
                        )}
                        <button
                          type="submit"
                          className="btn btn-primary px-5 py-2 fw-bold"
                          disabled={isSubmitting}
                          style={{
                            background: "#2a5298",
                            borderColor: "#2a5298",
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              កំពុងបញ្ជូន...
                            </>
                          ) : (
                            "ដាក់ពាក្យស្នើសុំ"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : myApplication.status === "pending" ? (
                <div className="card premium-card border-0">
                  <div className="gradient-header-yellow text-center pulse-badge">
                    <h3 className="mb-1 fw-bold">
                      <i className="bi bi-hourglass-split me-2"></i>
                      កំពុងរង់ចាំការពិនិត្យ
                    </h3>
                    <p className="mb-0 opacity-75">Pending Admin Review</p>
                  </div>
                  <div className="card-body p-4 p-md-5">
                    <div className="alert alert-info border-0 bg-info-subtle mb-4">
                      <i className="bi bi-info-circle-fill me-2 text-info"></i>
                      ពាក្យស្នើសុំរបស់អ្នកកំពុងស្ថិតក្រោមការត្រួតពិនិត្យដោយអភិបាលប្រព័ន្ធ។
                      យើងខ្ញុំនឹងធ្វើការសម្រេចចិត្តក្នុងពេលឆាប់ៗនេះ។
                    </div>

                    <h5 className="fw-bold mb-4 pb-2 border-bottom">
                      ព័ត៌មានដែលបានដាក់ជូន (Submitted Details)
                    </h5>
                    <div className="row mb-4">
                      <div className="col-md-6 mb-3">
                        <div className="info-label">ឈ្មោះអង្គការ</div>
                        <div className="info-val fw-bold">
                          {myApplication.organization_name}
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="info-label">ប្រភេទអ្នករៀបចំ</div>
                        <div className="info-val">
                          {myApplication.organizer_type || "—"}
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="info-label">លេខទូរស័ព្ទ</div>
                        <div className="info-val">
                          {myApplication.phone || "—"}
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="info-label">ឯកសារបញ្ជាក់ផ្លូវការ</div>
                        <div className="info-val">
                          {myApplication.document_url ? (
                            <a
                              href={myApplication.document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary mt-1"
                            >
                              <i className="bi bi-file-earmark-pdf me-1"></i>{" "}
                              មើលឯកសារ
                            </a>
                          ) : (
                            <span className="text-muted">គ្មានឯកសារ</span>
                          )}
                        </div>
                      </div>
                      <div className="col-12 mb-3">
                        <div className="info-label">ការពិពណ៌នា</div>
                        <div
                          className="info-val text-muted"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {myApplication.description || "គ្មានការពិពណ៌នា"}
                        </div>
                      </div>
                    </div>

                    <div
                      className="card border-dashed p-4 text-center mt-5"
                      style={{
                        border: "2px dashed #dee2e6",
                        borderRadius: "12px",
                        background: "#fafafa",
                      }}
                    >
                      <h6 className="fw-bold mb-2">
                        <i className="bi bi-card-image me-2 text-primary"></i>
                        ផ្ទុកឡើង ឬកែប្រែ កាតបញ្ជាក់អត្តសញ្ញាណ (Verification ID
                        Card)
                      </h6>
                      <p className="text-muted small mb-4">
                        ជ្រើសរើសរូបភាព ឬឯកសារកាតបញ្ជាក់សមាជិកភាព ឬ ID Card
                        ដើម្បីភ្ជាប់ជាមួយពាក្យស្នើសុំ
                      </p>
                      <form
                        onSubmit={handleCardUpload}
                        className="d-flex flex-column align-items-center"
                      >
                        <input
                          type="file"
                          className="form-control form-control-premium mb-3 w-75"
                          accept="image/*,.pdf"
                          onChange={(e) => setCardFile(e.target.files[0])}
                          required
                        />
                        <button
                          type="submit"
                          className="btn btn-primary px-4 fw-bold"
                          disabled={isUploadingCard}
                          style={{
                            background: "#2a5298",
                            borderColor: "#2a5298",
                          }}
                        >
                          {isUploadingCard ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              កំពុងផ្ទុកឡើង...
                            </>
                          ) : (
                            "ផ្ទុកឡើងកាត"
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card premium-card border-0">
                  <div className="gradient-header-red text-center">
                    <h3 className="mb-1 fw-bold">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      ការស្នើសុំត្រូវបានបដិសេធ
                    </h3>
                    <p className="mb-0 opacity-75">Application Rejected</p>
                  </div>
                  <div className="card-body p-4 p-md-5 text-center">
                    <div className="alert alert-danger border-0 bg-danger-subtle mb-4 text-start">
                      <i className="bi bi-x-circle-fill me-2 text-danger"></i>
                      សុំទោស!
                      ពាក្យស្នើសុំរបស់អ្នកត្រូវបានបដិសេធដោយអភិបាលប្រព័ន្ធ។
                      សូមពិនិត្យឡើងវិញ ឬទាក់ទងមកយើងខ្ញុំសម្រាប់ព័ត៌មានបន្ថែម។
                    </div>

                    {myApplication.reviewer_note && (
                      <div
                        className="mb-4 text-start p-3 bg-light rounded"
                        style={{ borderLeft: "4px solid #ef473a" }}
                      >
                        <div className="fw-bold mb-1">
                          មូលហេតុបដិសេធពី Admin៖
                        </div>
                        <div className="text-muted">
                          {myApplication.reviewer_note}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleReapply}
                      className="btn btn-primary px-5 py-3 fw-bold mt-3"
                      style={{ background: "#2a5298", borderColor: "#2a5298" }}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      កែប្រែ និងស្នើសុំឡើងវិញ (Re-apply)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow-1 org-dashboard">
      <div className="container py-4">
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
            { id: "reported-comments", label: "មតិយោបល់ដែលបានរាយការណ៍" },
            { id: "settings", label: "ការកំណត់" },
          ]}
        />

        {/* Panes */}
        <div className="tab-content mt-4 w-100">
          {activeTab === "overview" && (
            <OverviewPane stats={stats} recentApps={recentApps} />
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
              stats={appStats}
              totalCount={applications.length}
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

          {activeTab === "reported-comments" && <ReportedCommentsPane />}

          {activeTab === "settings" && (
            <SettingsPane
              profile={orgProfile}
              onUpdate={async () => { await fetchData(); }}
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
        onCloseOpportunity={handleCloseOpportunity}
      />

      {/* Edit Opportunity Modal */}
      <EditOpportunityModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        opportunity={selectedOp}
        onSubmit={handleUpdateOpportunity}
      />

      <ConfirmModal
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setDeletingOpportunityId(null);
        }}
        onConfirm={confirmDeleteOpportunity}
        title="លុបឱកាសស្ម័គ្រចិត្ត"
        message="តើអ្នកពិតជាចង់លុបឱកាសស្ម័គ្រចិត្តនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានទេ។"
        confirmText="លុប"
        cancelText="បោះបង់"
        type="danger"
      />
    </main>
  );
}
