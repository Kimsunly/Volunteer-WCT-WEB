
import { api } from './api';

/**
 * List all blogs.
 * Supports published_only filter.
 */
export async function listBlogs(params = { published_only: true }) {
    const { data } = await api.get('/api/blogs', { params });
    // Returns an array of blogs
    return data;
}

/**
 * Get a specific blog by ID.
 */
export async function getBlogById(id) {
    const { data } = await api.get(`/api/blogs/${id}`);
    return data;
}

/**
 * Create a new blog (Admin only).
 */
export async function createBlog(payload) {
    const { data } = await api.post('/admin/blogs', payload);
    return data;
}

/**
 * Update an existing blog (Admin only).
 */
export async function updateBlog(id, payload) {
    const { data } = await api.put(`/admin/blogs/${id}`, payload);
    return data;
}

/**
 * Delete a blog (Admin only).
 */
export async function deleteBlog(id) {
    await api.delete(`/admin/blogs/${id}`);
}
