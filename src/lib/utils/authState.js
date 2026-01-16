export function setAuth({ token, role, remember = false }) {
    if (typeof window === "undefined") return;
    const maxAge = remember ? 2592000 : 86400; // 30 days or 1 day
    if (token) {
        window.localStorage.setItem("authToken", token);
        window.localStorage.setItem("token", token);
        document.cookie = `authToken=${token}; path=/; max-age=${maxAge}`;
    }
    if (role) {
        window.localStorage.setItem("role", role);
        document.cookie = `role=${role}; path=/; max-age=${maxAge}`;
    }
}

export function clearAuth() {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.removeItem("authToken");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("role");
        document.cookie = "authToken=; path=/; max-age=0";
        document.cookie = "role=; path=/; max-age=0";
    } catch (_) { }
}
