import { api } from './api';

export const getUserProfile = async () => {
    const response = await api.get('/api/user/profile');
    return response.data?.data;
};

export const updateUserProfile = async (data) => {
    const response = await api.put('/api/user/profile', data);
    return response.data?.data;
};

export const uploadUserAvatar = async (formData) => {
    const response = await api.post('/api/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data;
};

export const deleteUserAvatar = async () => {
    const response = await api.delete('/api/user/avatar');
    return response.data?.data;
};

export const getUserStats = async () => {
    const response = await api.get('/api/user/stats');
    return response.data?.data;
};

export const getUserActivities = async () => {
    const response = await api.get('/api/user/activities');
    return response.data?.data || [];
};

export const rateApplication = async (applicationId, rating, comment = '') => {
    const response = await api.post(`/api/applications/${applicationId}/rating`, {
        rating,
        comment: comment || undefined,
    });
    return response.data?.data;
};

export const getRecommendedActivities = async () => {
    const response = await api.get('/api/user/recommendations');
    // The API response is wrapped in { success: true, data: [...] }
    return response.data?.data || [];
};
