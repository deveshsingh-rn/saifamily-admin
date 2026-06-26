'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table, { Column } from '../../components/Table';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import withAuth from '../../store/withAuth';
import {
  SANGHA_REPORT_STATUSES,
  deleteSanghaGroupStart,
  endLiveStreamStart,
  fetchLiveStreamsStart,
  fetchSanghaAnalyticsStart,
  fetchSanghaAuditLogsStart,
  fetchSanghaGroupsStart,
  fetchSanghaReportsStart,
  removeLiveStreamRecordingStart,
  resolveSanghaReportStart,
  selectSanghaAnalytics,
  selectSanghaAuditLogs,
  selectSanghaGroups,
  selectSanghaLiveStreams,
  selectSanghaMutationError,
  selectSanghaReports,
  selectSanghaSubmittingAction,
  unverifyGroupStart,
  verifyGroupStart,
} from '../../store/features/sangha/sanghaSlice';
import {
  AdminSanghaAuditLog,
  AdminSanghaGroup,
  AdminSanghaLiveStream,
  AdminSanghaReport,
  OffsetPagination,
} from '../../types/adminApi';

type SanghaTab = 'groups' | 'reports' | 'liveStreams' | 'analytics' | 'auditLogs';
type StatusFilter = 'all' | string;

interface ConfirmState {
  isOpen: boolean;
  title: string;
  body: string;
  onConfirm: () => void;
}

const PAGE_SIZE = 10;

const tabs: Array<{ id: SanghaTab; label: string }> = [
  { id: 'groups', label: 'Groups' },
  { id: 'reports', label: 'Reports' },
  { id: 'liveStreams', label: 'Live Streams' },
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

const SanghaPage = () => {
  const dispatch = useDispatch();
  const groups = useSelector(selectSanghaGroups);
  const reports = useSelector(selectSanghaReports);
  const liveStreams = useSelector(selectSanghaLiveStreams);
  const analytics = useSelector(selectSanghaAnalytics);
  const auditLogs = useSelector(selectSanghaAuditLogs);
  const submittingAction = useSelector(selectSanghaSubmittingAction);
  const mutationError = useSelector(selectSanghaMutationError);

  const [activeTab, setActiveTab] = useState<SanghaTab>('groups');
  const [reportStatus, setReportStatus] = useState<StatusFilter>('all');
  const [streamStatus, setStreamStatus] = useState<StatusFilter>('all');
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    body: '',
    onConfirm: () => undefined,
  });

  useEffect(() => {
    dispatch(fetchSanghaGroupsStart({ limit: PAGE_SIZE, offset: 0 }));
    dispatch(fetchSanghaReportsStart({ limit: PAGE_SIZE, offset: 0 }));
    dispatch(fetchLiveStreamsStart({ limit: PAGE_SIZE, offset: 0 }));
    dispatch(fetchSanghaAnalyticsStart());
    dispatch(fetchSanghaAuditLogsStart({ limit: 50, offset: 0 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSanghaReportsStart({
      limit: PAGE_SIZE,
      offset: 0,
      ...(reportStatus !== 'all' ? { status: reportStatus } : {}),
    }));
  }, [dispatch, reportStatus]);

  useEffect(() => {
    dispatch(fetchLiveStreamsStart({
      limit: PAGE_SIZE,
      offset: 0,
      ...(streamStatus !== 'all' ? { status: streamStatus } : {}),
    }));
  }, [dispatch, streamStatus]);

  const closeConfirm = () => {
    setConfirmState((current) => ({ ...current, isOpen: false }));
  };

  const confirmAndDispatch = (
    title: string,
    body: string,
    onConfirm: () => void,
  ) => {
    setConfirmState({
      isOpen: true,
      title,
      body,
      onConfirm: () => {
        onConfirm();
        closeConfirm();
      },
    });
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

  const groupColumns: Column<AdminSanghaGroup>[] = [
    { id: 'name', header: 'Name', accessor: 'name', cellClassName: 'whitespace-nowrap' },
    {
      id: 'purpose',
      header: 'Purpose',
      cellClassName: 'whitespace-nowrap capitalize',
      cell: (group) => formatLabel(group.purpose),
    },
    {
      id: 'owner',
      header: 'Owner',
      cell: (group) => group.owner.name || group.owner.handle || group.owner.id,
    },
    {
      id: 'location',
      header: 'Location',
      cell: (group) => [group.city, group.state, group.country].filter(Boolean).join(', ') || '—',
    },
    {
      id: 'official',
      header: 'Official',
      cellClassName: 'whitespace-nowrap',
      cell: (group) => group.isOfficial ? 'Yes' : 'No',
    },
    {
      id: 'members',
      header: 'Members',
      cellClassName: 'whitespace-nowrap',
      cell: (group) => group._count.members,
    },
    {
      id: 'actions',
      header: 'Actions',
      cellClassName: 'whitespace-nowrap',
      cell: (group) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={submittingAction === `group:${group.id}:${group.isOfficial ? 'unverify' : 'verify'}`}
            onClick={() => confirmAndDispatch(
              group.isOfficial ? 'Remove official verification' : 'Verify official group',
              `Are you sure you want to ${group.isOfficial ? 'unverify' : 'verify'} "${group.name}"?`,
              () => dispatch(group.isOfficial ? unverifyGroupStart(group.id) : verifyGroupStart(group.id)),
            )}
            className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {group.isOfficial ? 'Unverify' : 'Verify'}
          </button>
          <button
            type="button"
            disabled={submittingAction === `group:${group.id}:delete`}
            onClick={() => confirmAndDispatch(
              'Archive Sangha group',
              `Are you sure you want to archive "${group.name}"?`,
              () => dispatch(deleteSanghaGroupStart(group.id)),
            )}
            className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            Archive
          </button>
        </div>
      ),
    },
  ];

  const reportColumns: Column<AdminSanghaReport>[] = [
    { id: 'group', header: 'Group', cell: (report) => report.group?.name || '—' },
    {
      id: 'reporter',
      header: 'Reporter',
      cell: (report) => report.reporter.name || report.reporter.handle || report.reporter.id,
    },
    { id: 'target', header: 'Target', cell: (report) => `${report.targetType}: ${report.targetId}` },
    { id: 'reason', header: 'Reason', accessor: 'reason', cellClassName: 'capitalize' },
    {
      id: 'status',
      header: 'Status',
      cellClassName: 'whitespace-nowrap capitalize',
      cell: (report) => formatLabel(report.status),
    },
    {
      id: 'actions',
      header: 'Actions',
      cellClassName: 'whitespace-nowrap',
      cell: (report) => (
        <div className="flex gap-2">
          {(['resolved', 'dismissed'] as const).map((status) => (
            <button
              key={status}
              type="button"
              disabled={submittingAction === `report:${report.id}:resolve`}
              onClick={() => confirmAndDispatch(
                `Mark report ${status}`,
                `Are you sure you want to mark this Sangha report as ${status}?`,
                () => dispatch(resolveSanghaReportStart({
                  id: report.id,
                  status,
                  note: `Marked ${status} from admin panel.`,
                })),
              )}
              className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium capitalize text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {status}
            </button>
          ))}
        </div>
      ),
    },
  ];

  const streamColumns: Column<AdminSanghaLiveStream>[] = [
    { id: 'title', header: 'Title', accessor: 'title' },
    { id: 'group', header: 'Group', cell: (stream) => stream.group.name },
    {
      id: 'host',
      header: 'Host',
      cell: (stream) => stream.host.name || stream.host.handle || stream.host.id,
    },
    {
      id: 'status',
      header: 'Status',
      cellClassName: 'whitespace-nowrap capitalize',
      cell: (stream) => formatLabel(stream.status),
    },
    { id: 'viewers', header: 'Viewers', accessor: 'viewerCount', cellClassName: 'whitespace-nowrap' },
    {
      id: 'recording',
      header: 'Recording',
      cellClassName: 'whitespace-nowrap capitalize',
      cell: (stream) => stream.recordingStatus || '—',
    },
    {
      id: 'actions',
      header: 'Actions',
      cellClassName: 'whitespace-nowrap',
      cell: (stream) => (
        <div className="flex flex-wrap gap-2">
          {stream.status !== 'ended' && (
            <button
              type="button"
              disabled={submittingAction === `stream:${stream.id}:end`}
              onClick={() => confirmAndDispatch(
                'End live stream',
                `Are you sure you want to end "${stream.title}"?`,
                () => dispatch(endLiveStreamStart(stream.id)),
              )}
              className="rounded-md border border-orange-200 px-2 py-1 text-xs font-medium text-orange-700 hover:bg-orange-50 disabled:opacity-50"
            >
              End
            </button>
          )}
          {stream.recordingStatus && (
            <button
              type="button"
              disabled={submittingAction === `stream:${stream.id}:recording`}
              onClick={() => confirmAndDispatch(
                'Remove live-stream recording',
                `Are you sure you want to remove the recording for "${stream.title}"?`,
                () => dispatch(removeLiveStreamRecordingStart(stream.id)),
              )}
              className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              Remove recording
            </button>
          )}
        </div>
      ),
    },
  ];

  const auditColumns: Column<AdminSanghaAuditLog>[] = [
    { id: 'action', header: 'Action', accessor: 'action' },
    { id: 'entity', header: 'Entity', accessor: 'entity' },
    { id: 'entityId', header: 'Entity ID', accessor: 'entityId', cellClassName: 'whitespace-nowrap' },
    { id: 'actor', header: 'Actor ID', cell: (log) => log.actorId || 'System' },
    { id: 'created', header: 'Created', cell: (log) => formatDate(log.createdAt) },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Sangha Admin</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage Sangha groups, reports, live streams, analytics, and audit logs.
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

      {activeTab === 'groups' && (
        <section>
          {renderResourceStatus(groups.loading, groups.error, groups.items.length, groups.pagination.total)}
          <Table
            columns={groupColumns}
            data={groups.items}
            getRowKey={(group) => group.id}
            emptyMessage="No Sangha groups found."
            caption="Sangha groups"
          />
          <Pagination
            currentPage={getCurrentPage(groups.pagination)}
            totalPages={getTotalPages(groups.pagination)}
            onPageChange={(page) => dispatch(fetchSanghaGroupsStart({
              limit: PAGE_SIZE,
              offset: (page - 1) * PAGE_SIZE,
            }))}
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
              {SANGHA_REPORT_STATUSES.map((status) => (
                <option key={status} value={status}>{formatLabel(status)}</option>
              ))}
            </select>
          </div>
          {renderResourceStatus(reports.loading, reports.error, reports.items.length, reports.pagination.total)}
          <Table
            columns={reportColumns}
            data={reports.items}
            getRowKey={(report) => report.id}
            emptyMessage="No Sangha reports found."
            caption="Sangha reports"
          />
        </section>
      )}

      {activeTab === 'liveStreams' && (
        <section>
          <div className="mb-3">
            <select
              value={streamStatus}
              onChange={(event) => setStreamStatus(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 shadow-sm"
            >
              <option value="all">All statuses</option>
              {['scheduled', 'live', 'ended', 'cancelled'].map((status) => (
                <option key={status} value={status}>{formatLabel(status)}</option>
              ))}
            </select>
          </div>
          {renderResourceStatus(
            liveStreams.loading,
            liveStreams.error,
            liveStreams.items.length,
            liveStreams.pagination.total,
          )}
          <Table
            columns={streamColumns}
            data={liveStreams.items}
            getRowKey={(stream) => stream.id}
            emptyMessage="No Sangha live streams found."
            caption="Sangha live streams"
          />
        </section>
      )}

      {activeTab === 'analytics' && (
        <section>
          {analytics.loading && <p className="text-sm text-gray-500">Loading analytics...</p>}
          {analytics.error && <p className="text-sm text-red-600">{analytics.error}</p>}
          {analytics.data && (
            <div className="grid gap-4 md:grid-cols-3">
              {[analytics.data.groups, analytics.data.engagement, analytics.data.moderation].flatMap((bucket) =>
                Object.entries(bucket).map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-sm capitalize text-gray-500">{formatLabel(key)}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
                  </div>
                )),
              )}
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
            columns={auditColumns}
            data={auditLogs.items}
            getRowKey={(log) => log.id}
            emptyMessage="No Sangha audit logs found."
            caption="Sangha audit logs"
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

export default withAuth(SanghaPage);
