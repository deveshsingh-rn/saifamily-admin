'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContentStart, selectContent, selectContentLoading, selectContentError } from '../../store/features/content/contentSlice';

const ContentPage = () => {
  const dispatch = useDispatch();
  const contents = useSelector(selectContent);
  const loading = useSelector(selectContentLoading);
  const error = useSelector(selectContentError);

  useEffect(() => {
    dispatch(fetchContentStart());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Content</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {contents && (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Content</th>
              <th className="py-2 px-4 border-b">Category</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((content) => (
              <tr key={content.id}>
                <td className="py-2 px-4 border-b">{content.id}</td>
                <td className="py-2 px-4 border-b">{content.content}</td>
                <td className="py-2 px-4 border-b">{content.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContentPage;
