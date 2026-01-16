import { api } from "@/services/api";

export async function listUsers({ search, status, role, limit = 20, offset = 0 } = {}) {
    const params = {};
    if (search) params.search = search;
    if (status && status !== "all") params.status = status;
    if (role && role !== "all") params.role = role;
    params.limit = limit;
    params.offset = offset;

    const { data } = await api.get("/api/admin/users", { params });
    return data;
}

export async function updateRole(id, role) {
    if (!id || !role) throw new Error("id and role are required");
    const { data } = await api.post(`/api/admin/users/${id}/role`, { role });
    return data;
}

export async function deactivateUser(id, reason) {
    if (!id) throw new Error("id is required");
    const payload = {};
    if (reason) payload.reason = reason;
    const { data } = await api.post(`/api/admin/users/${id}/deactivate`, payload);
    return data;
}
