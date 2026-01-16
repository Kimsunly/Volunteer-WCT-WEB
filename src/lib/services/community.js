import { api } from "@/services/api";

export async function listCommunityPosts({ search, status, limit = 20, offset = 0 } = {}) {
    const params = {};
    if (search) params.search = search;
    if (status && status !== "all") params.status = status;
    params.limit = limit;
    params.offset = offset;

    const { data } = await api.get("/api/admin/community", { params });
    return data;
}

export async function createCommunityPost(postData) {
    const { data } = await api.post("/api/admin/community", postData);
    return data;
}

export async function approveCommunityPost(postId) {
    if (!postId) throw new Error("postId is required");
    const { data } = await api.post(`/api/admin/community/${postId}/approve`);
    return data;
}

export async function rejectCommunityPost(postId, reason) {
    if (!postId) throw new Error("postId is required");
    const payload = reason ? { reason } : {};
    const { data } = await api.post(`/api/admin/community/${postId}/reject`, payload);
    return data;
}

export async function deleteCommunityPost(postId) {
    if (!postId) throw new Error("postId is required");
    const { data } = await api.delete(`/api/admin/community/${postId}`);
    return data;
}
