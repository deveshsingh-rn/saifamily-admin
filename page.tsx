'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  fetchDirectoryListingsStart,
  updateDirectoryListingStart,
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
  DropdownMenuSeparator,
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
import { DirectoryListingStatus } from '@/types/directoryListing';
import { MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';

const statusColors: Record<
  DirectoryListingStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending_review: 'secondary',
  approved: 'default',
  rejected: 'destructive',
  suspended: 'destructive',
};

export default function DirectoryListingsPage() {
  const dispatch = useDispatch();
  const { listings, loading, submitting, error } = useSelector(
    (state: RootState) => state.directory
  );

  const [statusFilter, setStatusFilter] = useState<
    DirectoryListingStatus | 'all'
  >('pending_review');

  useEffect(() => {
    const filter = statusFilter === 'all' ? undefined : statusFilter;
    dispatch(fetchDirectoryListingsStart(filter));
  }, [dispatch, statusFilter]);

  const handleUpdate = (
    listingId: string,
    payload: { status?: DirectoryListingStatus; isVerified?: boolean }
  ) => {
    dispatch(updateDirectoryListingStart({ listingId, payload }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Moderate Directory Listings</h1>
        <div className="w-[180px]">
          <Select
            value={statusFilter}
            onValueChange={(value: DirectoryListingStatus | 'all') =>
              setStatusFilter(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending_review">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && <p>Loading listings...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">
                    {listing.businessName}
                  </TableCell>
                  <TableCell>{listing.owner?.name || 'N/A'}</TableCell>
                  <TableCell>{listing.city}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[listing.status]}>
                      {listing.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {listing.isVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
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
                        {listing.status === 'pending_review' && (
                          <>
                            <DropdownMenuItem onClick={() => handleUpdate(listing.id, { status: 'approved' })}>Approve</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdate(listing.id, { status: 'rejected' })}>Reject</DropdownMenuItem>
                          </>
                        )}
                        {listing.status === 'approved' && (
                          <DropdownMenuItem onClick={() => handleUpdate(listing.id, { status: 'suspended' })}>Suspend</DropdownMenuItem>
                        )}
                        {(listing.status === 'rejected' || listing.status === 'suspended') && (
                          <DropdownMenuItem onClick={() => handleUpdate(listing.id, { status: 'pending_review' })}>Restore to Pending</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {listing.isVerified ? (
                          <DropdownMenuItem onClick={() => handleUpdate(listing.id, { isVerified: false })}>Un-verify</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleUpdate(listing.id, { isVerified: true })}>Verify</DropdownMenuItem>
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