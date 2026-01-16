import { api } from './api';

/**
 * DASHBOARD
 */
export async function getDashboardMetrics() {
    const { data } = await api.get('/admin/metrics');
    return data;
}

/**
 * ORGANIZERS MANAGEMENT
 */
export async function listOrganizers(params = { limit: 50, offset: 0 }) {
    const { data } = await api.get('/admin/organizers', { params });
    return data;
}

export async function approveOrganizer(id) {
    const { data } = await api.post(`/admin/organizers/${id}/approve`);
    return data;
}

export async function rejectOrganizer(id, reason) {
    const { data } = await api.post(`/admin/organizers/${id}/reject`, { reason });
    return data;
}

export async function suspendOrganizer(id, reason) {
    const { data } = await api.post(`/admin/organizers/${id}/suspend`, { reason });
    return data;
}

/**
 * CATEGORIES MANAGEMENT
 */
export async function listCategories(activeOnly = false) {
    const { data } = await api.get('/admin/categories', { params: { active_only: activeOnly } });
    return data;
}

export async function createCategory(payload) {
    const { data } = await api.post('/admin/categories', payload);
    return data;
}

export async function updateCategory(id, payload) {
    const { data } = await api.put(`/admin/categories/${id}`, payload);
    return data;
}

export async function deleteCategory(id) {
    await api.delete(`/admin/categories/${id}`);
}

/**
 * OPPORTUNITIES MANAGEMENT (ADMIN)
 */
export async function listAllOpportunities(params = {}) {
    const { data } = await api.get('/admin/opportunities', { params });
    return data;
}

export async function createOpportunityAsAdmin(payload) {
    const { data } = await api.post('/admin/opportunities', payload);
    return data;
}

export async function updateOpportunity(id, payload) {
    const { data } = await api.put(`/admin/opportunities/${id}`, payload);
    return data;
}

export async function deleteOpportunity(id) {
    await api.delete(`/admin/opportunities/${id}`);
}

/**
 * BLOGS MANAGEMENT
 */
export async function listBlogs(publishedOnly = false) {
    const { data } = await api.get('/admin/blogs', { params: { published_only: publishedOnly } });
    return data;
}

export async function createBlog(payload) {
    const { data } = await api.post('/admin/blogs', payload);
    return data;
}

export async function updateBlog(id, payload) {
    const { data } = await api.put(`/admin/blogs/${id}`, payload);
    return data;
}

export async function deleteBlog(id) {
    await api.delete(`/admin/blogs/${id}`);
}

/**
 * USERS MANAGEMENT
 */
export async function listUsers(params = {}) {
    const { data } = await api.get('/admin/users', { params });
    return data;
}

export async function changeUserRole(userId, role) {
    const { data } = await api.post(`/admin/users/${userId}/role`, { role });
    return data;
}

export async function deactivateUser(userId, reason) {
    const { data } = await api.post(`/admin/users/${userId}/deactivate`, { reason });
    return data;
}

/**
 * COMMENTS MODERATION
 */
export async function listComments(params = {}) {
    const { data } = await api.get('/admin/comments', { params });
    return data;
}

export async function approveComment(commentId) {
    const { data } = await api.post(`/admin/comments/${commentId}/approve`);
    return data;
}

export async function hideComment(commentId) {
    const { data } = await api.post(`/admin/comments/${commentId}/hide`);
    return data;
}
