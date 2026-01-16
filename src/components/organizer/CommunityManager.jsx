import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createPost, updatePost, deletePost, getMyPosts, listCommunityPosts } from '@/services/community';

export default function CommunityManager({ initialPosts = [] }) {
    const [posts, setPosts] = useState(initialPosts);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'discussion',
        images: [] // Currently just URL strings
    });

    const categories = [
        { value: 'discussion', label: 'ការពិភាក្សា (Discussion)' },
        { value: 'event', label: 'ព្រឹត្តិការណ៍ (Event)' },
        { value: 'story', label: 'រឿងរ៉ាវ (Story)' },
        { value: 'update', label: 'បច្ចុប្បន្នភាព (Update)' }
    ];

    // Fetch posts on mount
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // Fetch all community posts instead of just my posts
            const data = await listCommunityPosts();
            setPosts(data);
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
        setFormData({ title: '', content: '', category: 'discussion', images: [] });
        setShowModal(true);
    };

    const handleOpenEdit = (post) => {
        setIsEditing(true);
        setCurrentPost(post);
        setFormData({
            title: post.title,
            content: post.content,
            category: post.category,
            images: post.images || []
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("តើអ្នកប្រាកដជាចង់លុបប្រកាសនេះទេ?")) return;
        try {
            await deletePost(id);
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert("បរាជ័យក្នុងការលុប");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await updatePost(currentPost.id, formData);
                alert("កែប្រែជោគជ័យ");
            } else {
                await createPost(formData);
                alert("បង្កើតជោគជ័យ");
            }
            setShowModal(false);
            fetchPosts();
        } catch (err) {
            console.error(err);
            alert("មានបញ្ហាក្នុងការរក្សាទុក");
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
                            {posts.map(post => (
                                <tr key={post.id}>
                                    <td>
                                        <div className="fw-bold">{post.title}</div>
                                        <small className="text-muted text-truncate d-block" style={{ maxWidth: '250px' }}>
                                            {post.content}
                                        </small>
                                    </td>
                                    <td>
                                        <span className="badge bg-info text-dark">{post.category}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${post.status === 'approved' ? 'bg-success' : 'bg-warning'}`}>
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
                                            onClick={() => handleDelete(post.id)}
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

            {/* Modal - Simple implementation using Bootstrap classes overlay */}
            {showModal && (
                <>
                    <div
                        className="modal-backdrop fade show"
                        onClick={() => setShowModal(false)}
                    ></div>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{isEditing ? 'កែប្រែប្រកាស' : 'បង្កើតប្រកាសថ្មី'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">ចំណងជើង <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                required
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">ប្រភេទ</label>
                                            <select
                                                className="form-select"
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                {categories.map(c => (
                                                    <option key={c.value} value={c.value}>{c.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">ខ្លឹមសារ <span className="text-danger">*</span></label>
                                            <textarea
                                                className="form-control"
                                                rows="5"
                                                required
                                                value={formData.content}
                                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>បោះបង់</button>
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            {loading ? 'កំពុងរក្សាទុក...' : (isEditing ? 'កែប្រែ' : 'បង្កើត')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
