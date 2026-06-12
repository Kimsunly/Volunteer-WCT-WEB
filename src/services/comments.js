
import api from './api';

export async function getComments(entityType, entityId, { limit = 20, offset = 0 } = {}) {
    const { data } = await api.get(`/api/comments/entity/${entityType}/${entityId}`, {
        params: { limit, offset }
    });
    return data;
}

export async function createComment(content, entityType, entityId) {
    const { data } = await api.post('/api/comments', {
        content,
        entity_type: entityType,
        entity_id: entityId
    });
    return data;
}

export async function updateComment(commentId, content) {
    const { data } = await api.put(`/api/comments/${commentId}`, { content });
    return data;
}

export async function deleteComment(commentId) {
    const { data } = await api.delete(`/api/comments/${commentId}`);
    return data;
}

export async function getMyComments({ limit = 20, offset = 0 } = {}) {
    const { data } = await api.get('/api/comments/my-comments', {
        params: { limit, offset }
    });
    return data;
}

export async function reportComment(commentId, payload) {
    const { data } = await api.post(`/api/comments/${commentId}/report`, payload);
    return data;
}

export async function getOrganizerReportedComments() {
    const { data } = await api.get('/api/organizer/comments/reported');
    return data;
}

export async function approveComment(commentId) {
    const { data } = await api.post(`/api/comments/${commentId}/approve`);
    return data;
}

export async function hideComment(commentId) {
    const { data } = await api.post(`/api/comments/${commentId}/hide`);
    return data;
}
