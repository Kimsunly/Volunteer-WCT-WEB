import React, { useState, useEffect } from "react";
import {
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} from "@/services/community";
import { showToast } from "@/components/common/CustomToaster";
import DeleteCommunityPostModal from "@/components/modals/DeleteCommunityPostModal";
import OrganizerCommunityPostFormModal from "@/components/modals/OrganizerCommunityPostFormModal";
import OrganizerCommunityPostDetailModal from "@/components/modals/OrganizerCommunityPostDetailModal";

export default function CommunityManager({ initialPosts = [] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  const [deletingPostId, setDeletingPostId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPost, setDetailPost] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "discussion",
    images: [], // Currently just URL strings
  });

  const categories = [
    { value: "discussion", label: "ការពិភាក្សា (Discussion)" },
    { value: "event", label: "ព្រឹត្តិការណ៍ (Event)" },
    { value: "story", label: "រឿងរ៉ាវ (Story)" },
    { value: "update", label: "បច្ចុប្បន្នភាព (Update)" },
  ];

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Fetch my community posts only, since it's my organizer dashboard
      const res = await getMyPosts();
      const postList = Array.isArray(res) ? res : res?.data || [];
      setPosts(postList);
    } catch (err) {
      console.error(err);
      setError("បរាជ័យក្នុងការទាញយកទិន្នន័យ");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentPost(null);
    setFormData({ title: "", content: "", category: "discussion", images: [] });
    setShowModal(true);
  };

  const handleOpenDetail = (post) => {
    setDetailPost(post);
    setShowDetailModal(true);
  };

  const handleOpenEdit = (post) => {
    setIsEditing(true);
    setCurrentPost(post);
    setFormData({
      title: post.title || "",
      content: post.content || "",
      category: post.category || "discussion",
      images: post.images || [],
    });
    setShowModal(true);
  };

  const handleDelete = (post) => {
    setDeletingPostId(post.id);
    setDeleteTarget(post);
    setDeleteModalOpen(true);
  };

  const confirmDeletePost = async () => {
    try {
      await deletePost(deletingPostId);
      setPosts((prev) => prev.filter((p) => p.id !== deletingPostId));
      showToast.success("បានលុបប្រកាសសហគមន៍ដោយជោគជ័យ", "ជោគជ័យ");
    } catch (err) {
      console.error("Delete community post error:", err);
      showToast.error("បរាជ័យក្នុងការលុបប្រកាសសហគមន៍", "កំហុស");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await updatePost(currentPost.id, formData);
        showToast.success("បានកែសម្រួលប្រកាសសហគមន៍ដោយជោគជ័យ", "ជោគជ័យ");
      } else {
        await createPost(formData);
        showToast.success("បានបង្កើតប្រកាសសហគមន៍ដោយជោគជ័យ", "ជោគជ័យ");
      }
      setShowModal(false);
      fetchPosts();
    } catch (err) {
      console.error(err);
      showToast.error("មានបញ្ហាក្នុងការរក្សាទុកប្រកាសសហគមន៍", "កំហុស");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-pane fade show active" style={{ background: "transparent", border: "none", padding: 0 }}>
      {/* ── Toolbar ── */}
      <div
        className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 p-3 rounded-4 toolbar-wrapper"
        data-aos="fade-up"
      >
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 4, height: 20, background: "var(--color-accent)", borderRadius: 2 }} />
          <h5 className="mb-0 fw-bold title-theme">ប្រកាសសហគមន៍របស់ខ្ញុំ</h5>
        </div>
        <button className="btn btn-add-op" onClick={handleOpenCreate}>
          <i className="bi bi-plus-lg me-2"></i>បង្កើតប្រកាសថ្មី
        </button>
      </div>

      <div className="manager-content">
        {loading && <div className="text-center py-4 text-muted-theme">កំពុងដំណើរការ...</div>}

        {!loading && posts.length === 0 && (
          <div className="text-center py-5 text-muted-theme no-data-cell">
            <i className="bi bi-chat-square-text display-4 mb-3 d-block" style={{ opacity: 0.4 }}></i>
            មិនទាន់មានប្រកាសនៅឡើយទេ។
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="table-responsive" style={{ overflowX: "auto" }}>
            <table className="table align-middle mb-0" style={{ borderCollapse: "separate", borderSpacing: "0 10px", width: "100%" }}>
              <thead>
                <tr style={{ background: "transparent" }}>
                  <th className="regular-header">ចំណងជើង (Title)</th>
                  <th className="regular-header">ប្រភេទ (Category)</th>
                  <th className="regular-header">ស្ថានភាព (Status)</th>
                  <th className="regular-header">កាលបរិច្ឆេទ (Date)</th>
                  <th className="regular-header" style={{ textAlign: "right" }}>សកម្មភាព (Actions)</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="application-row">
                    <td className="cell-left border-y-theme">
                      <div className="fw-bold text-theme-primary">{post.title}</div>
                      <small
                        className="text-muted-theme text-truncate d-block mt-1"
                        style={{ maxWidth: "350px" }}
                      >
                        {post.content}
                      </small>
                    </td>
                    <td className="border-y-theme">
                      <span className="badge-category">
                        {post.category === "discussion" ? "ការពិភាក្សា" :
                         post.category === "event" ? "ព្រឹត្តិការណ៍" :
                         post.category === "story" ? "រឿងរ៉ាវ" :
                         post.category === "update" ? "បច្ចុប្បន្នភាព" : (post.category || "ការពិភាក្សា")}
                      </span>
                    </td>
                    <td className="border-y-theme">
                      <span className={`badge-status ${post.status === "approved" ? "status-approved" : "status-pending"}`}>
                        <i className={`bi ${post.status === "approved" ? "bi-check-circle-fill" : "bi-clock-fill"}`} style={{ fontSize: 11, marginRight: 5 }} />
                        {post.status === "approved" ? "បានអនុម័ត" : "រង់ចាំ"}
                      </span>
                    </td>
                    <td className="border-y-theme date-cell-text">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="cell-right border-y-theme" style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 8 }}>
                        <button
                          className="btn-action-tab btn-action-view"
                          onClick={() => handleOpenDetail(post)}
                          title="មើលលម្អិត"
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                        <button
                          className="btn-action-tab btn-action-edit"
                          onClick={() => handleOpenEdit(post)}
                          title="កែប្រែ"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          className="btn-action-tab btn-action-reject"
                          onClick={() => handleDelete(post)}
                          title="លុប"
                        >
                          <i className="bi bi-trash-fill"></i>
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

      <OrganizerCommunityPostFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setIsEditing(false);
          setCurrentPost(null);
        }}
        onSubmit={handleSubmit}
        editMode={isEditing}
        form={formData}
        setForm={setFormData}
        loading={loading}
      />

      <DeleteCommunityPostModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
          setDeletingPostId(null);
        }}
        onConfirm={confirmDeletePost}
        postTitle={deleteTarget?.title}
        postAuthor={deleteTarget?.organizerName}
        commentCount={deleteTarget?.comments || 0}
      />

      <OrganizerCommunityPostDetailModal
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setDetailPost(null);
        }}
        post={detailPost}
        onEdit={() => {
          setShowDetailModal(false);
          handleOpenEdit(detailPost);
          setDetailPost(null);
        }}
        onDelete={() => {
          setShowDetailModal(false);
          handleDelete(detailPost);
          setDetailPost(null);
        }}
      />

      <style jsx>{`
        .toolbar-wrapper {
          background-color: var(--color-bg-card);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-card);
        }

        .title-theme {
          color: var(--color-text-primary) !important;
        }

        .text-theme-primary {
          color: var(--color-text-primary) !important;
        }

        .text-muted-theme {
          color: var(--color-text-muted) !important;
        }

        .btn-add-op {
          background-color: var(--color-accent) !important;
          color: #000000 !important;
          border: none !important;
          font-weight: 700 !important;
          border-radius: 12px !important;
          padding: 10px 24px !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 4px 12px var(--color-accent-glow) !important;
          height: 42px;
          display: inline-flex;
          align-items: center;
        }
        :global([data-theme="light"]) .btn-add-op {
          color: #ffffff !important;
          background-color: #15803d !important;
          box-shadow: 0 4px 12px rgba(21, 128, 61, 0.25) !important;
        }
        .btn-add-op:hover {
          transform: scale(1.03) translateY(-1px) !important;
          box-shadow: 0 6px 18px var(--color-accent-glow), 0 0 0 3px var(--color-accent-dim) !important;
        }
        :global([data-theme="light"]) .btn-add-op:hover {
          box-shadow: 0 6px 18px rgba(21, 128, 61, 0.35), 0 0 0 3px rgba(21, 128, 61, 0.15) !important;
        }

        .regular-header {
          color: var(--color-text-secondary) !important;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 16px;
          border: none;
        }

        /* Table cells & spacing */
        .application-row {
          background: linear-gradient(135deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
          box-shadow: var(--shadow-card) !important;
          border-radius: 16px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .application-row:hover {
          border-color: var(--color-border-hover) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.1), var(--shadow-card) !important;
        }

        .border-y-theme {
          border-top: 1px solid var(--color-border) !important;
          border-bottom: 1px solid var(--color-border) !important;
        }
        .cell-left {
          padding: 16px;
          border-left: 1px solid var(--color-border) !important;
          border-top-left-radius: 14px;
          border-bottom-left-radius: 14px;
        }
        .cell-right {
          padding: 16px;
          border-right: 1px solid var(--color-border) !important;
          border-top-right-radius: 14px;
          border-bottom-right-radius: 14px;
        }

        .badge-category {
          display: inline-block;
          background: var(--color-accent-dim);
          color: var(--color-accent);
          font-size: 12px;
          font-weight: 600;
          padding: 3px 11px;
          border-radius: 20px;
          border: 1px solid var(--color-accent-glow);
        }

        .badge-status {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }
        .status-approved {
          color: var(--color-accent);
          background: var(--color-accent-dim);
          border: 1.5px solid var(--color-accent-glow);
        }
        .status-pending {
          color: #d97706;
          background: rgba(217, 119, 6, 0.12);
          border: 1.5px solid rgba(217, 119, 6, 0.25);
        }

        .date-cell-text {
          color: var(--color-text-secondary);
          font-size: 13.5px;
        }

        .no-data-cell {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          color: var(--color-text-secondary);
          padding: 40px;
        }

        /* Action buttons */
        .btn-action-tab {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--color-bg-card);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-action-view {
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
        }
        .btn-action-view:hover {
          background: var(--color-bg-input);
          color: var(--color-text-primary);
          border-color: var(--color-border-hover);
        }

        .btn-action-edit {
          border: 1px solid rgba(59, 130, 246, 0.25);
          color: #3b82f6;
        }
        .btn-action-edit:hover {
          background: rgba(59, 130, 246, 0.15);
          transform: translateY(-1px);
        }

        .btn-action-reject {
          border: 1px solid rgba(220, 38, 38, 0.25);
          color: #dc2626;
        }
        .btn-action-reject:hover {
          background: rgba(220, 38, 38, 0.15);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
