'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSanghaGroupsStart, selectSanghaGroups, selectSanghaGroupsLoading, selectSanghaGroupsError } from '../../store/features/sangha/sanghaSlice';

const SanghaPage = () => {
  const dispatch = useDispatch();
  const groups = useSelector(selectSanghaGroups);
  const loading = useSelector(selectSanghaGroupsLoading);
  const error = useSelector(selectSanghaGroupsError);

  useEffect(() => {
    dispatch(fetchSanghaGroupsStart());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Sangha Groups</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {groups && (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Purpose</th>
              <th className="py-2 px-4 border-b">Privacy</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td className="py-2 px-4 border-b">{group.id}</td>
                <td className="py-2 px-4 border-b">{group.name}</td>
                <td className="py-2 px-4 border-b">{group.purpose}</td>
                <td className="py-2 px-4 border-b">{group.privacy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SanghaPage;
