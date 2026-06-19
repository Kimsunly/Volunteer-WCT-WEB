"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { RoleGuard } from "../components";
import {
  listAllOpportunities as listOpportunities,
  updateOpportunity,
  deleteOpportunity as apiDeleteOpportunity,
  createOpportunityAsAdmin,
} from "@/services/admin";
import { useAuth } from "@/context/AuthContext";
import CreateOpportunityModal from "@/app/organizer/profile/components/CreateOpportunityModal";
import EditOpportunityModal from "@/app/organizer/profile/components/EditOpportunityModal";
import OpportunityDetailModal from "@/app/organizer/profile/components/OpportunityDetailModal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { closeOpportunity } from "@/services/opportunities";
import { getApplicationsForOpportunity, updateApplicationStatus } from "@/services/applications";
import toast from "react-hot-toast";
import { parseApiError } from "@/lib/utils/apiError";

export default function AdminOpportunitiesPage() {
  const { user, loading: authLoading } = useAuth();
  const [opps, setOpps] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;
  const [mounted, setMounted] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);

  const [regsOpen, setRegsOpen] = useState(false);
  const [regsLoading, setRegsLoading] = useState(false);
  const [registrationsList, setRegistrationsList] = useState([]);
  const [activeRegsOp, setActiveRegsOp] = useState(null);
  const [regsSearchQuery, setRegsSearchQuery] = useState("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingOpportunityId, setDeletingOpportunityId] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchOpps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listOpportunities({
        search,
        status: status === "all" ? null : status,
        category: category === "all" ? null : category,
        limit,
        offset,
      });
      const items = res?.data || res || [];
      setOpps(items);
      setTotal(res?.total ?? items.length ?? 0);
    } catch (e) {
      console.error("Fetch opportunities error:", e);
      setError("Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  }, [search, status, category, limit, offset]);

  useEffect(() => {
    if (!authLoading && user?.role?.toLowerCase() === "admin") {
      fetchOpps();
    }
  }, [authLoading, user, fetchOpps]);

  const viewRegistrations = async (item) => {
    setActiveRegsOp(item);
    setRegsOpen(true);
    setRegsLoading(true);
    setRegistrationsList([]);
    setRegsSearchQuery("");
    try {
      const res = await getApplicationsForOpportunity(item.id);
      setRegistrationsList(res.data || res || []);
    } catch (e) {
      console.error("Failed to load registrations:", e);
      toast.error("Failed to load registrations list");
    } finally {
      setRegsLoading(false);
    }
  };

  const handleDeleteOpp = (id) => {
    setDeletingOpportunityId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteOpportunity = async () => {
    if (!deletingOpportunityId) return;
    try {
      await apiDeleteOpportunity(deletingOpportunityId);
      toast.success("លុបឱកាសដោយជោគជ័យ / Opportunity deleted successfully");
      await fetchOpps();
    } catch (e) {
      console.error("Delete error:", e);
      const msg = parseApiError(e) || "Failed to delete opportunity";
      toast.error(msg);
    }
  };

  const handleApproveApp = async (appId) => {
    try {
      await updateApplicationStatus(appId, "approved");
      toast.success("បានអនុម័តពាក្យស្នើសុំដោយជោគជ័យ / Application approved successfully");
      const res = await getApplicationsForOpportunity(activeRegsOp.id);
      setRegistrationsList(res.data || res || []);
      await fetchOpps();
    } catch (e) {
      console.error(e);
      toast.error("Failed to approve application");
    }
  };

  const handleRejectApp = async (appId) => {
    try {
      await updateApplicationStatus(appId, "rejected");
      toast.success("បានបដិសេធពាក្យស្នើសុំ / Application rejected successfully");
      const res = await getApplicationsForOpportunity(activeRegsOp.id);
      setRegistrationsList(res.data || res || []);
      await fetchOpps();
    } catch (e) {
      console.error(e);
      toast.error("Failed to reject application");
    }
  };

  const handleResetAppToPending = async (appId) => {
    try {
      await updateApplicationStatus(appId, "pending");
      toast.success("បានត្រឡប់ទៅរង់ចាំពិនិត្យ / Application status reset to pending");
      const res = await getApplicationsForOpportunity(activeRegsOp.id);
      setRegistrationsList(res.data || res || []);
      await fetchOpps();
    } catch (e) {
      console.error(e);
      toast.error("Failed to reset application status");
    }
  };

  const openCreateOpp = () => {
    setCreateOpen(true);
  };

  const prepareSelectedOp = (item) => {
    return {
      id: item.id,
      titleKh: item.title,
      titleEn: item.title,
      locationKh: item.logistic?.location_label || item.location || "",
      capacity: item.capacity || 10,
      status: item.status || "active",
      registrations: item.applicants_count ?? item.applications_count ?? 0,
      raw: {
        ...item,
        category_id: item.category_id || item.category?.id || item.category || "",
        date_range: item.logistic?.start_date || item.startDate || "",
        is_private: item.visibility === "private",
        meals: item.logistic?.meals || "",
        time_range: item.logistic?.time_range || "",
        skills: item.details?.skills_json || [],
        tasks: item.details?.tasks_json || [],
        impact_description: item.details?.impact_description || "",
        housing: item.logistic?.housing || "None",
        transport: item.logistic?.transport || "None",
      }
    };
  };

  const openEditOpp = (item) => {
    setSelectedOp(prepareSelectedOp(item));
    setEditOpen(true);
  };

  const openDetailOpp = (item) => {
    setSelectedOp(prepareSelectedOp(item));
    setDetailOpen(true);
  };

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
      formData.append("status", payload.status || "active");
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

      await createOpportunityAsAdmin(formData);
      setCreateOpen(false);
      await fetchOpps();
      toast.success("បានបង្កើតឱកាសដោយជោគជ័យ / Opportunity created successfully");
    } catch (error) {
      console.error("Create opportunity error:", error);
      const msg = parseApiError(error) || "Failed to create opportunity";
      toast.error(msg);
    }
  };

  const handleUpdateOpportunity = async (payload) => {
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("title", payload.titleKh);
      formData.append("description", payload.description || "");
      formData.append("category_id", payload.category_id || "");
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
      await fetchOpps();
      toast.success("បានកែសម្រួលដោយជោគជ័យ / Opportunity updated successfully");
    } catch (error) {
      console.error("Update opportunity error:", error);
      const msg = parseApiError(error) || "Failed to update opportunity";
      toast.error(msg);
    }
  };

  const getCategoryClass = (cat) => {
    if (!cat) return "general";
    const name = (typeof cat === "string" ? cat : cat.name || "").toLowerCase();
    if (name.includes("edu")) return "education";
    if (name.includes("heal")) return "health";
    if (name.includes("env")) return "environment";
    if (name.includes("comm")) return "community";
    return "general";
  };

  const statusBadge = (s) => {
    const map = { active: "active", draft: "pending", closed: "rejected" };
    return (
      <span className={`status-badge-custom ${map[s] || "pending"}`}>
        {s}
      </span>
    );
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString();
  };

  // Volunteer registrations filtering and statistics calculations
  const filteredRegs = activeRegsOp ? registrationsList.filter((app) => {
    const displayName = [app.user?.first_name, app.user?.last_name].filter(Boolean).join(" ").trim() || app.name_snapshot || app.user?.name || "Anonymous";
    const searchLower = regsSearchQuery.toLowerCase();
    return (
      displayName.toLowerCase().includes(searchLower) ||
      (app.email_snapshot || app.user?.email || "").toLowerCase().includes(searchLower) ||
      (app.phone_snapshot || app.user?.phone || "").toLowerCase().includes(searchLower) ||
      (app.skills_text || "").toLowerCase().includes(searchLower) ||
      (app.message || "").toLowerCase().includes(searchLower)
    );
  }) : [];

  const totalCount = activeRegsOp ? registrationsList.length : 0;
  const pendingCount = activeRegsOp ? registrationsList.filter(app => app.status === "pending").length : 0;
  const approvedCount = activeRegsOp ? registrationsList.filter(app => app.status === "approved" || app.status === "accepted").length : 0;
  const rejectedCount = activeRegsOp ? registrationsList.filter(app => app.status === "rejected").length : 0;

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <RoleGuard />

      {/* Page Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Opportunities Management</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "4px", marginBottom: 0 }}>
            Admin has override power to CRUD all opportunities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="search-container">
            <i className="bi bi-search search-icon"></i>
            <input
              type="search"
              className="search-input"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="environment">Environment</option>
            <option value="community">Community</option>
          </select>
          <select
            className="filter-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
          <button className="btn-primary" onClick={openCreateOpp}>
            <i className="bi bi-plus-circle me-2"></i> Create New
          </button>
        </div>
      </div>

      <div className={user?.role !== "admin" ? "opacity-50 pointer-events-none" : ""}>
        {error && (
          <div className="card" style={{ color: "var(--color-negative)" }}>
            {error}
          </div>
        )}

        {/* Data Table */}
        <div className="card" style={{ padding: "0" }}>
          <div className="table-wrapper">
            <table className="data-table" style={{ width: "100%", tableLayout: "fixed" }}>
              <thead>
                <tr>
                  <th style={{ width: "22%", minWidth: "180px" }}>Title</th>
                  <th style={{ width: "16%", minWidth: "120px" }}>Organization</th>
                  <th style={{ width: "15%", minWidth: "140px" }}>Category</th>
                  <th style={{ width: "12%", minWidth: "100px" }}>Created</th>
                  <th style={{ width: "10%", minWidth: "100px" }}>Visibility</th>
                  <th style={{ width: "10%", minWidth: "90px" }}>Status</th>
                  <th style={{ width: "15%", minWidth: "220px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="text-center py-4">
                        <div className="flex items-center justify-center gap-2" style={{ color: "var(--color-text-muted)" }}>
                          <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }}></i>
                          Loading...
                        </div>
                      </td>
                    </tr>
                  ))
                ) : !opps.length ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>
                      No opportunities found
                    </td>
                  </tr>
                ) : (
                  opps.map((o) => (
                    <tr key={o.id}>
                      <td style={{ verticalAlign: "middle" }}>
                        <strong
                          style={{
                            color: "var(--color-text-primary)",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => openDetailOpp(o)}
                          title="View Detail"
                        >
                          {o.title}
                        </strong>
                      </td>
                      <td style={{ verticalAlign: "middle", color: "var(--color-text-secondary)" }}>
                        {o.organization_name || o.organizer_name || "Admin"}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <span className={`category-badge ${getCategoryClass(o.category)}`}>
                          {o.category?.name || o.category || "General"}
                        </span>
                      </td>
                      <td style={{ verticalAlign: "middle", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
                        {formatDate(o.created_at)}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <span className={`visibility-badge ${o.visibility === "public" ? "public" : "private"}`}>
                          <i className={`bi ${o.visibility === "public" ? "bi-globe" : "bi-lock-fill"}`}></i>
                          {o.visibility}
                        </span>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {statusBadge(o.status)}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{
                              width: "36px",
                              height: "36px",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "var(--radius-sm)",
                            }}
                            onClick={() => openDetailOpp(o)}
                            title="View Detail"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn-secondary"
                            style={{
                              width: "36px",
                              height: "36px",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "var(--radius-sm)",
                            }}
                            onClick={() => openEditOpp(o)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn-secondary"
                            style={{
                              height: "36px",
                              padding: "0 12px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "var(--radius-sm)",
                              gap: "6px",
                            }}
                            onClick={() => viewRegistrations(o)}
                            title="Registrations"
                          >
                            <i className="bi bi-people"></i>
                            <span style={{ fontSize: "0.8125rem", fontWeight: "600" }}>{o.applicants_count ?? o.applications_count ?? 0}</span>
                          </button>
                          <button
                            className="btn-danger"
                            style={{
                              width: "36px",
                              height: "36px",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "var(--radius-sm)",
                            }}
                            onClick={() => handleDeleteOpp(o.id)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between" style={{ marginTop: "16px" }}>
          <small style={{ color: "var(--color-text-secondary)" }}>
            Total: <strong style={{ color: "var(--color-text-primary)" }}>{total}</strong>
            {loading && (
              <span className="ms-2">
                <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }}></i>
              </span>
            )}
          </small>
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary"
              style={{ padding: "8px 16px" }}
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </button>
            <span className="status-badge active" style={{ background: "var(--color-bg-input)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>
              {page}
            </span>
            <button
              className="btn-secondary"
              style={{ padding: "8px 16px" }}
              onClick={() => setPage(page + 1)}
              disabled={page * limit >= total || loading}
            >
              Next
            </button>
          </div>
        </div>

        {/* Create and Edit Modals */}
        <CreateOpportunityModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSubmit={handleCreateOpportunity}
        />

        <EditOpportunityModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          opportunity={selectedOp}
          onSubmit={handleUpdateOpportunity}
        />

        <OpportunityDetailModal
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          opportunity={selectedOp}
          onEdit={(op) => {
            setSelectedOp(op);
            setEditOpen(true);
          }}
          onDelete={handleDeleteOpp}
          onCloseOpportunity={async (id) => {
            try {
              await closeOpportunity(id);
              await fetchOpps();
              toast.success("បានបិទឱកាសដោយជោគជ័យ / Opportunity closed successfully");
            } catch (e) {
              console.error(e);
              toast.error("Failed to close opportunity");
            }
          }}
        />

        {regsOpen && activeRegsOp && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(6px)",
                zIndex: 1040,
              }}
              onClick={() => setRegsOpen(false)}
            ></div>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1050,
                padding: "1rem",
                pointerEvents: "none",
              }}
            >
              <div
                className="card shadow-lg overflow-hidden border-0"
                style={{
                  width: "100%",
                  maxWidth: "850px",
                  maxHeight: "90vh",
                  overflowY: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  pointerEvents: "auto",
                  backgroundColor: "var(--color-bg-surface)",
                  borderRadius: "16px",
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div
                  className="modal-header p-4 d-flex align-items-center justify-content-between"
                  style={{
                    background: "var(--color-bg-surface)",
                    borderBottom: "1px solid var(--color-border)",
                    flexShrink: 0,
                  }}
                >
                  <h5 className="modal-title d-flex align-items-center gap-2 mb-0" style={{ color: "var(--color-text-primary)", fontSize: "1.15rem", fontWeight: "600" }}>
                    <i className="bi bi-people-fill fs-4" style={{ color: "var(--color-accent)" }}></i> បញ្ជីអ្នកចុះឈ្មោះស្ម័គ្រចិត្ត / Volunteer Registrations
                  </h5>
                  <button
                    type="button"
                    className="btn-close-custom"
                    onClick={() => setRegsOpen(false)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <div className="modal-body p-4" style={{ overflowY: "auto", flexGrow: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* Search and Title Section */}
                  <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap" style={{ flexShrink: 0 }}>
                    <div className="flex-grow-1">
                      <h6 style={{ fontWeight: 700, margin: 0, color: "var(--color-text-secondary)", fontSize: "0.85rem", textTransform: "uppercase" }}>ឱកាសស្ម័គ្រចិត្ត / Opportunity:</h6>
                      <p style={{ color: "var(--color-text-primary)", margin: "4px 0 0", fontSize: "1.05rem", fontWeight: "600" }}>{activeRegsOp.titleKh || activeRegsOp.title || ""}</p>
                    </div>
                    <div className="search-container" style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
                      <i className="bi bi-search" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-secondary)", pointerEvents: "none" }}></i>
                      <input
                        type="search"
                        placeholder="ស្វែងរកអ្នកស្ម័គ្រចិត្ត... / Search volunteer..."
                        value={regsSearchQuery}
                        onChange={(e) => setRegsSearchQuery(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px 8px 36px",
                          backgroundColor: "var(--color-bg-input)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "10px",
                          color: "var(--color-text-primary)",
                          fontSize: "0.875rem",
                          outline: "none"
                        }}
                      />
                    </div>
                  </div>

                  {/* Summary Stats Cards */}
                  <div className="row g-3" style={{ flexShrink: 0 }}>
                    <div className="col-6 col-md-3">
                      <div className="p-3 rounded-3 text-center" style={{ backgroundColor: "var(--color-bg-input)", border: "1px solid var(--color-border)" }}>
                        <div style={{ fontSize: "10px", color: "var(--color-text-secondary)", fontWeight: "600", textTransform: "uppercase" }}>សរុប / Total</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--color-text-primary)", marginTop: "4px" }}>{totalCount}</div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="p-3 rounded-3 text-center" style={{ backgroundColor: "rgba(255, 193, 7, 0.08)", border: "1px solid rgba(255, 193, 7, 0.2)" }}>
                        <div style={{ fontSize: "10px", color: "#ffc107", fontWeight: "600", textTransform: "uppercase" }}>កំពុងរង់ចាំ / Pending</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "#ffc107", marginTop: "4px" }}>{pendingCount}</div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="p-3 rounded-3 text-center" style={{ backgroundColor: "rgba(25, 135, 84, 0.08)", border: "1px solid rgba(25, 135, 84, 0.2)" }}>
                        <div style={{ fontSize: "10px", color: "#198754", fontWeight: "600", textTransform: "uppercase" }}>បានអនុម័ត / Approved</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "#198754", marginTop: "4px" }}>{approvedCount}</div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="p-3 rounded-3 text-center" style={{ backgroundColor: "rgba(220, 53, 69, 0.08)", border: "1px solid rgba(220, 53, 69, 0.2)" }}>
                        <div style={{ fontSize: "10px", color: "#dc3545", fontWeight: "600", textTransform: "uppercase" }}>បានបដិសេធ / Rejected</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "#dc3545", marginTop: "4px" }}>{rejectedCount}</div>
                      </div>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  {regsLoading ? (
                    <div className="text-center py-5 my-auto">
                      <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : filteredRegs.length === 0 ? (
                    <div className="text-center py-5 my-auto text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2 text-muted" style={{ opacity: 0.4 }} />
                      {registrationsList.length === 0 
                        ? "គ្មានការចុះឈ្មោះឡើយ / No registrations found." 
                        : "គ្មានលទ្ធផលស្វែងរកឡើយ / No match found."}
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {filteredRegs.map((app) => {
                        const displayName = [app.user?.first_name, app.user?.last_name].filter(Boolean).join(" ").trim() || app.name_snapshot || app.user?.name || "Anonymous";
                        const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                        const genderLabel = app.sex === "male" ? "ប្រុស (Male)" : app.sex === "female" ? "ស្រី (Female)" : app.sex || "—";
                        const skills = app.skills_text ? app.skills_text.split(",").map(s => s.trim()).filter(Boolean) : [];

                        return (
                          <div 
                            key={app.id} 
                            className="p-3 rounded-3 border d-flex flex-column gap-3 transition-all"
                            style={{ 
                              backgroundColor: "var(--color-bg-card)", 
                              borderColor: "var(--color-border)",
                              transition: "transform 0.2s ease, box-shadow 0.2s ease"
                            }}
                          >
                            {/* Card Header */}
                            <div className="d-flex align-items-center justify-content-between gap-3">
                              <div className="d-flex align-items-center gap-3">
                                <div 
                                  className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                                  style={{ 
                                    width: "42px", 
                                    height: "42px", 
                                    fontSize: "14px",
                                    background: "linear-gradient(135deg, var(--color-accent) 0%, #198754 100%)",
                                    boxShadow: "0 2px 8px rgba(170, 255, 0, 0.2)"
                                  }}
                                >
                                  {initials}
                                </div>
                                <div>
                                  <h6 className="mb-0 fw-bold" style={{ color: "var(--color-text-primary)" }}>{displayName}</h6>
                                  <span 
                                    className="small text-muted d-inline-flex align-items-center gap-1 mt-1 px-2 py-0.5 rounded-pill" 
                                    style={{ 
                                      backgroundColor: "var(--color-bg-input)", 
                                      border: "1px solid var(--color-border)",
                                      fontSize: "10px"
                                    }}
                                  >
                                    <i className={`bi ${app.sex === "male" ? "bi-gender-male" : app.sex === "female" ? "bi-gender-female" : "bi-person"}`}></i>
                                    {genderLabel}
                                  </span>
                                </div>
                              </div>
                              
                              <div>
                                <span className={`status-badge-custom ${app.status === "approved" || app.status === "accepted" ? "active" : app.status === "rejected" ? "rejected" : "pending"}`}>
                                  {app.status === "approved" || app.status === "accepted" ? "Approved" : app.status === "rejected" ? "Rejected" : "Pending"}
                                </span>
                              </div>
                            </div>

                            <div className="row g-2 align-items-center" style={{ borderTop: "1px solid var(--color-border)", paddingTop: "12px" }}>
                              {/* Contact section */}
                              <div className="col-12 col-md-6 d-flex flex-column gap-2" style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                                <div className="d-flex align-items-center gap-2">
                                  <i className="bi bi-envelope" style={{ fontSize: "12px", width: "16px" }}></i>
                                  <span 
                                    style={{ cursor: "pointer", textDecoration: "underline" }}
                                    title="Click to copy email"
                                    onClick={() => {
                                      const email = app.email_snapshot || app.user?.email || "";
                                      if (email) {
                                        navigator.clipboard.writeText(email);
                                        toast.success("Copied email!");
                                      }
                                    }}
                                  >
                                    {app.email_snapshot || app.user?.email || "—"}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <i className="bi bi-telephone" style={{ fontSize: "12px", width: "16px" }}></i>
                                  <span 
                                    style={{ cursor: "pointer", textDecoration: "underline" }}
                                    title="Click to copy phone"
                                    onClick={() => {
                                      const phone = app.phone_snapshot || app.user?.phone || "";
                                      if (phone) {
                                        navigator.clipboard.writeText(phone);
                                        toast.success("Copied phone!");
                                      }
                                    }}
                                  >
                                    {app.phone_snapshot || app.user?.phone || "—"}
                                  </span>
                                </div>
                              </div>

                              {/* Resume Section */}
                              <div className="col-12 col-md-6 d-flex align-items-center justify-content-md-end justify-content-start">
                                {app.cv_url ? (
                                  <a 
                                    href={app.cv_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2" 
                                    style={{ 
                                      fontSize: "12px", 
                                      borderRadius: "8px",
                                      padding: "6px 12px",
                                      borderColor: "var(--color-accent)",
                                      color: "var(--color-accent)"
                                    }}
                                  >
                                    <i className="bi bi-file-earmark-pdf" style={{ color: "var(--color-negative)", fontSize: "1.1rem" }}></i>
                                    <span>មើលប្រវត្តិរូបសង្ខេប / View CV</span>
                                  </a>
                                ) : (
                                  <span style={{ fontSize: "12px", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                    <i className="bi bi-info-circle me-1"></i>គ្មាន CV ភ្ជាប់មកទេ / No CV attached
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Message / Cover Letter */}
                            {app.message && (
                              <div className="p-3 rounded-2" style={{ backgroundColor: "var(--color-bg-input)", borderLeft: "3.5px solid var(--color-accent)" }}>
                                <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
                                  <i className="bi bi-chat-right-quote me-1"></i>សារ / Message
                                </div>
                                <p style={{ fontSize: "13px", color: "var(--color-text-primary)", margin: 0, fontStyle: "italic", lineHeight: "1.5" }}>
                                  &ldquo;{app.message}&rdquo;
                                </p>
                              </div>
                            )}

                            {/* Skills Tag Pills */}
                            {skills.length > 0 && (
                              <div className="d-flex flex-wrap gap-2 align-items-center">
                                <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--color-text-secondary)" }}>ជំនាញ / Skills:</span>
                                {skills.map((skill, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-0.5 rounded-pill"
                                    style={{ 
                                      fontSize: "11px", 
                                      fontWeight: "500", 
                                      backgroundColor: "var(--color-accent-dim)", 
                                      color: "var(--color-accent)",
                                      border: "1px solid rgba(170, 255, 0, 0.15)"
                                    }}
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Action Buttons inside Card */}
                            <div className="d-flex justify-content-end gap-2" style={{ borderTop: "1px solid var(--color-border)", paddingTop: "12px" }}>
                              {app.status === "pending" ? (
                                <>
                                  <button
                                    onClick={() => handleRejectApp(app.id)}
                                    className="btn btn-sm py-1.5 px-3 rounded-3 d-flex align-items-center gap-1.5"
                                    style={{ fontSize: "12px", border: "1px solid var(--color-negative)", backgroundColor: "transparent", color: "var(--color-negative)", transition: "all 0.2s ease" }}
                                    title="Reject"
                                  >
                                    <i className="bi bi-x-circle"></i> បដិសេធ / Reject
                                  </button>
                                  <button
                                    onClick={() => handleApproveApp(app.id)}
                                    className="btn btn-sm py-1.5 px-3 rounded-3 d-flex align-items-center gap-1.5"
                                    style={{ fontSize: "12px", border: "none", backgroundColor: "var(--color-positive)", color: "#fff", transition: "all 0.2s ease" }}
                                    title="Approve"
                                  >
                                    <i className="bi bi-check-circle-fill"></i> អនុម័ត / Approve
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleResetAppToPending(app.id)}
                                  className="btn-secondary py-1.5 px-3 rounded-3 d-flex align-items-center gap-1.5"
                                  style={{ fontSize: "12px", height: "32px", border: "1px solid var(--color-border)", borderRadius: "6px" }}
                                  title="Reset to Pending"
                                >
                                  <i className="bi bi-arrow-counterclockwise"></i> ត្រឡប់ក្រោយ / Reset to Pending
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="modal-footer p-4 border-0 d-flex justify-content-end" style={{ flexShrink: 0, backgroundColor: "var(--color-bg-surface)" }}>
                  <button
                    type="button"
                    className="btn-premium-cancel"
                    onClick={() => setRegsOpen(false)}
                  >
                    បិទ / Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <ConfirmModal
          open={deleteConfirmOpen}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setDeletingOpportunityId(null);
          }}
          onConfirm={confirmDeleteOpportunity}
          title="លុបឱកាសស្ម័គ្រចិត្ត / Delete Opportunity"
          message="តើអ្នកពិតជាចង់លុបឱកាសស្ម័គ្រចិត្តនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានទេ។ / Are you sure you want to delete this opportunity permanently? This action cannot be undone."
          confirmText="លុប / Delete"
          cancelText="បោះបង់ / Cancel"
          type="danger"
        />
      </div>

      <style jsx>{`
        .search-container {
          position: relative;
          max-width: 250px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-secondary);
          pointer-events: none;
          font-size: 0.875rem;
        }
        .search-input {
          width: 100%;
          background-color: var(--color-bg-input) !important;
          border: 1.5px solid var(--color-border) !important;
          border-radius: var(--radius-btn) !important;
          padding: 8px 16px 8px 36px !important;
          font-size: 0.875rem;
          color: var(--color-text-primary) !important;
          transition: all 0.2s ease;
        }
        .search-input:focus {
          border-color: var(--color-accent) !important;
          outline: none;
        }
        
        .filter-select {
          background-color: var(--color-bg-input) !important;
          border: 1.5px solid var(--color-border) !important;
          border-radius: var(--radius-btn) !important;
          color: var(--color-text-primary) !important;
          padding: 8px 32px 8px 16px !important;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg fill='%239a9a9a' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>") !important;
          background-position: right 10px center !important;
          background-repeat: no-repeat !important;
        }
        .filter-select:focus {
          border-color: var(--color-accent) !important;
          outline: none;
        }
        
        .category-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 100px;
          text-transform: uppercase;
          background-color: var(--color-bg-input);
          border: 1px solid var(--color-border);
          color: var(--color-text-primary);
          white-space: nowrap;
          display: inline-block;
        }
        .category-badge.education {
          background-color: rgba(13, 110, 253, 0.12) !important;
          color: #0d6efd !important;
          border: 1px solid rgba(13, 110, 253, 0.2) !important;
        }
        .category-badge.health {
          background-color: rgba(220, 53, 69, 0.12) !important;
          color: #dc3545 !important;
          border: 1px solid rgba(220, 53, 69, 0.2) !important;
        }
        .category-badge.environment {
          background-color: rgba(25, 135, 84, 0.12) !important;
          color: #198754 !important;
          border: 1px solid rgba(25, 135, 84, 0.2) !important;
        }
        .category-badge.community {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: 1px solid rgba(170, 255, 0, 0.2) !important;
        }
        
        .status-badge-custom {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 100px;
          text-transform: uppercase;
          white-space: nowrap;
          display: inline-block;
        }
        .status-badge-custom.active {
          background-color: rgba(25, 135, 84, 0.12) !important;
          color: #198754 !important;
          border: 1px solid rgba(25, 135, 84, 0.2) !important;
        }
        .status-badge-custom.pending {
          background-color: rgba(255, 193, 7, 0.12) !important;
          color: #ffc107 !important;
          border: 1px solid rgba(255, 193, 7, 0.2) !important;
        }
        .status-badge-custom.rejected {
          background-color: rgba(220, 53, 69, 0.12) !important;
          color: #dc3545 !important;
          border: 1px solid rgba(220, 53, 69, 0.2) !important;
        }
        
        .visibility-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 100px;
          text-transform: uppercase;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .visibility-badge.public {
          background-color: rgba(13, 110, 253, 0.12) !important;
          color: #0d6efd !important;
          border: 1px solid rgba(13, 110, 253, 0.2) !important;
        }
        .visibility-badge.private {
          background-color: rgba(108, 117, 125, 0.12) !important;
          color: var(--color-text-secondary) !important;
          border: 1px solid rgba(108, 117, 125, 0.2) !important;
        }
        .btn-close-custom {
          background: transparent;
          border: none;
          color: var(--color-text-secondary) !important;
          opacity: 0.8;
          font-size: 1.25rem;
          transition: all 0.2s ease;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .btn-close-custom:hover {
          color: var(--color-accent) !important;
          opacity: 1;
          transform: rotate(90deg);
        }
        .btn-premium-cancel {
          border: none;
          background: var(--color-bg-input) !important;
          color: var(--color-text-primary) !important;
          padding: 10px 24px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .btn-premium-cancel:hover {
          background: var(--color-bg-card-hover) !important;
          color: var(--color-text-primary) !important;
        }
      `}</style>
    </div>
  );
}
