import { api } from "@/services/api";

export async function listCategories({ search, limit = 50, offset = 0 } = {}) {
    const params = {};
    if (search) params.search = search;
    params.limit = limit;
    params.offset = offset;

    const { data } = await api.get("/api/admin/categories", { params });
    return data;
}

export async function createCategory(categoryData) {
    if (!categoryData.name) throw new Error("Category name is required");
    const { data } = await api.post("/api/admin/categories", categoryData);
    return data;
}

export async function updateCategory(categoryId, categoryData) {
    if (!categoryId) throw new Error("categoryId is required");
    const { data } = await api.put(`/api/admin/categories/${categoryId}`, categoryData);
    return data;
}

export async function deleteCategory(categoryId) {
    if (!categoryId) throw new Error("categoryId is required");
    const { data } = await api.delete(`/api/admin/categories/${categoryId}`);
    return data;
}
