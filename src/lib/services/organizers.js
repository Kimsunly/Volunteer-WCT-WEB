import { api } from "@/services/api";

export async function listOrganizers({ search, status, limit = 20, offset = 0 } = {}) {
    const params = {};
    if (search) params.search = search;
    if (status && status !== "all") params.status = status;
    params.limit = limit;
    params.offset = offset;

    const { data } = await api.get("/api/admin/organizers", { params });
    return data;
}

export async function approveOrganizer(organizerId) {
    if (!organizerId) throw new Error("organizerId is required");
    const { data } = await api.post(`/api/admin/organizers/${organizerId}/approve`);
    return data;
}

export async function rejectOrganizer(organizerId, reason) {
    if (!organizerId) throw new Error("organizerId is required");
    if (!reason || reason.length < 10) throw new Error("Reason must be at least 10 characters");
    const { data } = await api.post(`/api/admin/organizers/${organizerId}/reject`, { reason });
    return data;
}

export async function suspendOrganizer(organizerId, reason) {
    if (!organizerId) throw new Error("organizerId is required");
    if (!reason || reason.length < 10) throw new Error("Reason must be at least 10 characters");
    const { data } = await api.post(`/api/admin/organizers/${organizerId}/suspend`, { reason });
    return data;
}
