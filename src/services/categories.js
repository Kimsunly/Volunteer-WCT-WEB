import { api } from "./api";

/**
 * Fetch all active categories
 * @returns {Promise<Array>} List of category objects
 */
export const listCategories = async () => {
    try {
        const { data } = await api.get("/api/categories");
        return data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};
