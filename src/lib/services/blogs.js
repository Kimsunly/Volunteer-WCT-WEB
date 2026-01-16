import { api } from "@/services/api";

export async function listBlogs({ search, limit = 20, offset = 0 } = {}) {
    const params = {};
    if (search) params.search = search;
    params.limit = limit;
    params.offset = offset;

    const { data } = await api.get("/api/admin/blogs", { params });
    return data;
}

export async function createBlog(blogData) {
    if (!blogData.title) throw new Error("Title is required");
    const { data } = await api.post("/api/admin/blogs", blogData);
    return data;
}

export async function updateBlog(blogId, blogData) {
    if (!blogId) throw new Error("blogId is required");
    const { data } = await api.put(`/api/admin/blogs/${blogId}`, blogData);
    return data;
}

export async function deleteBlog(blogId) {
    if (!blogId) throw new Error("blogId is required");
    const { data } = await api.delete(`/api/admin/blogs/${blogId}`);
    return data;
}
