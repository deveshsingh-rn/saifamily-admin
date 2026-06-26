'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSanghaGroupsStart, selectSanghaGroups, selectSanghaGroupsLoading, selectSanghaGroupsError } from '../../store/features/sangha/sanghaSlice';
import withAuth from '../../store/withAuth';
import Table, { Column } from '../../components/Table';
import { SanghaGroup } from '../../../sanghaGroup';

const SanghaPage = () => {
  const dispatch = useDispatch();
  const groups = useSelector(selectSanghaGroups);
  const loading = useSelector(selectSanghaGroupsLoading);
  const error = useSelector(selectSanghaGroupsError);

  useEffect(() => {
    dispatch(fetchSanghaGroupsStart());
  }, [dispatch]);

  const columns: Column<SanghaGroup>[] = [
    { id: 'id', header: 'ID', accessor: 'id', cellClassName: 'whitespace-nowrap' },
    { id: 'name', header: 'Name', accessor: 'name', cellClassName: 'whitespace-nowrap' },
    {
      id: 'purpose',
      header: 'Purpose',
      cellClassName: 'whitespace-nowrap capitalize',
      cell: (group) => group.purpose.replaceAll('_', ' '),
    },
    {
      id: 'privacy',
      header: 'Privacy',
      accessor: 'privacy',
      cellClassName: 'whitespace-nowrap capitalize',
    },
    {
      id: 'status',
      header: 'Status',
      cellClassName: 'whitespace-nowrap',
      cell: (group) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${group.activityStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
          {group.activityStatus}
        </span>
      ),
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
      cell: (group) => group._count?.members ?? 0,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Sangha Groups</h1>
      <div className="mb-3 min-h-6">
        {loading && <p className="text-sm text-gray-500">Loading Sangha groups...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && (
          <p className="text-sm text-gray-500">
            Showing {groups.length} Sangha groups.
          </p>
        )}
      </div>

      <div className="bg-white shadow rounded-lg">
        <Table
          columns={columns}
          data={groups}
          getRowKey={(group) => group.id}
          emptyMessage="No Sangha groups found."
          caption="Sangha groups"
        />
      </div>
      {!loading && !error && (
        <p className="mt-3 text-xs text-gray-500">
          Mutating Sangha groups is intentionally kept behind disposable-fixture tests before enabling destructive admin flows.
        </p>
      )}
    </div>
  );
};

export default withAuth(SanghaPage);
