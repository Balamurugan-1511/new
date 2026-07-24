'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data?.success && data?.user?.role === 'admin') {
          setAuthorized(true);
        } else {
          router.replace(`/login?redirect=${pathname}`);
        }
      })
      .catch(() => router.replace('/login'))
      .finally(() => setChecking(false));
  }, [pathname, router]);

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 font-body text-bodyText text-sm">Checking admin access…</div>;
  }

  if (!authorized) return null;

  const navLink = (href, label) => <Link href={href} className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors ${pathname === href ? 'bg-accentBlue text-white' : 'text-bodyText hover:bg-gray-100'}`}>
      {label}
    </Link>;

  return <div className="min-h-screen bg-gray-50 font-body">
      <div className="bg-navy">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-white font-heading font-bold text-lg">SkandaPlus Admin</Link>
          <Link href="/" className="text-blue-200 hover:text-white text-sm">← Back to site</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 border-b border-gray-200 bg-white">
        {navLink('/admin', 'Dashboard')}
        {navLink('/admin/courses', 'Courses')}
        {navLink('/admin/enrollments', 'Enrollments')}
        {navLink('/admin/jobs', 'Jobs')}
        {navLink('/admin/applications', 'Applications')}
        {navLink('/admin/blogs', 'Blogs')}
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>;
}
