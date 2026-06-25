'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  fetchDirectoryReviewsStart,
  updateDirectoryReviewStatusStart,
  restoreDirectoryReviewStart,
} from '@/store/directory/directory.slice';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DirectoryReviewStatus } from '@/types/directoryReview';
import { MoreHorizontal } from 'lucide-react';

const statusColors: Record<
  DirectoryReviewStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
  hidden: 'outline',
};

export default function DirectoryReviewsPage() {
  const dispatch = useDispatch();
  const { reviews, loading, submitting, error } = useSelector(
    (state: RootState) => state.directory
  );

  const [statusFilter, setStatusFilter] = useState<
    DirectoryReviewStatus | 'all'
  >('pending');

  useEffect(() => {
    const filter = statusFilter === 'all' ? undefined : statusFilter;
    dispatch(fetchDirectoryReviewsStart(filter));
  }, [dispatch, statusFilter]);

  const handleStatusChange = (
    reviewId: string,
    status: DirectoryReviewStatus
  ) => {
    dispatch(updateDirectoryReviewStatusStart({ reviewId, status }));
  };

  const handleRestore = (reviewId: string) => {
    dispatch(restoreDirectoryReviewStart(reviewId));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Moderate Directory Reviews</h1>
        <div className="w-[180px]">
          <Select
            value={statusFilter}
            onValueChange={(value: DirectoryReviewStatus | 'all') =>
              setStatusFilter(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && <p>Loading reviews...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">
                    {review.listing?.title || 'N/A'}
                  </TableCell>
                  <TableCell>{review.user?.name || 'N/A'}</TableCell>
                  <TableCell>{review.rating}/5</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {review.comment}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[review.status]}>
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={submitting}
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {review.status !== 'approved' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(review.id, 'approved')}>Approve</DropdownMenuItem>
                        )}
                        {review.status !== 'rejected' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(review.id, 'rejected')}>Reject</DropdownMenuItem>
                        )}
                        {review.status !== 'hidden' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(review.id, 'hidden')}>Hide</DropdownMenuItem>
                        )}
                        {(review.status === 'hidden' || review.status === 'rejected') && (
                          <DropdownMenuItem onClick={() => handleRestore(review.id)}>Restore (Approve)</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}