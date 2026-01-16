import { api } from "@/services/api";

export async function listComments({ search, limit = 20, offset = 0 } = {}) {
    const params = {};
    if (search) params.search = search;
    params.limit = limit;
    params.offset = offset;

    const { data } = await api.get("/api/admin/comments", { params });
    return data;
}

export async function hideComment(commentId) {
    if (!commentId) throw new Error("commentId is required");
    const { data } = await api.post(`/api/admin/comments/${commentId}/hide`);
    return data;
}

export async function approveComment(commentId) {
    if (!commentId) throw new Error("commentId is required");
    const { data } = await api.post(`/api/admin/comments/${commentId}/approve`);
    return data;
}
