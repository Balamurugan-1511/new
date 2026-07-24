import { cookies } from 'next/headers';
import { verifyToken, AUTH_COOKIE } from '@/lib/auth';

// Reads and verifies the session cookie on the server. Returns the decoded
// token payload ({ id, email, name, role }) or null if not logged in.
export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Use at the top of any API route that only admins should be able to call.
// Returns the admin user on success, or null if the caller should be
// rejected (the route should then return a 401/403 response itself).
export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') return null;
  return user;
}
