export function setAuth({ token, refreshToken, role, remember = false }) {
    if (typeof window === "undefined") return;
    const maxAge = remember ? 2592000 : 86400; // 30 days or 1 day
    
    // Cookie options suffix
    const secureSuffix = `; path=/; max-age=${maxAge}; Secure; SameSite=Lax`;

    if (token) {
        document.cookie = `authToken=${token}${secureSuffix}`;
    }
    if (refreshToken) {
        document.cookie = `refreshToken=${refreshToken}${secureSuffix}`;
    }
    if (role) {
        // Also keep role in cookie for middleware gating
        document.cookie = `role=${role}${secureSuffix}`;
    }
}

export function clearAuth() {
    if (typeof window === "undefined") return;
    try {
        document.cookie = "authToken=; path=/; max-age=0; Secure; SameSite=Lax";
        document.cookie = "refreshToken=; path=/; max-age=0; Secure; SameSite=Lax";
        document.cookie = "role=; path=/; max-age=0; Secure; SameSite=Lax";
        
        // Clean up legacy localStorage tokens if present
        window.localStorage.removeItem("authToken");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refreshToken");
        window.localStorage.removeItem("role");
    } catch (_) { }
}
