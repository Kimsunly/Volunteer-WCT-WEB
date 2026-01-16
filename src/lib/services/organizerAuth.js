import { api } from "@/services/api";
import { parseApiError } from "@/lib/utils/apiError";

function extractToken(resp) {
    const t =
        resp?.token ||
        resp?.access_token ||
        resp?.session?.access_token ||
        resp?.session?.token ||
        resp?.data?.token ||
        resp?.data?.access_token;
    return t || null;
}

export async function organizerLogin({ email, password }) {
    const { data } = await api.post("/api/organizer/login", { email, password });
    return { data, token: extractToken(data) };
}

export async function organizerRegister(payload) {
    // Align to docs: organization_name, email, phone, password, organizer_type
    const body = {
        organization_name: payload?.organization_name || payload?.orgname,
        email: payload?.email,
        phone: payload?.phone,
        password: payload?.password,
        organizer_type: payload?.organizer_type || payload?.orgType,
    };
    try {
        const { data } = await api.post("/api/organizer/register", body);
        return data;
    } catch (err) {
        throw new Error(parseApiError(err) || "Organizer register failed");
    }
}

export async function organizerApply(payload) {
    const { data } = await api.post("/api/organizer/apply", payload);
    return data;
}

export async function uploadOrganizationCard(applicationId, formData) {
    if (!applicationId) throw new Error("applicationId is required");
    const { data } = await api.post(`/api/organizer/application/${applicationId}/upload-card`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}

export async function getMyApplication() {
    const { data } = await api.get("/api/organizer/application/my");
    return data;
}

export async function getOrganizerProfile() {
    const { data } = await api.get("/api/organizer/profile");
    return data;
}

export async function getOrganizerDashboard() {
    const { data } = await api.get("/api/organizer/dashboard");
    return data;
}
