import { api } from './api';

/**
 * Fetch categories (public, no auth required).
 * @param {boolean} activeOnly - If true, only returns active categories
 * @returns {Promise<Array>} List of category objects: { id, name, description, icon, color, active, opportunities_count }
 */
export const listCategories = async (activeOnly = true) => {
    try {
        const { data } = await api.get('/categories', {
            params: { active_only: activeOnly },
        });
        // Handle standardized API response { success, data: [...] }
        return Array.isArray(data) ? data : (data?.data ?? []);
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

/**
 * Fetch a single category by ID (public).
 */
export const getCategoryById = async (id) => {
    const { data } = await api.get(`/categories/${id}`);
    return data?.data ?? data;
};
