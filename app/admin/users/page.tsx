'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchUsersStart, 
    selectUsers, 
    selectUsersLoading, 
    selectUsersError,
    selectUsersCurrentPage,
    selectUsersTotalPages,
    selectUsersLimit,
    selectUsersTotal,
    selectUsersUpdatingUserId,
    updateUserStatusStart,
    User,
} from '../../store/features/users/usersSlice';
import withAuth from '../../store/withAuth';
import Table, { Column } from '../../components/Table';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { useDebounce } from '../../hooks/useDebounce';

type UserStatusFilter = 'all' | 'active' | 'inactive';

const UsersPage = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const currentPage = useSelector(selectUsersCurrentPage);
  const totalPages = useSelector(selectUsersTotalPages);
  const limit = useSelector(selectUsersLimit);
  const totalUsers = useSelector(selectUsersTotal);
  const updatingUserId = useSelector(selectUsersUpdatingUserId);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>('all');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(fetchUsersStart({
      limit,
      offset: 0,
      search: debouncedSearchTerm,
      status: statusFilter,
    }));
  }, [dispatch, debouncedSearchTerm, limit, statusFilter]);

  const handlePageChange = (page: number) => {
    dispatch(fetchUsersStart({
      limit,
      offset: (page - 1) * limit,
      search: debouncedSearchTerm,
      status: statusFilter,
    }));
  };
  
  const openModal = (user: User) => setModalState({ isOpen: true, user });
  const closeModal = () => setModalState({ isOpen: false, user: null });

  const handleConfirmStatusChange = () => {
    if (modalState.user) {
      dispatch(updateUserStatusStart({
        userId: modalState.user.id,
        isActive: !modalState.user.isActive,
      }));
      closeModal();
    }
  };

  const columns: Column<User>[] = [
    { id: 'id', header: 'ID', accessor: 'id', cellClassName: 'whitespace-nowrap' },
    {
      id: 'name',
      header: 'Name',
      cellClassName: 'whitespace-nowrap',
      cell: (row) => row.name || row.handle || 'Unnamed user',
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: (row) => row.email || row.mobileNumber || 'No contact',
    },
    {
      id: 'role',
      header: 'Role',
      accessor: 'role',
      cellClassName: 'whitespace-nowrap capitalize',
      cell: (row) => row.role.replaceAll('_', ' '),
    },
    { 
      id: 'status',
      header: 'Status', 
      accessor: 'isActive',
      cellClassName: 'whitespace-nowrap',
      cell: (row) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
        id: 'actions',
        header: 'Actions',
        cellClassName: 'whitespace-nowrap',
        cell: (row) => row.role === 'super_admin' ? (
          <span className="text-xs font-medium text-gray-500">
            Protected
          </span>
        ) : (
            <button 
                onClick={() => openModal(row)}
                disabled={updatingUserId === row.id}
                className={`px-3 py-1 text-sm rounded-md text-white disabled:cursor-not-allowed disabled:opacity-60 ${row.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
                {updatingUserId === row.id ? 'Saving...' : row.isActive ? 'Ban' : 'Unban'}
            </button>
        )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
            type="text"
            placeholder="Search users by name, email, mobile, or handle..."
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatusFilter)}
        >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
        </select>
      </div>
      
      <div className="mb-3 min-h-6">
        {loading && <p className="text-sm text-gray-500">Loading users...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && (
          <p className="text-sm text-gray-500">
            Showing {users.length} of {totalUsers} users.
          </p>
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <Table
          columns={columns}
          data={users}
          getRowKey={(user) => user.id}
          emptyMessage="No users match the current filters."
          caption="Admin users"
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmStatusChange}
        title="Confirm Status Change"
      >
        Are you sure you want to {modalState.user?.isActive ? 'ban' : 'unban'} the user &quot;{modalState.user?.name || modalState.user?.email || modalState.user?.id}&quot;?
      </Modal>
    </div>
  );
};

export default withAuth(UsersPage);
