"use client";

import React, { useEffect, useState, useMemo } from "react";
import { listCommunityPosts, likeCommunityPost } from "@/services/community";
import { getComments, createComment } from "@/services/comments";
import { useAuth } from "@/context/AuthContext";
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

  const fetchCommentsForPost = async (postId) => {
    try {
      setLoadingComments(true);
      const data = await getComments("community_post", postId, { limit: 50 });
      setModalComments(data.comments || []);
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

    try {
      setSubmittingComment(true);
      const newComment = await createComment(commentText, "community_post", selectedPost.id);
      setModalComments([newComment, ...modalComments]);
      setCommentText("");
      // Update global post comment count
      setPosts(prev => prev.map(p =>
        p.id === selectedPost.id ? { ...p, comments: (p.comments || 0) + 1 } : p
      ));
      // Update selected post comment count
      setSelectedPost(prev => ({ ...prev, comments: (prev.comments || 0) + 1 }));

      toast.success("បានបញ្ជូនមតិយោបល់!");
    } catch (err) {
      console.error("Comment error:", err);
      toast.error("បរាជ័យក្នុងការបញ្ជូនមតិយោបល់");
    } finally {
      setSubmittingComment(false);
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
  const [isFetching, setIsFetching] = useState(false);

  // ... (existing states)

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (isFirstLoad) {
          setLoading(true);
        } else {
          setIsFetching(true);
        }

        const data = await listCommunityPosts({ category: filter === "all" ? null : filter });

        // Map backend posts to UI
        const mapped = (data || []).map(p => ({
          id: p.id,
          organizerName: p.organizer_name || "Volunteer WCT",
          createdAt: new Date(p.created_at).toLocaleDateString('km-KH', { day: '2-digit', month: 'long', year: 'numeric' }),
          category: p.category,
          title: p.title,
          titleKh: p.title_kh || "",
          content: p.content,
          contentKh: p.content_kh || "",
          tags: p.tags || [],
          likes: p.likes || 0,
          comments: p.comments || 0, // Should be count from backend
          images: p.images || []
        }));

        setPosts(mapped);
      } catch (err) {
        console.error("Error fetching community posts:", err);
        setError("បរាជ័យក្នុងការទាញយកការប្រកាស");
      } finally {
        setLoading(false);
        setIsFirstLoad(false);
        setIsFetching(false);
      }
    }
    fetchPosts();
  }, [filter]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        searchTerm === "" ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.titleKh.includes(searchTerm) ||
        p.organizerName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [posts, searchTerm]);

  const handleLike = async (postId) => {
    try {
      const updated = await likeCommunityPost(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: updated.likes } : p));
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => ({ ...prev, likes: updated.likes }));
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  if (loading && isFirstLoad) return (
    <div className="container py-5 text-center" style={{ marginTop: 130 }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <main className="flex-grow-1" style={{ marginTop: 130 }}>
      <div className="container py-4">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-3">សហគមន៍ស្ម័គ្រចិត្ត</h1>
          <p className="lead text-muted">
            ភ្ជាប់ទំនាក់ទំនងជាមួយសហគមន៍ស្ម័គ្រចិត្ត និងចែករំលែកបទពិសោធន៍
          </p>
        </div>

        {/* Filter & Search */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">ប្រភេទ</label>
                <select
                  className="form-select"
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
                <label className="form-label">ស្វែងរក</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ស្វែងរកប្រកាស..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div style={{ opacity: isFetching ? 0.6 : 1, transition: "opacity 0.2s" }}>
          {filtered.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted"></i>
              <p className="text-muted mt-3">មិនមានប្រកាស</p>
            </div>
          ) : (
            <div className="row g-4">
              {filtered.map((post) => (
                <div key={post.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm hover-lift">
                    <div className="card-body">
                      {/* Header */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                            style={{ width: 40, height: 40 }}
                          >
                            <i className="bi bi-building text-white"></i>
                          </div>
                          <div>
                            <div className="fw-semibold small">
                              {post.organizerName}
                            </div>
                            <div className="text-muted" style={{ fontSize: 12 }}>
                              {post.createdAt}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`badge ${post.category === "update"
                            ? "bg-info"
                            : post.category === "event"
                              ? "bg-success"
                              : post.category === "discussion"
                                ? "bg-warning"
                                : "bg-primary"
                            }`}
                        >
                          {post.category}
                        </span>
                      </div>

                      {/* Content */}
                      <h5 className="card-title mb-2">{post.title}</h5>
                      <h6 className="card-subtitle text-muted mb-3">
                        {post.titleKh}
                      </h6>
                      <p className="card-text">
                        {post.content.substring(0, 120)}
                        {post.content.length > 120 && "..."}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mb-3">
                          {post.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="badge bg-light text-dark me-1"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <div className="d-flex gap-3">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleLike(post.id)}
                          >
                            <i className="bi bi-heart me-1"></i>
                            {post.likes}
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedPost(post)}>
                            <i className="bi bi-chat me-1"></i>
                            {post.comments}
                          </button>
                        </div>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedPost(post)}
                        >
                          អានបន្ថែម
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPost && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="modal-title mb-1">{selectedPost.title}</h5>
                      <p className="text-muted mb-0 small">
                        {selectedPost.titleKh}
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-info btn-sm"
                        onClick={() => handleShare(selectedPost)}
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
              <div className="modal-body">
                {/* Author Info */}
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                  <div
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                    style={{ width: 50, height: 50 }}
                  >
                    <i className="bi bi-building text-white fs-5"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">
                      {selectedPost.organizerName}
                    </div>
                    <div className="text-muted small">
                      {selectedPost.createdAt}
                    </div>
                  </div>
                  <span
                    className={`badge ${selectedPost.category === "update"
                      ? "bg-info"
                      : selectedPost.category === "event"
                        ? "bg-success"
                        : selectedPost.category === "discussion"
                          ? "bg-warning"
                          : "bg-primary"
                      }`}
                  >
                    {selectedPost.category}
                  </span>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>{selectedPost.content}</p>
                  <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{selectedPost.contentKh}</p>
                </div>

                {/* Tags */}
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="mb-4">
                    {selectedPost.tags.map((tag, i) => (
                      <span key={i} className="badge bg-light text-dark me-2">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Interactions */}
                <div className="d-flex gap-2 pt-3 border-top mb-4">
                  <button
                    className="btn btn-outline-primary flex-grow-1"
                    onClick={() => handleLike(selectedPost.id)}
                  >
                    <i className="bi bi-heart me-2"></i>
                    ចូលចិត្ត ({selectedPost.likes})
                  </button>
                  <button className="btn btn-outline-secondary flex-grow-1">
                    <i className="bi bi-chat me-2"></i>
                    មតិយោបល់ ({selectedPost.comments})
                  </button>
                  <button className="btn btn-outline-info" onClick={() => handleShare(selectedPost)}>
                    <i className="bi bi-share"></i> ចែករំលែក
                  </button>
                </div>

                {/* Comments Section */}
                <div className="bg-light p-3 rounded">
                  <h6 className="mb-3"><i className="bi bi-chat-dots me-2"></i>មតិយោបល់ ({modalComments.length})</h6>

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
                            className="form-control mb-2"
                            rows="2"
                            placeholder="សរសេរមតិយោបល់..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            required
                          ></textarea>
                          <div className="text-end">
                            <button
                              type="submit"
                              className="btn btn-primary btn-sm"
                              disabled={submittingComment || !commentText.trim()}
                            >
                              {submittingComment ? "កំពុងបញ្ជូន..." : "បញ្ជូន"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="alert alert-light text-center mb-4 border">
                      សូម <a href="/auth/login" className="alert-link">ចូលគណនី</a> ដើម្បីបញ្ចេញមតិយោបល់
                    </div>
                  )}

                  {/* Comment List */}
                  {loadingComments ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {modalComments.length === 0 ? (
                        <p className="text-muted text-center small my-3">មិនទាន់មានមតិយោបល់នៅឡើយទេ។</p>
                      ) : (
                        modalComments.map((comment) => (
                          <div key={comment.id} className="d-flex gap-3">
                            <img
                              src={comment.user_avatar || "/images/profile.png"}
                              alt={comment.user_name}
                              className="rounded-circle"
                              style={{ width: 32, height: 32, objectFit: "cover" }}
                            />
                            <div className="bg-white p-2 rounded w-100 border">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="fw-bold small">{comment.user_name}</span>
                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                  {new Date(comment.created_at).toLocaleDateString('km-KH')}
                                </small>
                              </div>
                              <p className="mb-0 small text-break">{comment.content}</p>
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
        </div>
      )}

      <style jsx>{`
        .hover-lift {
          transition: transform 0.2s;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </main>
  );
}
