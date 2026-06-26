'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  AdminRole,
  logout,
  selectAuthRole,
} from '../store/features/auth/authSlice';
import withAuth from '../store/withAuth';

const navItems = [
  { href: '/admin/users', label: 'Users', roles: ['super_admin'] },
  { href: '/admin/content', label: 'Content', roles: ['super_admin', 'mandir_admin'] },
  { href: '/admin/categories', label: 'Categories', roles: ['super_admin', 'mandir_admin'] },
  { href: '/admin/directory', label: 'Directory', roles: ['super_admin', 'mandir_admin'] },
  { href: '/admin/sangha', label: 'Sangha', roles: ['super_admin', 'mandir_admin'] },
] satisfies Array<{
  href: string;
  label: string;
  roles: AdminRole[];
}>;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const role = useSelector(selectAuthRole);
  const visibleNavItems = navItems.filter((item) =>
    role ? item.roles.includes(role as AdminRole) : false,
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-white border-r border-gray-200">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600">Sai Family</h1>
          <span className="ml-2 text-sm font-semibold text-gray-500">Admin</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md transition-colors duration-200 ${
                pathname.startsWith(item.href)
                  ? 'bg-indigo-100 text-indigo-700 font-semibold'
                  : 'hover:bg-gray-200'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
            <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Logout
            </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            {/* Can add user profile info here later */}
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
            {children}
        </div>
      </main>
    </div>
  );
};

export default withAuth(AdminLayout);
