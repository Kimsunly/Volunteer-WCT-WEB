
import { api } from './api';

/**
 * Query opportunities with server-side filters & pagination (recommended).
 * FastAPI should support: /opportunities?category=&q=&page=&pageSize=
 */
export async function listOpportunities({ q = '', category = 'all', page = 1, pageSize = 9, sort = 'newest' } = {}) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const params = { limit, offset, sort };

    if (q && q.length >= 2) params.q = q;
    if (category && category !== 'all') params.category = category;

    const { data } = await api.get('/api/opportunities', { params });
    // Expect shape: { data: [...], total: 123, limit, offset }
    return data;
}

export async function getOpportunityById(id) {
    const { data } = await api.get(`/api/opportunities/${id}`);
    return data;
}

export async function getMyOpportunities(params = { limit: 50, offset: 0 }) {
    const { data } = await api.get('/api/opportunities/my-opportunities', { params });
    return data;
}

export async function createOpportunity(formData) {
    // formData should be an instance of FormData for multipart/form-data
    const { data } = await api.post('/api/opportunities', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
}

export async function updateOpportunity(id, payload) {
    const { data } = await api.patch(`/api/opportunities/${id}`, payload);
    return data;
}

export async function deleteOpportunity(id) {
    await api.delete(`/api/opportunities/${id}`);
}

