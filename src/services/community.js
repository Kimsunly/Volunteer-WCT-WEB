
import { api } from './api';

/**
 * List all approved community posts.
 */
export async function listCommunityPosts(params = { limit: 50, offset: 0 }) {
    const { data } = await api.get('/api/community', { params });
    return data;
}

/**
 * Admin: Create a community post (auto-approved).
 */
export async function createAdminCommunityPost(postData) {
    const { data } = await api.post('/admin/community', postData);
    return data;
}

/**
 * Get community posts for the current organizer (My Posts).
 */
export async function getMyPosts(params = { limit: 50, offset: 0 }) {
    const { data } = await api.get('/api/community/my', { params });
    return data;
}

/**
 * Create a new community post.
 * @param {FormData} postData 
 */
export async function createPost(postData) {
    // Note: If sending JSON, don't use FormData. 
    // If backend expects JSON:
    const { data } = await api.post('/api/community', postData);
    return data;
}

/**
 * Update a community post.
 * @param {string} id 
 * @param {object} updateData 
 */
export async function updatePost(id, updateData) {
    const { data } = await api.put(`/api/community/${id}`, updateData);
    return data;
}

/**
 * Delete a community post.
 * @param {string} id 
 */
export async function deletePost(id) {
    const { data } = await api.delete(`/api/community/${id}`);
    return data;
}

/**
 * Like a community post.
 */
export async function likeCommunityPost(postId) {
    const { data } = await api.post(`/api/community/${postId}/like`);
    return data;
}

/**
 * List community posts for moderation (Admin only).
 */
export async function listModerationPosts(params = {}) {
    // Map post_status if filter is passed
    const apiParams = { ...params };
    if (apiParams.status) {
        apiParams.post_status = apiParams.status;
        delete apiParams.status;
    }
    const { data } = await api.get('/admin/community', { params: apiParams });
    return data;
}

/**
 * Approve a community post (Admin only).
 */
export async function approveCommunityPost(postId) {
    const { data } = await api.post(`/admin/community/${postId}/approve`);
    return data;
}

/**
 * Reject a community post (Admin only).
 */
export async function rejectCommunityPost(postId, reason) {
    const { data } = await api.post(`/admin/community/${postId}/reject`, { reason });
    return data;
}

/**
 * Delete a community post (Admin only).
 */
export async function deleteCommunityPost(postId) {
    const { data } = await api.delete(`/admin/community/${postId}`);
    return data;
}
