import { api } from "@/services/api";
import { parseApiError } from "@/lib/utils/apiError";

// Helpers
function extractToken(resp) {
    // Common token keys across backends
    const candidates = [
        resp?.token,
        resp?.access_token,
        resp?.accessToken,
        resp?.jwt,
        resp?.idToken,
        resp?.data?.token,
        resp?.data?.access_token,
        resp?.data?.accessToken,
        resp?.data?.jwt,
        resp?.data?.idToken,
        // nested under sessions/session
        resp?.sessions?.access_token,
        resp?.sessions?.accessToken,
        resp?.session?.access_token,
        resp?.session?.accessToken,
        resp?.data?.sessions?.access_token,
        resp?.data?.sessions?.accessToken,
        resp?.data?.session?.access_token,
        resp?.data?.session?.accessToken,
    ];
    const t = candidates.find((v) => typeof v === "string" && v.length > 0);
    return t || null;
}

// User auth endpoints
export async function login({ email, password }) {
    const { data } = await api.post("/api/auth/login", { email, password });
    return { data, token: extractToken(data) };
}

export async function register(payload) {
    // Align to backend doc: { email, password, first_name, last_name, phone }
    const body = {
        email: payload?.email,
        password: payload?.password,
        first_name: payload?.firstname,
        last_name: payload?.lastname,
        phone: payload?.phone,
    };

    // Remove undefined/empty values to avoid backend validator confusion
    Object.keys(body).forEach((k) => {
        const v = body[k];
        if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) {
            delete body[k];
        }
    });

    try {
        const { data } = await api.post("/api/auth/register", body);
        return { data, token: extractToken(data) };
    } catch (err) {
        throw new Error(parseApiError(err) || "Registration failed");
    }
}

export async function logout() {
    const { data } = await api.post("/api/auth/logout");
    return data;
}

export async function me() {
    try {
        const { data } = await api.get("/api/auth/me");
        return data;
    } catch (err) {
        // Gracefully handle unauthenticated state (401 Unauthorized or 403 Forbidden)
        if (err?.response?.status === 401 || err?.response?.status === 403) return null;
        throw err;
    }
}

export async function debugPing() {
    const { data } = await api.get("/api/auth/debug/ping");
    return data;
}

export async function debugEcho(payload) {
    const { data } = await api.post("/api/auth/debug/echo", payload);
    return data;
}
