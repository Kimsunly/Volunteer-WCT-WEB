import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const role = cookieStore.get("role")?.value || "user";

    return NextResponse.json({
        id: "me",
        name: role === "organizer" ? "អង្គការ" : "ស្ម័គ្រចិត្ត",
        role,
        profileImage: "/images/profile.png",
    });
}
