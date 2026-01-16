import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * Fetch all active categories
 * @returns {Promise<Array>} List of category objects
 */
export const listCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/categories/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};
