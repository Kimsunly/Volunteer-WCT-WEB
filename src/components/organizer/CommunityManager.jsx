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

  const handleOpenEdit = (post) => {
    setIsEditing(true);
    setCurrentPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category,
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
    <div className="card shadow-sm" data-aos="fade-up">
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
        <h5 className="mb-0 text-primary fw-bold">ប្រកាសសហគមន៍របស់ខ្ញុំ</h5>
        <button className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
          <i className="bi bi-plus-lg me-2"></i>បង្កើតប្រកាសថ្មី
        </button>
      </div>

      <div className="card-body">
        {loading && <div className="text-center py-4">កំពុងដំណើរការ...</div>}

        {!loading && posts.length === 0 && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-chat-square-text display-4 mb-3 d-block"></i>
            មិនទាន់មានប្រកាសនៅឡើយទេ។
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ចំណងជើង</th>
                <th>ប្រភេទ</th>
                <th>ស្ថានភាព</th>
                <th>កាលបរិច្ឆេទ</th>
                <th className="text-end">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="fw-bold">{post.title}</div>
                    <small
                      className="text-muted text-truncate d-block"
                      style={{ maxWidth: "250px" }}
                    >
                      {post.content}
                    </small>
                  </td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {post.category}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${post.status === "approved" ? "bg-success" : "bg-warning"}`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleOpenEdit(post)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(post)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </div>
  );
}
