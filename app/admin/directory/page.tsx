'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table, { Column } from '../../components/Table';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { useDebounce } from '../../hooks/useDebounce';
import withAuth from '../../store/withAuth';
import {
  DIRECTORY_LISTING_STATUSES,
  DIRECTORY_REPORT_STATUSES,
  DIRECTORY_REVIEW_STATUSES,
  DirectoryListQuery,
  approveDirectoryListingStart,
  approveDirectoryReviewStart,
  fetchDirectoryAnalyticsStart,
  fetchDirectoryAuditLogsStart,
  fetchDirectoryListingsStart,
  fetchDirectoryReportsStart,
  fetchDirectoryReviewsStart,
  hideDirectoryReviewStart,
  rejectDirectoryListingStart,
  rejectDirectoryReviewStart,
  resolveDirectoryReportStart,
  restoreDirectoryListingStart,
  restoreDirectoryReviewStart,
  selectDirectoryAnalytics,
  selectDirectoryAuditLogs,
  selectDirectoryListings,
  selectDirectoryMutationError,
  selectDirectoryReports,
  selectDirectoryReviews,
  selectDirectorySubmittingAction,
  suspendDirectoryListingStart,
  unverifyDirectoryListingStart,
  verifyDirectoryListingStart,
} from '../../store/features/directory/directorySlice';
import {
  DirectoryAuditLog,
  DirectoryListing,
  DirectoryReport,
  DirectoryReview,
  OffsetPagination,
} from '../../types/adminApi';

type DirectoryTab = 'reviews' | 'reports' | 'listings' | 'analytics' | 'auditLogs';
type StatusFilter = 'all' | string;
type DirectoryListActionCreator = (query: DirectoryListQuery) => {
  type: string;
  payload: DirectoryListQuery;
};

interface ConfirmState {
  isOpen: boolean;
  title: string;
  body: string;
  onConfirm: () => void;
}

const PAGE_SIZE = 10;

const tabs: Array<{ id: DirectoryTab; label: string }> = [
  { id: 'reviews', label: 'Reviews' },
  { id: 'reports', label: 'Reports' },
  { id: 'listings', label: 'Listings' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'auditLogs', label: 'Audit Logs' },
];

const formatLabel = (value: string) => value.replaceAll('_', ' ');

const formatDate = (value: string | null | undefined) =>
  value ? new Date(value).toLocaleString() : '—';

const getCurrentPage = (pagination: OffsetPagination) =>
  Math.floor(pagination.offset / pagination.limit) + 1;

const getTotalPages = (pagination: OffsetPagination) =>
  Math.max(1, Math.ceil(pagination.total / pagination.limit));

const DirectoryPage = () => {
  const dispatch = useDispatch();
  const reviews = useSelector(selectDirectoryReviews);
  const reports = useSelector(selectDirectoryReports);
  const listings = useSelector(selectDirectoryListings);
  const analytics = useSelector(selectDirectoryAnalytics);
  const auditLogs = useSelector(selectDirectoryAuditLogs);
  const submittingAction = useSelector(selectDirectorySubmittingAction);
  const mutationError = useSelector(selectDirectoryMutationError);

  const [activeTab, setActiveTab] = useState<DirectoryTab>('reviews');
  const [reviewStatus, setReviewStatus] = useState<StatusFilter>('pending');
  const [reportStatus, setReportStatus] = useState<StatusFilter>('pending');
  const [listingStatus, setListingStatus] = useState<StatusFilter>('pending_review');
  const [search, setSearch] = useState('');
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    body: '',
    onConfirm: () => undefined,
  });

  const debouncedSearch = useDebounce(search, 500);

  const buildQuery = useCallback((
    offset: number,
    status: StatusFilter,
  ): DirectoryListQuery => ({
      limit: PAGE_SIZE,
      offset,
      ...(status !== 'all' ? { status } : {}),
      ...(debouncedSearch ? { q: debouncedSearch } : {}),
    }), [debouncedSearch]);

  useEffect(() => {
    dispatch(fetchDirectoryAnalyticsStart());
    dispatch(fetchDirectoryAuditLogsStart({ limit: 50, offset: 0 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDirectoryReviewsStart(buildQuery(0, reviewStatus)));
  }, [buildQuery, dispatch, reviewStatus]);

  useEffect(() => {
    dispatch(fetchDirectoryReportsStart(buildQuery(0, reportStatus)));
  }, [buildQuery, dispatch, reportStatus]);

  useEffect(() => {
    dispatch(fetchDirectoryListingsStart(buildQuery(0, listingStatus)));
  }, [buildQuery, dispatch, listingStatus]);

  const closeConfirm = () => {
    setConfirmState((current) => ({ ...current, isOpen: false }));
  };

  const openConfirm = (title: string, body: string, onConfirm: () => void) => {
    setConfirmState({ isOpen: true, title, body, onConfirm });
  };

  const confirmAndDispatch = (
    title: string,
    body: string,
    onConfirm: () => void,
  ) => {
    openConfirm(title, body, () => {
      onConfirm();
      closeConfirm();
    });
  };

  const reviewColumns: Column<DirectoryReview>[] = [
    { id: 'listing', header: 'Listing', cell: (row) => row.listing.businessName },
    {
      id: 'reviewer',
      header: 'Reviewer',
      cell: (row) => row.reviewer.name || row.reviewer.handle || row.reviewer.id,
    },
    { id: 'rating', header: 'Rating', accessor: 'rating', cellClassName: 'whitespace-nowrap' },
    {
      id: 'content',
      header: 'Review',
      cell: (row) => row.content || '—',
    },
    {
      id: 'status',
      header: 'Status',
      cellClassName: 'whitespace-nowrap capitalize',
      cell: (row) => formatLabel(row.status),
    },
    {
      id: 'created',
      header: 'Created',
      cellClassName: 'whitespace-nowrap',
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: 'actions',
      header: 'Actions',
      cellClassName: 'whitespace-nowrap',
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          {(['approve', 'reject', 'hide', 'restore'] as const).map((action) => {
            const actionKey = `review:${row.id}:${action}`;
            const actionMap = {
              approve: approveDirectoryReviewStart,
              reject: rejectDirectoryReviewStart,
              hide: hideDirectoryReviewStart,
              restore: restoreDirectoryReviewStart,
            };

            return (
              <button
                key={action}
                type="button"
                disabled={submittingAction === actionKey}
                onClick={() => confirmAndDispatch(
                  `${formatLabel(action)} review`,
                  `Are you sure you want to ${action} this review for "${row.listing.businessName}"?`,
                  () => dispatch(actionMap[action]({
                    id: row.id,
                    note: `${formatLabel(action)} from admin panel.`,
                  })),
                )}
                className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium capitalize text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {submittingAction === actionKey ? 'Saving...' : action}
              </button>
            );
          })}
        </div>
      ),
    },
  ];

  const reportColumns: Column<DirectoryReport>[] = [
    { id: 'listing', header: 'Listing', cell: (row) => row.listing.businessName },
    {
      id: 'reporter',
      header: 'Reporter',
      cell: (row) => row.reporter.name || row.reporter.handle || row.reporter.id,
    },
    { id: 'reason', header: 'Reason', accessor: 'reason', cellClassName: 'capitalize' },
    { id: 'details', header: 'Details', cell: (row) => row.details || '—' },
    {
      id: 'status',
      header: 'Status',
      cellClassName: 'whitespace-nowrap capitalize',
      cell: (row) => formatLabel(row.status),
    },
    {
      id: 'actions',
      header: 'Actions',
      cellClassName: 'whitespace-nowrap',
      cell: (row) => (
        <div className="flex gap-2">
          {(['resolved', 'dismissed'] as const).map((status) => {
            const actionKey = `report:${row.id}:resolve`;

            return (
              <button
                key={status}
                type="button"
                disabled={submittingAction === actionKey}
                onClick={() => confirmAndDispatch(
                  `Mark report ${status}`,
                  `Are you sure you want to mark this report as ${status}?`,
                  () => dispatch(resolveDirectoryReportStart({
                    id: row.id,
                    status,
                    note: `Marked ${status} from admin panel.`,
                  })),
                )}
                className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium capitalize text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {submittingAction === actionKey ? 'Saving...' : status}
              </button>
            );
          })}
        </div>
      ),
    },
  ];

  const listingColumns: Column<DirectoryListing>[] = [
    { id: 'businessName', header: 'Business', accessor: 'businessName' },
    { id: 'category', header: 'Category', cell: (row) => row.category.name },
    { id: 'city', header: 'City', cell: (row) => row.city || '—' },
    {
      id: 'owner',
      header: 'Owner',
      cell: (row) => row.owner.name || row.owner.handle || row.owner.id,
    },
    {
      id: 'status',
      header: 'Status',
      cellClassName: 'whitespace-nowrap capitalize',
      cell: (row) => formatLabel(row.status),
    },
    {
      id: 'verified',
      header: 'Verification',
      cellClassName: 'whitespace-nowrap capitalize',
      cell: (row) => formatLabel(row.verificationStatus),
    },
    {
      id: 'actions',
      header: 'Actions',
      cellClassName: 'whitespace-nowrap',
      cell: (row) => {
        const actions = [
          { label: 'approve', creator: approveDirectoryListingStart },
          { label: 'reject', creator: rejectDirectoryListingStart, reason: 'Incomplete business details' },
          { label: 'suspend', creator: suspendDirectoryListingStart, reason: 'Policy issue under review' },
          { label: 'restore', creator: restoreDirectoryListingStart },
          { label: 'verify', creator: verifyDirectoryListingStart, verificationStatus: 'verified' as const },
          { label: 'unverify', creator: unverifyDirectoryListingStart },
        ];

        return (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => {
              const actionKey = `listing:${row.id}:${action.label}`;

              return (
                <button
                  key={action.label}
                  type="button"
                  disabled={submittingAction === actionKey}
                  onClick={() => confirmAndDispatch(
                    `${formatLabel(action.label)} listing`,
                    `Are you sure you want to ${action.label} "${row.businessName}"?`,
                    () => dispatch(action.creator({
                      id: row.id,
                      reason: action.reason,
                      verificationStatus: action.verificationStatus,
                      note: `${formatLabel(action.label)} from admin panel.`,
                    })),
                  )}
                  className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium capitalize text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {submittingAction === actionKey ? 'Saving...' : action.label}
                </button>
              );
            })}
          </div>
        );
      },
    },
  ];

  const auditLogColumns: Column<DirectoryAuditLog>[] = [
    { id: 'action', header: 'Action', accessor: 'action' },
    { id: 'entity', header: 'Entity', accessor: 'entity' },
    { id: 'entityId', header: 'Entity ID', accessor: 'entityId', cellClassName: 'whitespace-nowrap' },
    {
      id: 'actor',
      header: 'Actor',
      cell: (row) => row.actor?.name || row.actor?.handle || row.actorId || 'System',
    },
    {
      id: 'created',
      header: 'Created',
      cellClassName: 'whitespace-nowrap',
      cell: (row) => formatDate(row.createdAt),
    },
  ];

  const handlePageChange = (
    page: number,
    status: StatusFilter,
    action: DirectoryListActionCreator,
  ) => {
    dispatch(action(buildQuery((page - 1) * PAGE_SIZE, status)));
  };

  const renderResourceStatus = (
    loading: boolean,
    error: string | null,
    count: number,
    total: number,
  ) => (
    <div className="mb-3 min-h-6">
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && (
        <p className="text-sm text-gray-500">
          Showing {count} of {total} records.
        </p>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Directory Admin</h1>
        <p className="mt-2 text-sm text-gray-500">
          Review moderation, listing moderation, reports, analytics, and audit logs.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mutationError && (
        <div role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {mutationError}
        </div>
      )}

      {activeTab !== 'analytics' && activeTab !== 'auditLogs' && (
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="text"
            placeholder="Search directory records..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 md:w-96"
          />
        </div>
      )}

      {activeTab === 'reviews' && (
        <section>
          <div className="mb-3">
            <select
              value={reviewStatus}
              onChange={(event) => setReviewStatus(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 shadow-sm"
            >
              <option value="all">All statuses</option>
              {DIRECTORY_REVIEW_STATUSES.map((status) => (
                <option key={status} value={status}>{formatLabel(status)}</option>
              ))}
            </select>
          </div>
          {renderResourceStatus(
            reviews.loading,
            reviews.error,
            reviews.items.length,
            reviews.pagination.total,
          )}
          <Table
            columns={reviewColumns}
            data={reviews.items}
            getRowKey={(review) => review.id}
            emptyMessage="No directory reviews found."
            caption="Directory reviews"
          />
          <Pagination
            currentPage={getCurrentPage(reviews.pagination)}
            totalPages={getTotalPages(reviews.pagination)}
            onPageChange={(page) => handlePageChange(page, reviewStatus, fetchDirectoryReviewsStart)}
          />
        </section>
      )}

      {activeTab === 'reports' && (
        <section>
          <div className="mb-3">
            <select
              value={reportStatus}
              onChange={(event) => setReportStatus(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 shadow-sm"
            >
              <option value="all">All statuses</option>
              {DIRECTORY_REPORT_STATUSES.map((status) => (
                <option key={status} value={status}>{formatLabel(status)}</option>
              ))}
            </select>
          </div>
          {renderResourceStatus(
            reports.loading,
            reports.error,
            reports.items.length,
            reports.pagination.total,
          )}
          <Table
            columns={reportColumns}
            data={reports.items}
            getRowKey={(report) => report.id}
            emptyMessage="No directory reports found."
            caption="Directory reports"
          />
          <Pagination
            currentPage={getCurrentPage(reports.pagination)}
            totalPages={getTotalPages(reports.pagination)}
            onPageChange={(page) => handlePageChange(page, reportStatus, fetchDirectoryReportsStart)}
          />
        </section>
      )}

      {activeTab === 'listings' && (
        <section>
          <div className="mb-3">
            <select
              value={listingStatus}
              onChange={(event) => setListingStatus(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 shadow-sm"
            >
              <option value="all">All statuses</option>
              {DIRECTORY_LISTING_STATUSES.map((status) => (
                <option key={status} value={status}>{formatLabel(status)}</option>
              ))}
            </select>
          </div>
          {renderResourceStatus(
            listings.loading,
            listings.error,
            listings.items.length,
            listings.pagination.total,
          )}
          <Table
            columns={listingColumns}
            data={listings.items}
            getRowKey={(listing) => listing.id}
            emptyMessage="No directory listings found."
            caption="Directory listings"
          />
          <Pagination
            currentPage={getCurrentPage(listings.pagination)}
            totalPages={getTotalPages(listings.pagination)}
            onPageChange={(page) => handlePageChange(page, listingStatus, fetchDirectoryListingsStart)}
          />
        </section>
      )}

      {activeTab === 'analytics' && (
        <section>
          {analytics.loading && <p className="text-sm text-gray-500">Loading analytics...</p>}
          {analytics.error && <p className="text-sm text-red-600">{analytics.error}</p>}
          {analytics.data && (
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(analytics.data.totals).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-sm capitalize text-gray-500">{formatLabel(key)}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
                </div>
              ))}
              {Object.entries(analytics.data.moderation).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-orange-200 bg-orange-50 p-4 shadow-sm">
                  <p className="text-sm capitalize text-orange-700">{formatLabel(key)}</p>
                  <p className="mt-2 text-2xl font-bold text-orange-900">{value}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'auditLogs' && (
        <section>
          {renderResourceStatus(
            auditLogs.loading,
            auditLogs.error,
            auditLogs.items.length,
            auditLogs.pagination.total,
          )}
          <Table
            columns={auditLogColumns}
            data={auditLogs.items}
            getRowKey={(log) => log.id}
            emptyMessage="No directory audit logs found."
            caption="Directory audit logs"
          />
        </section>
      )}

      <Modal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
      >
        {confirmState.body}
      </Modal>
    </div>
  );
};

export default withAuth(DirectoryPage);
