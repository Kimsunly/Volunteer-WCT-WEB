import api from "./api";

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
