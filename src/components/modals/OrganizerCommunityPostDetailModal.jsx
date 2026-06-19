"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getComments, deleteComment } from "@/services/comments";
import { showToast } from "@/components/common/CustomToaster";

export default function OrganizerCommunityPostDetailModal({
  open,
  onClose,
  post,
  onEdit,
  onDelete,
}) {
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("comments"); // comments | reactions

  const fetchComments = useCallback(async () => {
    if (!post?.id) return;
    setCommentsLoading(true);
    try {
      const res = await getComments("community", post.id);
      setComments(res?.data || res || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  }, [post?.id]);

  useEffect(() => {
    if (open && post?.id) {
      fetchComments();
    }
  }, [open, post?.id, fetchComments]);

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("តើអ្នកពិតជាចង់លុបមតិយោបល់នេះមែនទេ?")) return;
    try {
      await deleteComment(commentId);
      showToast.success("លុបមតិយោបល់បានជោគជ័យ", "ជោគជ័យ");
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err);
      showToast.error("បរាជ័យក្នុងការលុបមតិយោបល់", "កំហុស");
    }
  };

  if (!open || !post) return null;

  const tagList = Array.isArray(post.tags) ? post.tags : [];
  const authorName =
    post.organizerName || post.author?.name || post.user?.name || "Unknown";
  const publishedAt = post.createdAt || post.created_at;
  const statusLabel =
    post.status === "approved" ||
    post.status === "published" ||
    post.is_published
      ? "Approved"
      : post.status === "rejected"
        ? "Rejected"
        : "Pending";

  const likedByList = Array.isArray(post.liked_by) ? post.liked_by : [];

  const renderAvatar = (user) => {
    const avatarUrl = user?.avatar_url || user?.avatar;
    if (avatarUrl && typeof avatarUrl === "string" && avatarUrl.trim() !== "") {
      return (
        <img
          src={avatarUrl}
          alt={user?.name || "User"}
          className="avatar-img-premium"
        />
      );
    }
    const initials = user?.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "?";
    return <div className="avatar-fallback-premium">{initials}</div>;
  };

  return (
    <div
      className="modal-backdrop-premium"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel-premium">
        {/* Modal Header Banner */}
        <div className="modal-header-banner">
          <button
            onClick={onClose}
            className="modal-close-bubble"
            aria-label="Close"
          >
            <i className="bi bi-x-lg" />
          </button>

          <span className="modal-category-tag">
            <i className="bi bi-tag-fill" />
            {post.category === "discussion" ? "Discussion (ការពិភាក្សា)" :
             post.category === "event" ? "Event (ព្រឹត្តិការណ៍)" :
             post.category === "story" ? "Story (រឿងរ៉ាវ)" :
             post.category === "update" ? "Update (បច្ចុប្បន្នភាព)" : (post.category || "Discussion")}
          </span>

          <h3 className="modal-title-main">
            {post.title}
          </h3>
          <p className="modal-title-sub">
            បោះពុម្ពផ្សាយដោយ {authorName} • {publishedAt ? new Date(publishedAt).toLocaleDateString() : "N/A"}
          </p>
        </div>

        {/* Optional Image */}
        {post.image_url && (
          <div className="modal-image-wrapper">
            <img
              src={post.image_url}
              alt={post.title}
              className="modal-post-image"
            />
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="modal-body-scrollable">
          {/* Metadata Grid */}
          <div className="metadata-info-grid">
            <div className="info-card">
              <span className="info-card-label">ប្រភេទ / Category</span>
              <span className="badge-category mt-1">
                {post.category === "discussion" ? "ការពិភាក្សា" :
                 post.category === "event" ? "ព្រឹត្តិការណ៍" :
                 post.category === "story" ? "រឿងរ៉ាវ" :
                 post.category === "update" ? "បច្ចុប្បន្នភាព" : (post.category || "ការពិភាក្សា")}
              </span>
            </div>
            <div className="info-card">
              <span className="info-card-label">ស្ថានភាព / Status</span>
              <span className={`badge-status mt-1 ${statusLabel.toLowerCase()}`}>
                <i className={`bi ${statusLabel === "Approved" ? "bi-check-circle-fill" : statusLabel === "Rejected" ? "bi-x-circle-fill" : "bi-clock-fill"}`} style={{ fontSize: 11, marginRight: 5 }} />
                {statusLabel === "Approved" ? "បានអនុម័ត" : statusLabel === "Rejected" ? "បានបដិសេធ" : "រង់ចាំ"}
              </span>
            </div>
          </div>

          {/* Post Content */}
          <div className="modal-content-card">
            <span className="info-card-label mb-2 d-block">មាតិកា / Content Description</span>
            <p className="content-text-block">{post.content}</p>
            {post.contentKh && (
              <p className="content-text-block-kh mt-2">{post.contentKh}</p>
            )}
          </div>

          {/* Tags */}
          {tagList.length > 0 && (
            <div>
              <span className="info-card-label mb-2 d-block">Tags</span>
              <div className="d-flex flex-wrap gap-2">
                {tagList.map((tag) => (
                  <span
                    key={tag}
                    className="badge rounded-pill text-dark"
                    style={{
                      background: "rgba(37, 99, 235, 0.10)",
                      border: "1px solid rgba(37, 99, 235, 0.15)",
                      fontSize: "12px",
                      padding: "4px 12px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Likes & Comments Counters */}
          <div className="engagement-wrapper">
            <div className="engagement-item">
              <i className="bi bi-heart-fill icon-like" />
              <span className="count-num">{post.likes || post.likes_count || 0}</span>
              <span className="count-label">Likes</span>
            </div>
            <div className="engagement-item">
              <i className="bi bi-chat-fill icon-comment" />
              <span className="count-num">{post.comments || post.comments_count || 0}</span>
              <span className="count-label">Comments</span>
            </div>
          </div>

          {/* Sub-Tabs for Likes & Comments lists */}
          <div className="subtabs-navigation">
            <button
              type="button"
              className={`subtab-btn ${activeSubTab === "comments" ? "active" : ""}`}
              onClick={() => setActiveSubTab("comments")}
            >
              <i className="bi bi-chat-left-text me-2" />
              មតិយោបល់ ({comments.length})
            </button>
            <button
              type="button"
              className={`subtab-btn ${activeSubTab === "reactions" ? "active" : ""}`}
              onClick={() => setActiveSubTab("reactions")}
            >
              <i className="bi bi-heart me-2" />
              អ្នកចូលចិត្ត ({likedByList.length})
            </button>
          </div>

          {/* Tab content lists */}
          <div className="premium-tab-content">
            {activeSubTab === "comments" && (
              <>
                {commentsLoading ? (
                  <div className="no-data-text-premium py-3">កំពុងទាញយកមតិយោបល់...</div>
                ) : comments.length === 0 ? (
                  <div className="no-data-text-premium">មិនទាន់មានមតិយោបល់នៅឡើយទេ។</div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="premium-comment-item">
                      <div className="comment-header-row">
                        <div className="commenter-info">
                          {renderAvatar(comment.user)}
                          <div className="commenter-meta">
                            <span className="commenter-name">
                              {comment.userName || comment.user?.name || "Unknown"}
                            </span>
                            {comment.user?.tier_label && (
                              <span className="commenter-tier-badge">
                                {comment.user.tier_label}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="comment-actions">
                          <span className="comment-date">
                            {comment.createdAt || new Date(comment.created_at).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            className="btn-delete-comment-bubble"
                            onClick={() => handleDeleteComment(comment.id)}
                            title="លុបមតិយោបល់"
                          >
                            <i className="bi bi-trash-fill" />
                          </button>
                        </div>
                      </div>
                      <p className="comment-text-content">{comment.content}</p>
                    </div>
                  ))
                )}
              </>
            )}

            {activeSubTab === "reactions" && (
              <>
                {likedByList.length === 0 ? (
                  <div className="no-data-text-premium">មិនទាន់មានអ្នកចូលចិត្តនៅឡើយទេ។</div>
                ) : (
                  likedByList.map((user) => (
                    <div key={user.id} className="premium-reaction-item">
                      <div className="reaction-user-info">
                        {renderAvatar(user)}
                        <div className="reaction-user-meta">
                          <span className="reaction-user-name">{user.name}</span>
                          {user.email && <span className="reaction-user-email">{user.email}</span>}
                        </div>
                      </div>
                      {user.tier_label && (
                        <span className="reaction-user-tier-badge">
                          {user.tier_label}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer-premium">
          <button
            type="button"
            className="btn-premium-cancel"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn-premium-edit"
            onClick={onEdit}
          >
            <i className="bi bi-pencil-fill me-2"></i>
            Edit Post
          </button>
          <button
            type="button"
            className="btn-premium-delete"
            onClick={onDelete}
          >
            <i className="bi bi-trash-fill me-2"></i>
            Delete Post
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop-premium {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          z-index: 1060;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-panel-premium {
          width: 100%;
          max-width: 580px;
          max-height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          border-radius: 24px;
          border: 1px solid var(--color-border);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
          position: relative;
          animation: slideUp 0.3s ease-out forwards;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header-banner {
          background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%);
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          position: relative;
          border-bottom: 1px solid var(--color-border);
        }

        .modal-close-bubble {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .modal-close-bubble:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: rotate(90deg);
        }

        .modal-category-tag {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: rgba(255, 255, 255, 0.9);
          font-size: 11px;
          font-weight: 700;
          padding: 3px 12px;
          border-radius: 20px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .modal-title-main {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.4;
        }

        .modal-title-sub {
          margin: 6px 0 0;
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .modal-image-wrapper {
          width: 100%;
          overflow: hidden;
          max-height: 250px;
          border-bottom: 1px solid var(--color-border);
        }
        .modal-post-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-body-scrollable {
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: var(--color-bg-base);
        }

        .metadata-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .info-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
        }

        .info-card-label {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-category {
          align-self: flex-start;
          background: var(--color-accent-dim);
          color: var(--color-accent);
          font-size: 12.5px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid var(--color-accent-glow);
        }

        .badge-status {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }
        .badge-status.approved {
          color: var(--color-accent);
          background: var(--color-accent-dim);
          border: 1.5px solid var(--color-accent-glow);
        }
        .badge-status.pending {
          color: #d97706;
          background: rgba(217, 119, 6, 0.12);
          border: 1.5px solid rgba(217, 119, 6, 0.25);
        }
        .badge-status.rejected {
          color: #dc2626;
          background: rgba(220, 38, 38, 0.12);
          border: 1.5px solid rgba(220, 38, 38, 0.25);
        }

        .modal-content-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 18px;
          box-shadow: var(--shadow-card);
        }

        .content-text-block {
          margin: 0;
          font-size: 14.5px;
          color: var(--color-text-primary);
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .content-text-block-kh {
          margin: 0;
          font-size: 14.5px;
          color: var(--color-text-secondary);
          line-height: 1.7;
          white-space: pre-wrap;
          border-top: 1px solid var(--color-border);
          padding-top: 12px;
          word-break: break-word;
          overflow-wrap: break-word;
        }

        .engagement-wrapper {
          display: flex;
          gap: 24px;
          border-top: 1px solid var(--color-border);
          padding-top: 16px;
        }

        .engagement-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
        }

        .icon-like {
          color: #dc3545;
        }
        .icon-comment {
          color: var(--color-accent);
        }
        :global([data-theme="light"]) .icon-comment {
          color: #15803d;
        }

        .count-num {
          font-weight: 700;
          color: var(--color-text-primary);
        }
        .count-label {
          color: var(--color-text-secondary);
        }

        .subtabs-navigation {
          display: flex;
          gap: 12px;
          border-bottom: 1.5px solid var(--color-border);
          padding-bottom: 8px;
          margin-top: 10px;
        }

        .subtab-btn {
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          font-weight: 700;
          font-size: 13.5px;
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .subtab-btn:hover {
          color: var(--color-text-primary);
          background: var(--color-bg-input);
        }
        .subtab-btn.active {
          color: var(--color-accent);
          background: var(--color-accent-dim);
          border: 1px solid var(--color-accent-glow);
        }
        :global([data-theme="light"]) .subtab-btn.active {
          color: #15803d;
          background: rgba(21, 128, 61, 0.1);
          border: 1px solid rgba(21, 128, 61, 0.2);
        }

        .premium-tab-content {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 16px;
          min-height: 120px;
          max-height: 300px;
          overflow-y: auto;
        }

        .premium-reaction-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-bottom: 1px solid var(--color-border);
          transition: all 0.2s;
        }
        .premium-reaction-item:last-child {
          border-bottom: none;
        }
        .premium-reaction-item:hover {
          background: var(--color-bg-input);
          border-radius: 10px;
        }

        .reaction-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .reaction-user-meta {
          display: flex;
          flex-direction: column;
        }
        .reaction-user-name {
          font-weight: 700;
          font-size: 13.5px;
          color: var(--color-text-primary);
        }
        .reaction-user-email {
          font-size: 11px;
          color: var(--color-text-muted);
        }
        .reaction-user-tier-badge, .commenter-tier-badge {
          font-size: 10.5px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 20px;
          background: var(--color-accent-dim);
          color: var(--color-accent);
          border: 1px solid var(--color-accent-glow);
        }
        :global([data-theme="light"]) .reaction-user-tier-badge,
        :global([data-theme="light"]) .commenter-tier-badge {
          color: #15803d;
          background: rgba(21, 128, 61, 0.1);
          border: 1px solid rgba(21, 128, 61, 0.2);
        }

        .premium-comment-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          border-bottom: 1px solid var(--color-border);
          transition: all 0.2s;
        }
        .premium-comment-item:last-child {
          border-bottom: none;
        }
        .premium-comment-item:hover {
          background: var(--color-bg-input);
          border-radius: 12px;
        }

        .comment-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .commenter-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .commenter-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .commenter-name {
          font-weight: 700;
          font-size: 13.5px;
          color: var(--color-text-primary);
        }

        .comment-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .comment-date {
          font-size: 11px;
          color: var(--color-text-muted);
        }
        .btn-delete-comment-bubble {
          background: transparent;
          border: none;
          color: rgba(220, 38, 38, 0.6);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .btn-delete-comment-bubble:hover {
          color: #dc2626;
          background: rgba(220, 38, 38, 0.1);
        }

        .comment-text-content {
          margin: 0;
          font-size: 13.5px;
          color: var(--color-text-secondary);
          line-height: 1.5;
          padding-left: 42px;
        }

        .avatar-img-premium {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--color-border);
        }
        .avatar-fallback-premium {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-accent-dim);
          color: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
          border: 1px solid var(--color-accent-glow);
        }
        :global([data-theme="light"]) .avatar-fallback-premium {
          color: #15803d;
          background: rgba(21, 128, 61, 0.1);
          border: 1px solid rgba(21, 128, 61, 0.2);
        }

        .no-data-text-premium {
          color: var(--color-text-muted);
          font-size: 13.5px;
          font-style: italic;
          text-align: center;
          padding: 24px 0;
        }

        .modal-footer-premium {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          background: var(--color-bg-card);
          border-top: 1px solid var(--color-border);
        }

        .btn-premium-cancel {
          border: 1.5px solid var(--color-border);
          background: var(--color-bg-input) !important;
          color: var(--color-text-primary) !important;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .btn-premium-cancel:hover {
          background: var(--color-bg-card-hover) !important;
          border-color: var(--color-border-hover);
        }

        .btn-premium-edit {
          border: 1px solid rgba(59, 130, 246, 0.3);
          background: rgba(59, 130, 246, 0.08) !important;
          color: #3b82f6 !important;
          padding: 10px 22px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.2s ease;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
        }
        .btn-premium-edit:hover {
          background: rgba(59, 130, 246, 0.16) !important;
          transform: translateY(-1px);
        }

        .btn-premium-delete {
          border: 1.5px solid rgba(220, 38, 38, 0.3);
          background: rgba(220, 38, 38, 0.08) !important;
          color: #dc2626 !important;
          padding: 10px 22px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.2s ease;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
        }
        .btn-premium-delete:hover {
          background: rgba(220, 38, 38, 0.16) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
