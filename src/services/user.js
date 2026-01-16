import { api } from './api';

export const getUserProfile = async () => {
    const response = await api.get('/api/user/profile');
    return response.data;
};

export const updateUserProfile = async (data) => {
    const response = await api.put('/api/user/profile', data);
    return response.data;
};

export const uploadUserAvatar = async (formData) => {
    const response = await api.post('/api/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteUserAvatar = async () => {
    const response = await api.delete('/api/user/avatar');
    return response.data;
};

export const getUserStats = async () => {
    const response = await api.get('/api/user/stats');
    return response.data;
};

export const getUserActivities = async () => {
    const response = await api.get('/api/applications/my');
    // The endpoint returns { data: [...], total: ... }
    return response.data.data || [];
};

export const getRecommendedActivities = async () => {
    const response = await api.get('/api/user/recommendations');
    return response.data;
};
