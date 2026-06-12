"use client";

import React, { useEffect, useState, useMemo } from "react";
import DeleteCommentModal from "@/components/modals/DeleteCommentModal";
import { listCommunityPosts, likeCommunityPost } from "@/services/community";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/services/comments";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/components/common/CustomToaster";
import { parseApiError } from "@/lib/utils/apiError";
import toast from "react-hot-toast";

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  // Comment states
  const [modalComments, setModalComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  // Reactions modal state
  const [showReactionsModal, setShowReactionsModal] = useState(null);

  const fetchCommentsForPost = async (postId) => {
    try {
      setLoadingComments(true);
      const data = await getComments("community_post", postId, { limit: 50 });
      // Backend returns { success: true, data: [...] }
      setModalComments(data.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (selectedPost) {
      fetchCommentsForPost(selectedPost.id);
      setCommentText(""); // Reset text
    } else {
      setModalComments([]);
    }
  }, [selectedPost]);

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedPost) return;
    if (!user) {
      showToast.error("សូមចូលគណនីរបស់អ្នកដើម្បីបញ្ចេញមតិ", "មិនមានសិទ្ធិ");
      return;
    }

    try {
      setSubmittingComment(true);
      await createComment(commentText, "community_post", selectedPost.id);
      setCommentText("");
      await fetchCommentsForPost(selectedPost.id);

      // Update global post comments count
      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPost.id
            ? { ...p, comments_count: (p.comments_count || 0) + 1 }
            : p,
        ),
      );
      // Update selected post comments count
      setSelectedPost((prev) => ({
        ...prev,
        comments_count: (prev.comments_count || 0) + 1,
      }));

      showToast.success("មតិរបស់អ្នកត្រូវបានបញ្ជូន", "ជោគជ័យ");
    } catch (err) {
      console.error("Error creating comment:", err);
      showToast.error(parseApiError(err) || "បរាជ័យក្នុងការបញ្ចេញមតិ", "កំហុស");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    setDeletingCommentId(commentId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      showToast.success("បានលុបមតិយោបល់ដោយជោគជ័យ", "ជោគជ័យ");
      fetchCommentsForPost(selectedPost.id);
      // Update counts
      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPost.id
            ? { ...p, comments_count: Math.max(0, (p.comments_count || 0) - 1) }
            : p,
        ),
      );
      setSelectedPost((prev) => ({
        ...prev,
        comments_count: Math.max(0, (prev.comments_count || 0) - 1),
      }));
    } catch (err) {
      showToast.error(
        parseApiError(err) || "បរាជ័យក្នុងការលុបមតិយោបល់",
        "កំហុស",
      );
    }
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editCommentText.trim()) return;

    try {
      setSubmittingEdit(true);
      await updateComment(editingCommentId, editCommentText);
      showToast.success("បានកែសម្រួលមតិយោបល់ដោយជោគជ័យ", "ជោគជ័យ");
      setEditingCommentId(null);
      setEditCommentText("");
      fetchCommentsForPost(selectedPost.id);
    } catch (err) {
      showToast.error(
        parseApiError(err) || "បរាជ័យក្នុងការកែសម្រួលមតិយោបល់",
        "កំហុស",
      );
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleShare = async (post) => {
    const shareData = {
      title: post.title,
      text: post.content.substring(0, 100) + "...",
      url: window.location.href, // In a real app with routing, append /posts/id
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success("បានចម្លងតំណភ្ជាប់!");
    }
  };

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (isFirstLoad) {
          setLoading(true);
        }

        const data = await listCommunityPosts(); // Fetch ALL posts first, no server-side filter
        const postList = Array.isArray(data) ? data : data?.data || [];

        // Map backend posts to UI
        const mapped = postList.map((p) => ({
          id: p.id,
          organizer_name: p.user?.name || p.author?.name || "Volunteer WCT",
          organizer_avatar:
            p.user?.avatar_url || p.author?.avatar_url || "/images/profile.png",
          created_at: new Date(p.created_at).toLocaleDateString("km-KH", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          category: p.category,
          title: p.title,
          title_kh: p.title_kh || "",
          content: p.content,
          content_kh: p.content_kh || "",
          tags: p.tags_json || [],
          likes_count: p.likes_count || 0,
          comments_count: p.comments_count || 0,
          image_url: p.image_url,
          images: p.image_json || [],
          liked_by: p.liked_by || [],
          liked: p.liked || false,
        }));

        console.log("Fetched and mapped posts:", mapped);
        setPosts(mapped);
      } catch (err) {
        console.error("Error fetching community posts:", err);
        setError("បរាជ័យក្នុងការទាញយកការប្រកាស");
      } finally {
        setLoading(false);
        setIsFirstLoad(false);
      }
    }
    fetchPosts();
  }, []); // Remove filter dependency—we filter client-side now

  const filtered = useMemo(() => {
    const results = posts.filter((p) => {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      const matchSearch =
        searchTerm === "" ||
        (p.title && p.title.toLowerCase().includes(normalizedSearchTerm)) ||
        (p.title_kh && p.title_kh.includes(searchTerm)) ||
        (p.content && p.content.toLowerCase().includes(normalizedSearchTerm)) ||
        (p.content_kh && p.content_kh.includes(searchTerm)) ||
        (p.organizer_name &&
          p.organizer_name.toLowerCase().includes(normalizedSearchTerm));

      const matchFilter =
        filter === "all" ||
        (p.category && p.category.toLowerCase() === filter.toLowerCase());

      return matchSearch && matchFilter;
    });

    console.log("Filtering posts:", { searchTerm, filter, posts, results });
    return results;
  }, [posts, searchTerm, filter]);

  const handleLike = async (postId) => {
    if (!user) {
      showToast.error(
        "សូមចូលគណនីរបស់អ្នកដើម្បីធ្វើសកម្មភាពនេះ",
        "មិនមានសិទ្ធិ",
      );
      return;
    }
    try {
      const updated = await likeCommunityPost(postId);
      const result = updated.data || updated;

      // Update UI optimistically
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              liked: result.liked,
              likes_count: result.likes_count,
              liked_by: result.liked_by || [],
            };
          }
          return p;
        }),
      );

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost((prev) => ({
          ...prev,
          liked: result.liked,
          likes_count: result.likes_count,
          liked_by: result.liked_by || [],
        }));
      }

      if (showReactionsModal && showReactionsModal.id === postId) {
        setShowReactionsModal((prev) => ({
          ...prev,
          liked: result.liked,
          likes_count: result.likes_count,
          liked_by: result.liked_by || [],
        }));
      }
    } catch (err) {
      console.error("Like error:", err);
      showToast.error(parseApiError(err) || "បរាជ័យក្នុងការចូលចិត្ត", "កំហុស");
    }
  };

  if (loading && isFirstLoad)
    return (
      <div className="container py-5 text-center" style={{ marginTop: 130 }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <main
      className="flex-grow-1 bg-light"
      style={{ marginTop: 130, paddingBottom: "2rem" }}
    >
      <div className="container py-4">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1
            className="display-5 fw-bold mb-3"
            style={{ fontFamily: "var(--font-khmer)" }}
          >
            សហគមន៍ស្ម័គ្រចិត្ត
          </h1>
          <p className="lead text-muted">
            ភ្ជាប់ទំនាក់ទំនងជាមួយសហគមន៍ស្ម័គ្រចិត្ត និងចែករំលែកបទពិសោធន៍
          </p>
        </div>

        {/* Filter & Search */}
        <div className="row g-3 mb-4 align-items-stretch">
          <div className="col-md-4">
            <select
              className="form-select border-0 shadow-sm rounded-4"
              style={{ padding: "1rem" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">ទាំងអស់</option>
              <option value="update">Updates</option>
              <option value="event">Events</option>
              <option value="discussion">Discussions</option>
              <option value="story">Stories</option>
            </select>
          </div>
          <div className="col-md-8">
            <div className="input-group h-100">
              <span
                className="input-group-text border-0 bg-white shadow-sm"
                style={{ borderRadius: "2rem 0 0 2rem", paddingLeft: "1.5rem" }}
              >
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-sm"
                placeholder="ស្វែងរកប្រកាស..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  borderRadius: "0 2rem 2rem 0",
                  padding: "1rem 1.5rem",
                }}
              />
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="row g-4">
          {filtered.length === 0 ? (
            <div className="col-12 text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted"></i>
              <p className="text-muted mt-3">មិនមានប្រកាស</p>
            </div>
          ) : (
            filtered.map((post) => (
              <div key={post.id} className="col-lg-6">
                <div
                  className="card h-100 border-0 shadow-lg rounded-5 overflow-hidden"
                  style={{ transition: "all 0.3s ease", cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-8px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                  onClick={() => setSelectedPost(post)}
                >
                  {/* Image */}
                  {post.image_url && (
                    <div
                      className="position-relative overflow-hidden"
                      style={{ height: "240px" }}
                    >
                      <img
                        src={post.image_url}
                        className="w-100 h-100 object-fit-cover"
                        alt={post.title}
                        style={{ transition: "transform 0.3s ease" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      />
                      {/* Category Badge */}
                      {post.category && (
                        <div className="position-absolute top-3 left-3">
                          <span
                            className="badge bg-white text-dark rounded-pill px-3 py-2 fw-semibold shadow-sm"
                            style={{ fontSize: "0.85rem" }}
                          >
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="card-body p-4">
                    {/* Header */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={post.organizer_avatar}
                          className="rounded-circle"
                          alt={post.organizer_name}
                          width={48}
                          height={48}
                          style={{ objectFit: "cover" }}
                        />
                        <div className="d-flex flex-column">
                          <span className="fw-semibold text-dark">
                            {post.organizer_name}
                          </span>
                          <span
                            className="text-muted small"
                            style={{ fontSize: "0.8rem" }}
                          >
                            {post.created_at}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <h5
                      className="card-title mb-2 text-dark"
                      style={{ fontWeight: 700, lineHeight: "1.4" }}
                    >
                      {post.title}
                    </h5>
                    {post.title_kh && (
                      <h6 className="card-subtitle text-muted mb-3">
                        {post.title_kh}
                      </h6>
                    )}
                    <p
                      className="card-text text-muted mb-4"
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: "1.6",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.content}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="badge bg-light text-dark small px-2 py-1 rounded-3"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-3">
                        {/* Like */}
                        <button
                          className="btn btn-light rounded-4 px-4 py-2 d-flex align-items-center gap-2"
                          style={{
                            border: "none",
                            transition: "all 0.2s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post.id);
                          }}
                        >
                          <i
                            className={`bi ${post.liked ? "bi-heart-fill text-danger" : "bi-heart"}`}
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                          <span className="fw-semibold">
                            {post.likes_count}
                          </span>
                        </button>

                        {/* Comment */}
                        <button
                          className="btn btn-light rounded-4 px-4 py-2 d-flex align-items-center gap-2"
                          style={{
                            border: "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <i
                            className="bi bi-chat"
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                          <span className="fw-semibold">
                            {post.comments_count}
                          </span>
                        </button>
                      </div>

                      <button
                        className="btn btn-primary rounded-4 px-4 py-2 fw-semibold"
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                        }}
                      >
                        អានបន្ថែម
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPost && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
            overflow: "auto",
          }}
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="modal-content bg-white border-0 rounded-4 shadow-lg overflow-hidden"
            style={{ maxWidth: "900px", width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header border-0 p-4">
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={selectedPost.organizer_avatar}
                      className="rounded-circle"
                      alt={selectedPost.organizer_name}
                      width={56}
                      height={56}
                      style={{ objectFit: "cover" }}
                    />
                    <div className="d-flex flex-column">
                      <span className="fw-bold text-dark fs-5">
                        {selectedPost.organizer_name}
                      </span>
                      <span className="text-muted small">
                        {selectedPost.created_at}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <button
                      className="btn btn-light rounded-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(selectedPost);
                      }}
                    >
                      <i className="bi bi-share"></i>
                    </button>
                    <button
                      className="btn-close"
                      onClick={() => setSelectedPost(null)}
                    ></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-body p-4 pt-0">
              {/* Image */}
              {selectedPost.image_url && (
                <div className="mb-4">
                  <img
                    src={selectedPost.image_url}
                    className="w-100 rounded-4"
                    alt={selectedPost.title}
                    style={{ maxHeight: "400px", objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Content */}
              <h3 className="fw-bold text-dark mb-2">{selectedPost.title}</h3>
              {selectedPost.title_kh && (
                <h5 className="text-muted mb-4">{selectedPost.title_kh}</h5>
              )}

              <div className="mb-4">
                <p
                  className="text-dark mb-3"
                  style={{
                    whiteSpace: "pre-wrap",
                    fontSize: "1.05rem",
                    lineHeight: "1.7",
                  }}
                >
                  {selectedPost.content}
                </p>
                {selectedPost.content_kh && (
                  <p className="text-muted" style={{ whiteSpace: "pre-wrap" }}>
                    {selectedPost.content_kh}
                  </p>
                )}
              </div>

              {/* Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {selectedPost.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="badge bg-light text-dark px-3 py-1 rounded-3"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Interactions */}
              <div className="d-flex gap-3 pt-3 border-top mb-4">
                <button
                  className="btn btn-light rounded-4 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(selectedPost.id);
                  }}
                >
                  <i
                    className={`bi ${selectedPost.liked ? "bi-heart-fill text-danger" : "bi-heart"}`}
                    style={{ fontSize: "1.2rem" }}
                  ></i>
                  <span className="fw-semibold">
                    ចូលចិត្ត ({selectedPost.likes_count})
                  </span>
                </button>
                <button
                  className="btn btn-light rounded-4 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReactionsModal({
                      ...selectedPost,
                      id: selectedPost.id,
                    });
                  }}
                >
                  <i
                    className="bi bi-people"
                    style={{ fontSize: "1.2rem" }}
                  ></i>
                  <span className="fw-semibold">នរណាបានចូលចិត្ត</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="bg-light p-4 rounded-4">
                <h6 className="mb-4 fw-bold">
                  <i className="bi bi-chat-dots me-2"></i>
                  មតិយោបល់ ({modalComments.length})
                </h6>

                {/* Local Comment Form */}
                {user ? (
                  <form onSubmit={handleCreateComment} className="mb-4">
                    <div className="d-flex gap-3">
                      <img
                        src={user.avatar_url || "/images/profile.png"}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                      />
                      <div className="flex-grow-1">
                        <textarea
                          className="form-control border-0 shadow-sm rounded-4 mb-3"
                          rows="2"
                          placeholder="សរសេរមតិយោបល់..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          required
                          style={{ resize: "none" }}
                        ></textarea>
                        <div className="text-end">
                          <button
                            type="submit"
                            className="btn btn-primary rounded-3 px-5"
                            disabled={submittingComment || !commentText.trim()}
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              border: "none",
                            }}
                          >
                            {submittingComment ? "កំពុងបញ្ជូន..." : "បញ្ជូន"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="alert alert-light text-center border mb-4 rounded-4">
                    សូម{" "}
                    <a href="/auth/login" className="alert-link fw-semibold">
                      ចូលគណនី
                    </a>{" "}
                    ដើម្បីបញ្ចេញមតិយោបល់
                  </div>
                )}

                {/* Comment List */}
                {loadingComments ? (
                  <div className="text-center py-3">
                    <div
                      className="spinner-border spinner-border-sm text-primary"
                      role="status"
                    ></div>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-4">
                    {modalComments.length === 0 ? (
                      <p className="text-muted text-center py-4">
                        មិនទាន់មានមតិយោបល់នៅឡើយទេ។
                      </p>
                    ) : (
                      modalComments.map((comment) => (
                        <div key={comment.id} className="d-flex gap-3">
                          <img
                            src={
                              comment.user?.avatar_url || "/images/profile.png"
                            }
                            alt={comment.user?.name}
                            className="rounded-circle"
                            style={{
                              width: 36,
                              height: 36,
                              objectFit: "cover",
                            }}
                          />
                          <div className="bg-white p-3 rounded-4 w-100 shadow-sm border">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="fw-semibold small text-dark">
                                {comment.user?.name || "អ្នកប្រើប្រាស់"}
                              </span>
                              <div className="d-flex align-items-center gap-2">
                                {user && user.id === comment.user_id && (
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-link btn-sm text-muted p-0"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                    >
                                      <i className="bi bi-three-dots-vertical"></i>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3">
                                      <li>
                                        <button
                                          className="dropdown-item small"
                                          onClick={() => {
                                            setEditingCommentId(comment.id);
                                            setEditCommentText(comment.content);
                                          }}
                                        >
                                          <i className="bi bi-pencil-square me-2"></i>
                                          កែសម្រួល
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item small text-danger"
                                          onClick={() =>
                                            handleDeleteComment(comment.id)
                                          }
                                        >
                                          <i className="bi bi-trash me-2"></i>
                                          លុប
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                                <small
                                  className="text-muted"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  {new Date(
                                    comment.created_at,
                                  ).toLocaleDateString("km-KH")}
                                </small>
                              </div>
                            </div>
                            {editingCommentId === comment.id ? (
                              <form
                                onSubmit={handleUpdateComment}
                                className="mt-2"
                              >
                                <textarea
                                  className="form-control form-control-sm mb-2 rounded-3"
                                  rows="2"
                                  value={editCommentText}
                                  onChange={(e) =>
                                    setEditCommentText(e.target.value)
                                  }
                                  required
                                ></textarea>
                                <div className="d-flex gap-2 justify-content-end">
                                  <button
                                    type="button"
                                    className="btn btn-light btn-sm rounded-3"
                                    onClick={() => setEditingCommentId(null)}
                                  >
                                    បោះបង់
                                  </button>
                                  <button
                                    type="submit"
                                    className="btn btn-primary btn-sm rounded-3"
                                    disabled={submittingEdit}
                                  >
                                    {submittingEdit
                                      ? "រក្សាទុក..."
                                      : "រក្សាទុក"}
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <p
                                className="mb-0 small text-dark"
                                style={{ lineHeight: "1.6" }}
                              >
                                {comment.content}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reactions Modal */}
      {showReactionsModal && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1060,
            overflow: "auto",
          }}
          onClick={() => setShowReactionsModal(null)}
        >
          <div
            className="modal-content bg-white border-0 rounded-4 shadow-lg overflow-hidden"
            style={{ maxWidth: "400px", width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header border-0 pb-0 p-4">
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold text-dark mb-0">
                    <i className="bi bi-heart-fill text-danger me-2"></i>
                    នរណាបានចូលចិត្ត
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowReactionsModal(null)}
                  ></button>
                </div>
              </div>
            </div>

            <div className="modal-body p-4">
              {showReactionsModal.liked_by &&
              showReactionsModal.liked_by.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {showReactionsModal.liked_by.map((u, i) => (
                    <div
                      key={i}
                      className="d-flex align-items-center gap-3 p-2"
                    >
                      <img
                        src={u.avatar_url || "/images/profile.png"}
                        className="rounded-circle"
                        alt={u.name}
                        width={48}
                        height={48}
                        style={{ objectFit: "cover" }}
                      />
                      <span className="fw-semibold text-dark">{u.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">
                  មិនទាន់មាននរណាចូលចិត្តទេ។
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Comment Modal */}
      <DeleteCommentModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingCommentId(null);
        }}
        commentId={deletingCommentId}
        onDeleteSuccess={confirmDeleteComment}
      />
    </main>
  );
}
