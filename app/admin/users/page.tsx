'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchUsersStart, 
    selectUsers, 
    selectUsersLoading, 
    selectUsersError,
    selectUsersCurrentPage,
    selectUsersTotalPages,
} from '../../store/features/users/usersSlice';
import withAuth from '../../store/withAuth';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';

const UsersPage = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const currentPage = useSelector(selectUsersCurrentPage);
  const totalPages = useSelector(selectUsersTotalPages);

  useEffect(() => {
    dispatch(fetchUsersStart({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(fetchUsersStart({ page, limit: 10 }));
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Status', accessor: 'isActive' },
  ];
  
  // Format data for the table
  const formattedUsers = users.map(user => ({...user, isActive: user.isActive ? 'Active' : 'Inactive'}));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Users</h1>
        {/* Add user button can go here */}
      </div>
      
      {loading && currentPage === 1 && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="bg-white shadow rounded-lg">
        <Table columns={columns} data={formattedUsers} />
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default withAuth(UsersPage);
