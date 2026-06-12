
import { api } from './api';

/**
 * Query opportunities with server-side filters & pagination (recommended).
 * FastAPI should support: /opportunities?category=&q=&page=&pageSize=
 */
export async function listOpportunities({ q = '', category = 'all', location = 'all', page = 1, pageSize = 9, sort = 'newest' } = {}) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const params = { limit, offset, sort };

    if (q && q.length >= 2) params.q = q;
    if (category && category !== 'all') params.category = category;
    if (location && location !== 'all') params.location = location;

    const { data } = await api.get('/api/opportunities', { params });
    // Expect shape: { data: [...], total: 123, limit, offset }
    return data;
}

import { getOpportunityById as getMockOpportunityById } from '@/data/mockOpportunities';

export async function getOpportunityById(id) {
    try {
        const { data } = await api.get(`/api/opportunities/${id}`);
        return data;
    } catch (err) {
        const mockData = getMockOpportunityById(id);
        if (mockData) {
            return {
                ...mockData,
                isMock: true
            };
        }
        throw err;
    }
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
    if (payload instanceof FormData) {
        // Use POST with _method=PUT for multipart updates in Laravel
        const { data } = await api.post(`/api/opportunities/${id}`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    }
    const { data } = await api.patch(`/api/opportunities/${id}`, payload);
    return data;
}

export async function deleteOpportunity(id) {
    await api.delete(`/api/opportunities/${id}`);
}

export async function toggleFavoriteOpportunity(id) {
    const { data } = await api.post(`/api/opportunities/${id}/favorite`);
    return data;
}

export async function getFavoriteOpportunities(params = { page: 1, per_page: 9 }) {
    const { data } = await api.get('/api/opportunities/favorites', { params });
    return data;
}

export async function closeOpportunity(id) {
    const { data } = await api.post(`/api/opportunities/${id}/close`);
    return data;
}

export async function verifyOpportunityAccessKey(id, accessKey) {
    const { data } = await api.post(`/api/opportunities/${id}/verify-key`, { access_key: accessKey });
    return data;
}

