
import api from './api';

export async function getComments(entityType, entityId, { limit = 20, offset = 0 } = {}) {
    const { data } = await api.get(`/comments/entity/${entityType}/${entityId}`, {
        params: { limit, offset }
    });
    return data;
}

export async function createComment(content, entityType, entityId) {
    const { data } = await api.post('/comments/', {
        content,
        entity_type: entityType,
        entity_id: entityId
    });
    return data;
}

export async function updateComment(commentId, content) {
    const { data } = await api.put(`/comments/${commentId}`, { content });
    return data;
}

export async function deleteComment(commentId) {
    const { data } = await api.delete(`/comments/${commentId}`);
    return data;
}

export async function getMyComments({ limit = 20, offset = 0 } = {}) {
    const { data } = await api.get('/comments/my-comments', {
        params: { limit, offset }
    });
    return data;
}
