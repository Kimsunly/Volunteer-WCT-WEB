import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname, origin } = request.nextUrl;

    // Keep the canonical home URL as '/'
    if (pathname === '/homepage') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Get auth token and role from cookies
    const token = request.cookies.get('authToken')?.value;
    const role = request.cookies.get('role')?.value || 'user';
    const isAuthenticated = !!token;

    // Auth protection
    const protectedRoutes = ['/user', '/organizer', '/admin', '/user-profile'];
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Role-based gating
    if (pathname.startsWith('/admin')) {
        if (role !== 'admin') {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    if (pathname.startsWith('/organizer') && role !== 'organizer') {
        return NextResponse.redirect(new URL('/auth/org/login', request.url));
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