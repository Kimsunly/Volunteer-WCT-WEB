import api from "./api";

/**
 * Normalizes a relative backend path to an absolute URL.
 * e.g. '/uploads/logos/file.png' → 'http://localhost:8000/uploads/logos/file.png'
 */
export function buildApiUrl(path) {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
    return base + (path.startsWith("/") ? path : "/" + path);
}

/**
 * Get current organizer's public profile
 */
export const getOrganizerProfile = async () => {
    const response = await api.get("/api/organizer/profile");
    return response.data;
};

/**
 * Get organizer dashboard stats
 */
export const getOrganizerDashboard = async () => {
    const response = await api.get("/api/organizer/dashboard");
    return response.data;
};

/**
 * Update organizer profile information
 * @param {Object} data - Profile fields to update
 */
export const updateOrganizerProfile = async (data) => {
    const response = await api.patch("/api/organizer/profile", data);
    return response.data;
};

/**
 * Upload organizer avatar image
 * @param {File} file - The image file to upload
 */
export const uploadOrganizerAvatar = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/api/organizer/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

/**
 * Submit an application to become an organizer
 * @param {FormData} formData
 */
export const applyOrganizer = async (formData) => {
    const response = await api.post("/api/organizer/apply", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

/**
 * Get current user's latest organizer application status
 */
export const getMyOrganizerApplication = async () => {
    const response = await api.get("/api/organizer/application/my");
    return response.data;
};

/**
 * Upload organizer ID card for application verification
 */
export const uploadOrganizerCard = async (appId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/api/organizer/application/${appId}/upload-card`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
