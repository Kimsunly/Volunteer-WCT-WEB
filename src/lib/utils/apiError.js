export function parseApiError(err) {
    const data = err?.response?.data;
    const detail = data?.detail;

    if (typeof detail === "string") {
        return detail;
    }

    if (Array.isArray(detail) && detail.length) {
        const missing = detail
            .filter((d) => (d?.msg || "").toLowerCase().includes("field required"))
            .map((d) => {
                const loc = d?.loc;
                if (Array.isArray(loc) && loc.length) return loc[loc.length - 1];
                return null;
            })
            .filter(Boolean);
        if (missing.length) {
            return `Missing fields: ${missing.join(", ")}`;
        }
        const msgs = detail.map((d) => d?.msg || JSON.stringify(d)).join("; ");
        return msgs;
    }

    const msg = data?.message || data?.error || err?.message;
    return msg || "Request failed";
}
