import { NextResponse } from "next/server";

export async function POST() {
    // Clear app-specific auth cookies
    const res = NextResponse.json({ ok: true });
    try {
        res.cookies.set("authToken", "", { path: "/", maxAge: 0 });
        res.cookies.set("role", "", { path: "/", maxAge: 0 });

        // Best-effort: also clear potential NextAuth session cookies
        res.cookies.set("next-auth.session-token", "", { path: "/", maxAge: 0 });
        res.cookies.set("__Secure-next-auth.session-token", "", {
            path: "/",
            maxAge: 0,
        });
    } catch (_) {
        // No-op: cookie helper will throw in some environments; ignore
    }
    return res;
}

export async function GET() {
    // Optional: support GET to simplify testing
    return POST();
}
