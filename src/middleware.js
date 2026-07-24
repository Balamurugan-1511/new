import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_COOKIE = 'skandaplus_session';

// Edge middleware can't use the jsonwebtoken package (it needs Node APIs),
// so we verify the token with `jose`, which works in the Edge runtime.
async function getRole(request) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.role || null;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const role = await getRole(request);

  // Guard every /admin page — only an admin-role login can reach the panel.
  if (pathname.startsWith('/admin')) {
    if (role !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Guard write operations on the content APIs — reading course/job listings
  // stays public, but creating/editing/deleting requires an admin login.
  const isWriteMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
  const isGuardedApi = pathname.startsWith('/api/courses') || pathname.startsWith('/api/jobs');
  if (isGuardedApi && isWriteMethod && role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Admin login required.' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/courses/:path*', '/api/jobs/:path*'],
};
