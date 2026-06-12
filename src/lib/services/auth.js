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
        // Sanctum API specific meta structure
        resp?.meta?.access_token,
        resp?.meta?.token,
        resp?.data?.meta?.access_token,
        resp?.data?.meta?.token,
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

function extractRefreshToken(resp) {
    const candidates = [
        resp?.refresh_token,
        resp?.refreshToken,
        resp?.data?.refresh_token,
        resp?.data?.refreshToken,
        resp?.meta?.refresh_token,
        resp?.data?.meta?.refresh_token,
    ];
    const t = candidates.find((v) => typeof v === "string" && v.length > 0);
    return t || null;
}

// User auth endpoints
export async function login({ email, password }) {
    const { data } = await api.post("/api/auth/login", { email, password });
    return { data, token: extractToken(data), refreshToken: extractRefreshToken(data) };
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
        // data is { success: true, data: { ...user... } }
        return data?.data || null;
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

export async function verifyOtp({ email, otp }) {
    const { data } = await api.post("/verify-otp", { email, otp });
    return data;
}

export async function resendOtp({ email }) {
    const { data } = await api.post("/resend-otp", { email });
    return data;
}

export async function forgotPassword({ email }) {
    const { data } = await api.post("/forgot-password", { email });
    return data;
}

export async function resetPassword({ email, otp, password, password_confirmation }) {
    const { data } = await api.post("/reset-password", { email, otp, password, password_confirmation });
    return data;
}

export async function socialLogin({ provider, accessToken }) {
    const { data } = await api.post("/api/auth/social-login", {
        provider,
        access_token: accessToken,
    });
    return { data, token: extractToken(data) };
}
