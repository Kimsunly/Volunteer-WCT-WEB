import { api } from "@/services/api";

export async function listOpportunities({ search, status, category, limit = 20, offset = 0 } = {}) {
    const params = {};
    if (search) params.search = search;
    if (status && status !== "all") params.status = status;
    if (category && category !== "all") params.category = category;
    params.limit = limit;
    params.offset = offset;

    const { data } = await api.get("/api/admin/opportunities", { params });
    return data;
}

export async function createOpportunity(opportunityData) {
    if (!opportunityData.title) throw new Error("Title is required");
    const { data } = await api.post("/api/admin/opportunities", opportunityData);
    return data;
}

export async function updateOpportunity(opportunityId, opportunityData) {
    if (!opportunityId) throw new Error("opportunityId is required");
    const { data } = await api.put(`/api/admin/opportunities/${opportunityId}`, opportunityData);
    return data;
}

export async function deleteOpportunity(opportunityId) {
    if (!opportunityId) throw new Error("opportunityId is required");
    const { data } = await api.delete(`/api/admin/opportunities/${opportunityId}`);
    return data;
}
