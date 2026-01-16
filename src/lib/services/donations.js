import { api } from "@/services/api";

export async function listDonations({ search, limit = 20, offset = 0 } = {}) {
    const params = {};
    if (search) params.search = search;
    params.limit = limit;
    params.offset = offset;

    const { data } = await api.get("/api/admin/donations", { params });
    return data;
}
