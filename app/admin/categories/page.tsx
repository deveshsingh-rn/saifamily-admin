'use client';

import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table, { Column } from '../../components/Table';
import {
  Category,
  CATEGORY_KEYS,
  CategoryKey,
  clearCategoryError,
  createCategoryStart,
  fetchCategoriesStart,
  selectCategories,
  selectCategoriesError,
  selectCategoriesLoading,
  selectCategoriesSubmitting,
  updateCategoryStart,
} from '../../store/features/categories/categoriesSlice';
import withAuth from '../../store/withAuth';

type FormMode = 'create' | 'edit';

interface CategoryFormState {
  mode: FormMode;
  category: CategoryKey | '';
  label: string;
}

const initialFormState: CategoryFormState = {
  mode: 'create',
  category: '',
  label: '',
};

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const submitting = useSelector(selectCategoriesSubmitting);
  const error = useSelector(selectCategoriesError);

  const [form, setForm] = useState<CategoryFormState>(initialFormState);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesStart());
  }, [dispatch]);

  const availableCategoryKeys = useMemo(
    () => CATEGORY_KEYS.filter(
      (key) => !categories.some(({ category }) => category === key),
    ),
    [categories],
  );

  const resetForm = () => {
    setForm(initialFormState);
    setValidationError(null);
    dispatch(clearCategoryError());
  };

  const handleEdit = (category: Category) => {
    setForm({
      mode: 'edit',
      category: category.category as CategoryKey,
      label: category.label,
    });
    setValidationError(null);
    dispatch(clearCategoryError());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const category = form.category;
    const label = form.label.trim();

    if (!category) {
      setValidationError('Select a category key.');
      return;
    }

    if (label.length < 2 || label.length > 80) {
      setValidationError('Label must contain between 2 and 80 characters.');
      return;
    }

    setValidationError(null);

    if (form.mode === 'create') {
      dispatch(createCategoryStart({ category, label }));
      setForm(initialFormState);
      return;
    }

    dispatch(updateCategoryStart({ category, label }));
    setForm(initialFormState);
  };

  const columns: Column<Category>[] = [
    {
      id: 'category',
      header: 'Category key',
      accessor: 'category',
      cellClassName: 'whitespace-nowrap font-mono',
    },
    {
      id: 'label',
      header: 'Display label',
      accessor: 'label',
    },
    {
      id: 'actions',
      header: 'Actions',
      cellClassName: 'whitespace-nowrap',
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleEdit(row)}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage labels used to classify experience content.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {form.mode === 'create' ? 'Create category' : 'Edit category'}
          </h2>
          {form.mode === 'edit' && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Category key
            <select
              value={form.category}
              onChange={(event) => setForm((current) => ({
                ...current,
                category: event.target.value as CategoryKey | '',
              }))}
              disabled={form.mode === 'edit'}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-mono shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
            >
              <option value="">
                {availableCategoryKeys.length === 0
                  ? 'All category keys are configured'
                  : 'Select category key'}
              </option>
              {(form.mode === 'edit'
                ? [form.category]
                : availableCategoryKeys
              ).filter(Boolean).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Display label
            <input
              value={form.label}
              onChange={(event) => setForm((current) => ({
                ...current,
                label: event.target.value,
              }))}
              placeholder="Miracle Stories"
              autoComplete="off"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </label>
        </div>

        {(validationError || error) && (
          <div role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {validationError ?? error}
          </div>
        )}

        <div className="mt-4">
          <button
            type="submit"
            disabled={
              submitting ||
              (form.mode === 'create' && availableCategoryKeys.length === 0)
            }
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? 'Saving…'
              : form.mode === 'create'
                ? 'Create category'
                : 'Save changes'}
          </button>
        </div>
      </form>

      {loading && (
        <p className="mb-3 text-sm text-gray-500" role="status">
          Loading categories…
        </p>
      )}

      <Table
        columns={columns}
        data={categories}
        getRowKey={(category) => category.category}
        emptyMessage="No categories have been configured."
        caption="Experience categories"
      />
    </div>
  );
};

export default withAuth(CategoriesPage);
