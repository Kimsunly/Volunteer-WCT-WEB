import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Keep the canonical home URL as '/'
    if (pathname === '/homepage') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Get auth token from cookie
    const token = request.cookies.get('authToken')?.value;
    const isAuthenticated = !!token;

    // Protected routes - redirect unauthenticated users
    const protectedRoutes = ['/user', '/organizer', '/admin', '/user-profile'];
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/homepage',
        '/user/:path*',
        '/user-profile',
        '/organizer/:path*',
        '/admin/:path*',
    ],
};
