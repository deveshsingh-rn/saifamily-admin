'use client';

import React from 'react';
import Link from 'next/link';

const DirectoryPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Directory</h1>
      <p>Here you can manage the directory features.</p>
      <ul className="mt-4">
        <li>
          <Link href="/admin/directory/reviews">
            <span className="text-blue-500 hover:underline">Reviews</span>
          </Link>
        </li>
        <li>
          <Link href="/admin/directory/analytics">
            <span className="text-blue-500 hover:underline">Analytics</span>
          </Link>
        </li>
        <li>
          <Link href="/admin/directory/audit-logs">
            <span className="text-blue-500 hover:underline">Audit Logs</span>
          </Link>
        </li>
        <li>
          <Link href="/admin/directory/categories">
            <span className="text-blue-500 hover:underline">Categories</span>
          </Link>
        </li>
        <li>
          <Link href="/admin/directory/reports">
            <span className="text-blue-500 hover:underline">Reports</span>
          </Link>
        </li>
        <li>
          <Link href="/admin/directory/listings">
            <span className="text-blue-500 hover:underline">Listings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DirectoryPage;
