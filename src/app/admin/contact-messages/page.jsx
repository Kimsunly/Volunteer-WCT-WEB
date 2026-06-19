"use client";

import React, { useCallback, useEffect, useState } from "react";
import { RoleGuard } from "../components";
import {
  listContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from "@/services/admin";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { parseApiError } from "@/lib/utils/apiError";
import SafeDate from "@/components/common/SafeDate";

export default function AdminContactMessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listContactMessages();
      const data = res?.data || res || [];
      setMessages(Array.isArray(data) ? data : []);
      setTotal(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error("Fetch contact messages error:", err);
      setError("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user?.role?.toLowerCase() === "admin") {
      fetchMessages();
    }
  }, [authLoading, user, fetchMessages]);

  const openView = (msg) => {
    setSelectedMessage(msg);
    setViewModalOpen(true);
  };

  const updateStatus = async (msg, status) => {
    setActionLoading(msg.id);
    try {
      await updateContactMessageStatus(msg.id, status);
      toast.success(`Status updated to ${status}`);
      await fetchMessages();
    } catch (err) {
      console.error(err);
      const msgErr = parseApiError(err) || "Failed to update status";
      toast.error(msgErr);
    } finally {
      setActionLoading(null);
    }
  };

  const triggerDelete = (msg) => {
    setMessageToDelete(msg);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;
    setActionLoading(messageToDelete.id);
    try {
      await deleteContactMessage(messageToDelete.id);
      toast.success("Message deleted successfully");
      setDeleteConfirmOpen(false);
      setMessageToDelete(null);
      await fetchMessages();
    } catch (err) {
      console.error(err);
      const msgErr = parseApiError(err) || "Failed to delete message";
      toast.error(msgErr);
    } finally {
      setActionLoading(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <RoleGuard />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Contact Messages</h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.875rem",
              marginTop: "4px",
            }}
          >
            Manage messages from users who contacted us
          </p>
        </div>
      </div>

      <div
        className={
          user?.role !== "admin" ? "opacity-50 pointer-events-none" : ""
        }
      >
        {error && (
          <div className="card" style={{ color: "var(--color-negative)" }}>
            {error}
          </div>
        )}

        {/* Data Table */}
        <div className="card" style={{ padding: "0" }}>
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div className="card-header" style={{ marginBottom: "0" }}>
              <div className="card-title">Messages</div>
              <button className="card-menu-btn">
                <i className="bi bi-three-dots"></i>
              </button>
            </div>
          </div>

          {loading && (
            <div style={{ padding: "20px" }}>
              <div
                className="flex items-center gap-2"
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                }}
              >
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Loading messages...
              </div>
            </div>
          )}

          {!loading && !messages.length ? (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                color: "var(--color-text-muted)",
              }}
            >
              <i
                className="bi bi-envelope" style={{ fontSize: "3rem" }}></i>
              <p className="mt-4">No contact messages yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.id}>
                      <td>
                        <div
                          style={{
                            color: "var(--color-text-primary)",
                            fontWeight: "500",
                          }}
                        >
                          {msg.first_name} {msg.last_name}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            color: "var(--color-text-secondary)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {msg.email}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            color: "var(--color-text-secondary)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {msg.subject}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            color: "var(--color-text-secondary)",
                            fontSize: "0.875rem",
                          }}
                        >
                          <SafeDate dateString={msg.created_at} />
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${msg.status === "read" ? "active" : msg.status === "replied" ? "active" : "pending"}`}
                        >
                          {msg.status || "unread"}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn-secondary"
                            style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                            onClick={() => openView(msg)}
                            disabled={actionLoading === msg.id}
                          >
                            <i className="bi bi-eye me-1"></i> View
                          </button>
                          {msg.status !== "read" && (
                            <button
                              className="btn-primary"
                              style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                              onClick={() => updateStatus(msg, "read")}
                              disabled={actionLoading === msg.id}
                            >
                              <i className="bi bi-check2-circle me-1"></i> Mark Read
                            </button>
                          )}
                          {msg.status !== "replied" && (
                            <button
                              className="btn-primary"
                              style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                              onClick={() => updateStatus(msg, "replied")}
                              disabled={actionLoading === msg.id}
                            >
                              <i className="bi bi-reply-all me-1"></i> Mark Replied
                            </button>
                          )}
                          <button
                            className="btn-reject"
                            onClick={() => triggerDelete(msg)}
                            disabled={actionLoading === msg.id}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <small style={{ color: "var(--color-text-secondary)" }}>
            Total:{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>
              {total}
            </strong>
            {loading && (
              <span className="ms-2">
                <i
                  className="bi bi-arrow-repeat"
                  style={{ animation: "spin 1s linear infinite" }}
                ></i>
              </span>
            )}
          </small>
        </div>

        {/* View Message Modal */}
        {viewModalOpen && selectedMessage && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(8px)",
                zIndex: 1040,
              }}
              onClick={() => setViewModalOpen(false)}
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
                className="card shadow-lg"
                style={{
                  width: "100%",
                  maxWidth: "680px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border)",
                  padding: "32px",
                  borderRadius: "20px",
                  boxShadow: "var(--shadow-card)",
                  pointerEvents: "auto",
                  animation: "modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid var(--color-border)"
                  }}
                >
                  <h3 className="card-title" style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700", color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "10px" }}>
                    <i className="bi bi-envelope-open-fill" style={{ color: "var(--color-accent)" }}></i>
                    Message Details
                  </h3>
                  <button
                    className="icon-btn"
                    onClick={() => setViewModalOpen(false)}
                    aria-label="Close"
                    style={{ background: "none", border: "none", fontSize: "1.25rem", padding: "4px", cursor: "pointer" }}
                  >
                    <i className="bi bi-x-lg" style={{ color: "var(--color-text-muted)" }}></i>
                  </button>
                </div>

                {/* Profile Banner */}
                <div 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "16px", 
                    marginBottom: "24px", 
                    padding: "16px", 
                    backgroundColor: "var(--color-bg-input)", 
                    borderRadius: "12px",
                    border: "1px solid var(--color-border)"
                  }}
                >
                  <div 
                    style={{ 
                      width: "48px", 
                      height: "48px", 
                      borderRadius: "50%", 
                      background: "linear-gradient(135deg, var(--color-accent) 0%, #00bc8c 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#000000",
                      fontWeight: "700",
                      fontSize: "1.1rem"
                    }}
                  >
                    {((selectedMessage.first_name?.[0] || "") + (selectedMessage.last_name?.[0] || "")).toUpperCase() || "?"}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ margin: 0, fontWeight: "600", fontSize: "1.1rem", color: "var(--color-text-primary)" }}>
                      {selectedMessage.first_name} {selectedMessage.last_name}
                    </h4>
                    <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                      Submitted on <SafeDate dateString={selectedMessage.created_at} options={{ day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }} />
                    </p>
                  </div>
                  <div>
                    <span
                      className={`status-badge-custom ${selectedMessage.status === "replied" ? "active" : selectedMessage.status === "read" ? "active" : "pending"}`}
                    >
                      {selectedMessage.status || "unread"}
                    </span>
                  </div>
                </div>

                {/* Message Meta Info Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ color: "var(--color-accent)", fontSize: "1.1rem", marginTop: "2px" }}>
                      <i className="bi bi-envelope"></i>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "var(--color-text-secondary)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                        Email Address
                      </label>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        style={{ color: "var(--color-accent)", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ color: "var(--color-accent)", fontSize: "1.1rem", marginTop: "2px" }}>
                      <i className="bi bi-telephone"></i>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "var(--color-text-secondary)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                        Phone Number
                      </label>
                      {selectedMessage.phone ? (
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          style={{ color: "var(--color-accent)", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}
                        >
                          {selectedMessage.phone}
                        </a>
                      ) : (
                        <span style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>—</span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", gridColumn: "span 2" }}>
                    <div style={{ color: "var(--color-accent)", fontSize: "1.1rem", marginTop: "2px" }}>
                      <i className="bi bi-chat-left-quote"></i>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "var(--color-text-secondary)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                        Subject Topic
                      </label>
                      <div style={{ color: "var(--color-text-primary)", fontWeight: "600", fontSize: "0.95rem" }}>
                        {selectedMessage.subject}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Body Content */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}>
                  <label style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Message Body
                  </label>
                  <div
                    style={{
                      padding: "20px",
                      background: "var(--color-bg-base)",
                      borderRadius: "12px",
                      border: "1px solid var(--color-border)",
                      borderLeft: "3px solid var(--color-accent)",
                      color: "var(--color-text-primary)",
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.6",
                      fontSize: "0.925rem"
                    }}
                  >
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "12px",
                    marginTop: "32px",
                    paddingTop: "20px",
                    borderTop: "1px solid var(--color-border)",
                  }}
                >
                  {selectedMessage.status !== "read" && (
                    <button
                      className="btn-secondary"
                      style={{ padding: "8px 16px" }}
                      onClick={() => {
                        updateStatus(selectedMessage, "read");
                        setViewModalOpen(false);
                      }}
                    >
                      <i className="bi bi-check2-circle me-2"></i> Mark as Read
                    </button>
                  )}
                  {selectedMessage.status !== "replied" && (
                    <button
                      className="btn-secondary"
                      style={{ padding: "8px 16px" }}
                      onClick={() => {
                        updateStatus(selectedMessage, "replied");
                        setViewModalOpen(false);
                      }}
                    >
                      <i className="bi bi-reply-all me-2"></i> Mark as Replied
                    </button>
                  )}
                  <button
                    className="btn-primary"
                    style={{ padding: "8px 24px" }}
                    onClick={() => setViewModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmOpen && messageToDelete && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(4px)",
                zIndex: 1060,
              }}
              onClick={() => setDeleteConfirmOpen(false)}
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
                zIndex: 1070,
                padding: "1rem",
              }}
            >
              <div
                className="card shadow-lg"
                style={{
                  width: "100%",
                  maxWidth: "450px",
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border)",
                  padding: "32px",
                  borderRadius: "var(--radius-card)",
                  boxShadow: "var(--shadow-card)",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "var(--color-negative)", fontSize: "3.5rem", marginBottom: "16px" }}>
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: "700", marginBottom: "12px", color: "var(--color-text-primary)" }}>
                  Confirm Deletion
                </h3>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", marginBottom: "28px", lineHeight: "1.6" }}>
                  Are you sure you want to delete this message from <strong style={{ color: "var(--color-text-primary)" }}>{messageToDelete.first_name} {messageToDelete.last_name}</strong>? This action cannot be undone.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setDeleteConfirmOpen(false)}
                    style={{ minWidth: "110px" }}
                    disabled={actionLoading === messageToDelete.id}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-danger"
                    onClick={confirmDelete}
                    style={{
                      minWidth: "130px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                    disabled={actionLoading === messageToDelete.id}
                  >
                    {actionLoading === messageToDelete.id ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: "1rem", height: "1rem" }}></span>
                        Deleting...
                      </>
                    ) : (
                      "Yes, Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}