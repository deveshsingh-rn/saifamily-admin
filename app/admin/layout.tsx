import React from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <ul>
            <li>
              <a href="/admin/users" className="block p-2 hover:bg-gray-200 rounded">
                Users
              </a>
            </li>
            <li>
              <a href="/admin/content" className="block p-2 hover:bg-gray-200 rounded">
                Content
              </a>
            </li>
            <li>
              <a href="/admin/categories" className="block p-2 hover:bg-gray-200 rounded">
                Categories
              </a>
            </li>
            <li>
              <a href="/admin/directory" className="block p-2 hover:bg-gray-200 rounded">
                Directory
              </a>
            </li>
            <li>
              <a href="/admin/sangha" className="block p-2 hover:bg-gray-200 rounded">
                Sangha
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-1 p-8 overflow-y-auto">{children}</div>
    </div>
  );
};

export default AdminLayout;
