
import { api } from './api';

/**
 * Submit a contact message.
 */
export async function submitContactMessage(payload) {
    const { data } = await api.post('/api/contact/', payload);
    return data;
}

/**
 * List contact messages (Admin only).
 */
export async function listContactMessages(params = { limit: 50, offset: 0 }) {
    const { data } = await api.get('/admin/contact-messages', { params });
    return data;
}
