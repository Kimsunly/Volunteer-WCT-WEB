"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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
  const [selectedOp, setSelectedOp] = useState(null);

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

  const viewRegistrations = (item) => {
    alert(`${item.applicants_count ?? 0} registrations for "${item.title}"`);
  };

  const handleDeleteOpp = async (id) => {
    if (!confirm("Delete this opportunity permanently?")) return;
    try {
      await apiDeleteOpportunity(id);
      toast.success("លុបឱកាសដោយជោគជ័យ / Opportunity deleted successfully");
      await fetchOpps();
    } catch (e) {
      console.error("Delete error:", e);
      const msg = parseApiError(e) || "Failed to delete opportunity";
      toast.error(msg);
    }
  };

  const openCreateOpp = () => {
    setCreateOpen(true);
  };

  const openEditOpp = (item) => {
    setSelectedOp({
      id: item.id,
      titleKh: item.title,
      titleEn: item.title,
      locationKh: item.logistic?.location_label || item.location || "",
      capacity: item.capacity || 10,
      status: item.status || "active",
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
    });
    setEditOpen(true);
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

  const statusBadge = (s) => {
    const map = { active: "active", draft: "pending", closed: "rejected" };
    return (
      <span className={`status-badge ${map[s] || "pending"}`}>
        {s}
      </span>
    );
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString();
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <RoleGuard />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Opportunities Management</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "4px" }}>
            Admin has override power to CRUD all opportunities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            className="search-bar"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: "250px" }}
          />
          <select
            className="btn-secondary"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: "8px 16px" }}
          >
            <option value="all">All Categories</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="environment">Environment</option>
            <option value="community">Community</option>
          </select>
          <select
            className="btn-secondary"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: "8px 16px" }}
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
            <table className="data-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Organization</th>
                  <th>Category</th>
                  <th>Created</th>
                  <th>Visibility</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                      <td>
                        <strong>{o.title}</strong>
                      </td>
                      <td>
                        {o.organization_name || o.organizer_name || "Admin"}
                      </td>
                      <td>
                        <span className="status-badge active" style={{ background: "var(--color-bg-input)", color: "var(--color-accent)", border: "1px solid var(--color-accent)" }}>
                          {o.category?.name || o.category}
                        </span>
                      </td>
                      <td>
                        {formatDate(o.created_at)}
                      </td>
                      <td>
                        <i className={`bi ${o.visibility === "public" ? "bi-globe" : "bi-lock"}`}></i> {o.visibility}
                      </td>
                      <td>
                        {statusBadge(o.status)}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn-secondary"
                            style={{ padding: "6px 12px", fontSize: "0.8125rem" }}
                            onClick={() => openEditOpp(o)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn-secondary"
                            style={{ padding: "6px 12px", fontSize: "0.8125rem" }}
                            onClick={() => viewRegistrations(o)}
                            title="Registrations"
                          >
                            <i className="bi bi-people"></i> {o.applicants_count || 0}
                          </button>
                          <button
                            className="btn-reject"
                            style={{ padding: "6px 12px", fontSize: "0.8125rem" }}
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
      </div>
    </div>
  );
}
