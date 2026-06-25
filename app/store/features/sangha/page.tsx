'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchSanghaAuditLogsStart } from '@/app/store/features/sangha/sanghaSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';

export default function SanghaAuditLogsPage() {
  const dispatch = useDispatch();
  const { auditLogs, loadingAuditLogs, error } = useSelector(
    (state: RootState) => state.sangha
  );
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20; // Items per page

  useEffect(() => {
    dispatch(fetchSanghaAuditLogsStart({ page: currentPage, limit }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= auditLogs.totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sangha Audit Logs</h1>

      {loadingAuditLogs && <p>Loading audit logs...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loadingAuditLogs && !error && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {log.admin?.name || 'System'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{log.action}</Badge>
                  </TableCell>
                  <TableCell>
                    {log.target.type}: {log.target.id}
                  </TableCell>
                  <TableCell>
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">Page {auditLogs.currentPage} of {auditLogs.totalPages}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}