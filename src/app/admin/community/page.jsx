"use client";

import React, { useEffect, useState, useCallback } from "react";
import { PageHeader, RoleGuard } from "../components";
import {
  listModerationPosts,
  approveCommunityPost,
  rejectCommunityPost,
  deleteCommunityPost as apiDeleteCommunityPost,
  createAdminCommunityPost
} from "@/services/community";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function AdminCommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all"); // all | pending | approved | rejected
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState({
    title: "",
    content: "",
    category: "discussion" // Default
  });
  const [createLoading, setCreateLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listModerationPosts({
        status: filter === "all" ? null : filter,
        limit,
        offset,
      });
      setPosts(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
      setError("បរាជ័យក្នុងការទាញយកប្រកាស");
    } finally {
      setLoading(false);
    }
  }, [filter, limit, offset]);

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      fetchPosts();
    }
  }, [authLoading, user, fetchPosts]);

  const viewDetail = (p) => setDetail(p);

  const handleApprove = async (id) => {
    if (!confirm("អនុម័តប្រកាសនេះ?")) return;
    try {
      await approveCommunityPost(id);
      toast.success("បានអនុម័ត");
      fetchPosts();
    } catch (e) {
      console.error(e);
      toast.error("បរាជ័យ");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("មូលហេតុនៃការបដិសេធ:");
    if (!reason) return;
    try {
      await rejectCommunityPost(id, reason);
      toast.success("បានបដិសេធ");
      fetchPosts();
    } catch (e) {
      console.error(e);
      toast.error("បរាជ័យ");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("លុបប្រកាសនេះ?")) return;
    try {
      await apiDeleteCommunityPost(id);
      toast.success("បានលុប");
      fetchPosts();
    } catch (e) {
      console.error(e);
      toast.error("បរាជ័យ");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await createAdminCommunityPost(createData);
      toast.success("បានបង្កើតដោយជោគជ័យ");
      setShowCreateModal(false);
      setCreateData({ title: "", content: "", category: "discussion" });
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("បរាជ័យក្នុងការបង្កើត");
    } finally {
      setCreateLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  // Case-insensitive role check
  // const isAdmin = user?.role?.toLowerCase() === "admin";

  // if (!authLoading && !isAdmin) {
  // If not loading and not admin, return null or redirect (RoleGuard handles redirect mostly)
  // return null; 
  // }

  return (
    <>
      <RoleGuard enabled={user?.role !== "admin"} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <PageHeader
          title="គ្រប់គ្រងសហគមន៍"
          subtitle="អនុម័ត ឬ បដិសេធប្រកាសពីអង្គការ"
        />
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="bi bi-plus-lg me-2"></i>
          បង្កើតប្រកាស (Admin)
        </button>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-auto">
              <label className="form-label small mb-1">ស្ថានភាព</label>
              <select
                className="form-select form-select-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">ទាំងអស់</option>
                <option value="pending">រង់ចាំ</option>
                <option value="approved">បានអនុម័ត</option>
                <option value="rejected">បានបដិសេធ</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h6 className="mb-0">ប្រកាសសហគមន៍ ({total})</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ចំណងជើង</th>
                  <th>អង្គការ</th>
                  <th>ប្រភេទ</th>
                  <th>កាលបរិច្ឆេទ</th>
                  <th>ស្ថានភាព</th>
                  <th>សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: limit }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="6">
                        <div className="placeholder-glow">
                          <span
                            className="placeholder col-12"
                            style={{ height: 20 }}
                          ></span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      មិនមានប្រកាស
                    </td>
                  </tr>
                ) : (
                  posts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="fw-semibold">{p.title}</div>
                      </td>
                      <td>{p.organizer_id}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {p.category}
                        </span>
                      </td>
                      <td>{new Date(p.created_at).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge ${p.status === "approved"
                            ? "bg-success"
                            : p.status === "pending"
                              ? "bg-warning"
                              : "bg-danger"
                            }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => viewDetail(p)}
                            title="មើលលម្អិត"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          {p.status === "pending" && (
                            <>
                              <button
                                className="btn btn-outline-success"
                                onClick={() => handleApprove(p.id)}
                                title="អនុម័ត"
                              >
                                <i className="bi bi-check-circle"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleReject(p.id)}
                                title="បដិសេធ"
                              >
                                <i className="bi bi-x-circle"></i>
                              </button>
                            </>
                          )}
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(p.id)}
                            title="លុប"
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
      </div>

      <div className="d-flex align-items-center justify-content-between mt-3">
        <small className="text-muted d-flex align-items-center gap-2">
          <span>
            ទិន្នន័យសរុប: <strong>{total}</strong>
          </span>
          {loading && (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
            ></span>
          )}
        </small>
        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage(Math.max(1, page - 1))}
              >
                Previous
              </button>
            </li>
            <li className="page-item active">
              <span className="page-link">{page}</span>
            </li>
            <li
              className={`page-item ${page * limit >= total ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Detail Modal */}
      {
        detail && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setDetail(null)}
          >
            <div
              className="modal-dialog modal-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{detail.title}</h5>
                  <button
                    className="btn-close"
                    onClick={() => setDetail(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>អង្គការ:</strong> {detail.organizerName}
                  </div>
                  <div className="mb-3">
                    <strong>ប្រភេទ:</strong> {detail.category}
                  </div>
                  <div className="mb-3">
                    <strong>មាតិកា:</strong>
                    <p className="mt-2">{detail.content}</p>
                    <p className="text-muted">{detail.contentKh}</p>
                  </div>
                  <div className="mb-3">
                    <strong>ស្ថានភាព:</strong>{" "}
                    <span
                      className={`badge ${detail.status === "approved"
                        ? "bg-success"
                        : detail.status === "pending"
                          ? "bg-warning"
                          : "bg-danger"
                        }`}
                    >
                      {detail.status}
                    </span>
                  </div>
                  <div>
                    <strong>ទិន្នន័យ:</strong> Likes: {detail.likes}, Comments:{" "}
                    {detail.comments}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {/* Create Modal */}
      {
        showCreateModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">បង្កើតប្រកាសថ្មី</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowCreateModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleCreate}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Title <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={createData.title}
                        onChange={e => setCreateData({ ...createData, title: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={createData.category}
                        onChange={e => setCreateData({ ...createData, category: e.target.value })}
                      >
                        <option value="discussion">Discussion</option>
                        <option value="event">Event</option>
                        <option value="story">Story</option>
                        <option value="update">Update</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Content <span className="text-danger">*</span></label>
                      <textarea
                        className="form-control"
                        rows="5"
                        required
                        value={createData.content}
                        onChange={e => setCreateData({ ...createData, content: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={createLoading}>
                      {createLoading ? "Creating..." : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}
