export function parseApiError(err) {
    // Handle Unauthorized (401) specifically for Khmer translation
    if (err?.response?.status === 401) {
        return "សូមប្រាកដថាអ្នកបានចូលក្នុងគណនី។";
    }

    const data = err?.response?.data;
    
    // Handle Standardized Laravel API response
    if (data && data.success === false) {
        // If there are specific validation errors
        if (data.errors) {
            const firstError = Object.values(data.errors)[0];
            if (Array.isArray(firstError)) return firstError[0];
            return String(firstError);
        }
        return data.message || "Request failed";
    }

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
