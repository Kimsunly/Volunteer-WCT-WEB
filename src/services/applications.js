import { api } from './api';

/**
 * Submit an application to a volunteer opportunity.
 * Supports both JSON and Multipart (for CV upload).
 */
export async function applyToOpportunity(payload, isMultipart = false) {
    if (isMultipart) {
        // payload should be a FormData object
        const { data } = await api.post('/api/applications/multipart', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    } else {
        const { data } = await api.post('/api/applications', payload);
        return data;
    }
}

/**
 * Upload a CV file independently.
 */
export async function uploadCV(file) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/api/applications/upload-cv', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
}

/**
 * Get applications submitted by the current user.
 */
export async function getMyApplications(params = { limit: 20, offset: 0 }) {
    const { data } = await api.get('/api/applications/my', { params });
    return data;
}

/**
 * Get details of a specific application.
 */
export async function getApplicationById(id) {
    const { data } = await api.get(`/api/applications/${id}`);
    return data;
}

/**
 * Withdraw a pending application.
 */
export async function withdrawApplication(id) {
    const { data } = await api.delete(`/api/applications/${id}`);
    return data;
}

/**
 * ORGANIZER: Get applications for a specific opportunity.
 */
export async function getApplicationsForOpportunity(opportunityId, params = { limit: 20, offset: 0 }) {
    const { data } = await api.get(`/api/applications/opportunity/${opportunityId}`, { params });
    return data;
}

/**
 * ORGANIZER: Update application status (approve/reject).
 */
export async function updateApplicationStatus(applicationId, status) {
    const { data } = await api.patch(`/api/applications/${applicationId}/status`, { status });
    return data;
}

/**
 * ORGANIZER: Get application statistics for an opportunity.
 */
export async function getApplicationStats(opportunityId) {
    const { data } = await api.get(`/api/applications/opportunity/${opportunityId}/stats`);
    return data;
}

/**
 * ORGANIZER: Get all applications across all opportunities for the current organizer.
 */
export async function getOrganizerApplications(params = { limit: 20, offset: 0 }) {
    const { data } = await api.get('/api/applications/organizer/my', { params });
    return data;
}
