
import { api } from './api';

/**
 * Query opportunities with server-side filters & pagination (recommended).
 * FastAPI should support: /opportunities?category=&q=&page=&pageSize=
 */
export async function listOpportunities({ q = '', category = 'all', page = 1, pageSize = 9, sort = 'newest' } = {}) {
    const params = { q, page, pageSize, sort };
    if (category && category !== 'all') params.category = category;
    const { data } = await api.get('/opportunities', { params });
    // Expect shape: { items: [...], total: 123, page, pageSize }
    return data;
}

export async function getOpportunityById(id) {
    const { data } = await api.get(`/opportunities/${id}`);
    return data;
}

