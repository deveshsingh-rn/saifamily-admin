'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoriesStart, selectCategories, selectCategoriesLoading, selectCategoriesError } from '../../store/features/categories/categoriesSlice';

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  useEffect(() => {
    dispatch(fetchCategoriesStart());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Categories</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {categories && (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Label</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.category}>
                <td className="py-2 px-4 border-b">{category.category}</td>
                <td className="py-2 px-4 border-b">{category.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoriesPage;
