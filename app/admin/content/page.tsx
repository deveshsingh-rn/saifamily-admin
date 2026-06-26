'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import Table, { Column } from '../../components/Table';
import {
  AdminContent,
  ContentQuery,
  deleteContentStart,
  fetchContentStart,
  selectContent,
  selectContentDeletingId,
  selectContentError,
  selectContentLimit,
  selectContentLoading,
  selectContentOffset,
  selectContentTotal,
} from '../../store/features/content/contentSlice';
import {
  fetchCategoriesStart,
  selectCategories,
} from '../../store/features/categories/categoriesSlice';
import withAuth from '../../store/withAuth';

const DEFAULT_LIMIT = 20;

function truncate(value: string, maxLength = 100): string {
  return value.length <= maxLength
    ? value
    : `${value.slice(0, maxLength).trimEnd()}…`;
}

const ContentPage = () => {
  const dispatch = useDispatch();
  const contents = useSelector(selectContent);
  const deletingId = useSelector(selectContentDeletingId);
  const loading = useSelector(selectContentLoading);
  const error = useSelector(selectContentError);
  const limit = useSelector(selectContentLimit);
  const offset = useSelector(selectContentOffset);
  const total = useSelector(selectContentTotal);
  const categories = useSelector(selectCategories);

  const [category, setCategory] = useState('');
  const [selectedContent, setSelectedContent] = useState<AdminContent | null>(null);

  const query = useMemo<ContentQuery>(() => ({
    limit: DEFAULT_LIMIT,
    offset: 0,
    ...(category ? { category } : {}),
  }), [category]);

  useEffect(() => {
    dispatch(fetchCategoriesStart());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchContentStart(query));
  }, [dispatch, query]);

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handlePageChange = (page: number) => {
    dispatch(fetchContentStart({
      ...query,
      offset: (page - 1) * DEFAULT_LIMIT,
    }));
  };

  const handleConfirmDelete = () => {
    if (!selectedContent) {
      return;
    }

    dispatch(deleteContentStart({
      contentId: selectedContent.id,
      query: {
        ...query,
        offset:
          contents.length === 1 && offset > 0
            ? Math.max(0, offset - limit)
            : offset,
      },
    }));
    setSelectedContent(null);
  };

  const columns: Column<AdminContent>[] = [
    {
      id: 'content',
      header: 'Content',
      cell: (row) => (
        <div className="max-w-xl whitespace-normal">
          <p>{truncate(row.content)}</p>
          <p className="mt-1 text-xs text-gray-500">{row.id}</p>
        </div>
      ),
    },
    {
      id: 'author',
      header: 'Author',
      cell: (row) => (
        <div className="whitespace-nowrap">
          <p className="font-medium">{row.author.name}</p>
          <p className="text-xs text-gray-500">@{row.author.handle}</p>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      accessor: 'category',
      cellClassName: 'whitespace-nowrap',
    },
    {
      id: 'engagement',
      header: 'Engagement',
      cell: (row) => (
        <span className="whitespace-nowrap text-gray-600">
          {row._count.likes} likes · {row._count.comments} comments
        </span>
      ),
    },
    {
      id: 'createdAt',
      header: 'Created',
      cell: (row) => (
        <time className="whitespace-nowrap" dateTime={row.createdAt}>
          {new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
          }).format(new Date(row.createdAt))}
        </time>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cellClassName: 'whitespace-nowrap',
      cell: (row) => (
        <button
          type="button"
          onClick={() => setSelectedContent(row)}
          disabled={deletingId === row.id}
          className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deletingId === row.id ? 'Deleting…' : 'Delete'}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Content</h1>
          <p className="mt-1 text-sm text-gray-500">{total} experiences</p>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.category} value={item.category}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <p className="mb-3 text-sm text-gray-500" role="status">
          Loading content…
        </p>
      )}

      <Table
        columns={columns}
        data={contents}
        getRowKey={(content) => content.id}
        emptyMessage="No content matches the selected category."
        caption="Admin content moderation"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <Modal
        isOpen={Boolean(selectedContent)}
        onClose={() => setSelectedContent(null)}
        onConfirm={handleConfirmDelete}
        title="Delete content"
      >
        This permanently deletes the selected experience. This action cannot be undone.
      </Modal>
    </div>
  );
};

export default withAuth(ContentPage);
