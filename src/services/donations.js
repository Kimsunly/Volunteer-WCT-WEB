
import { api } from './api';

/**
 * Submit a new donation.
 */
export async function createDonation(payload) {
    const { data } = await api.post('/api/donations', payload);
    return data;
}

/**
 * Register blood donation.
 */
export async function createBloodDonation(payload) {
    const { data } = await api.post('/api/donations/blood', payload);
    return data;
}

/**
 * List all donations (Admin only).
 */
export async function listDonations(params = { limit: 50, offset: 0 }) {
    const { data } = await api.get('/admin/donations', { params });
    return data;
}
