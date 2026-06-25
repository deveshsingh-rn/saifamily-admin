'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  fetchDirectoryReportsStart,
  resolveDirectoryReportStart,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DirectoryReportStatus } from '@/types/directoryReport';

const statusColors: Record<
  DirectoryReportStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  resolved: 'default',
  dismissed: 'outline',
};

export default function DirectoryReportsPage() {
  const dispatch = useDispatch();
  const { reports, loading, submitting, error } = useSelector(
    (state: RootState) => state.directory
  );

  const [statusFilter, setStatusFilter] = useState<
    DirectoryReportStatus | 'all'
  >('pending');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  useEffect(() => {
    const filter = statusFilter === 'all' ? undefined : statusFilter;
    dispatch(fetchDirectoryReportsStart(filter));
  }, [dispatch, statusFilter]);

  const openResolveDialog = (reportId: string) => {
    setSelectedReportId(reportId);
    setResolutionNote('');
    setIsDialogOpen(true);
  };

  const handleResolve = (status: 'resolved' | 'dismissed') => {
    if (!selectedReportId) return;
    dispatch(
      resolveDirectoryReportStart({
        reportId: selectedReportId,
        status,
        note: resolutionNote,
      })
    );
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Moderate Directory Reports</h1>
        <div className="w-[180px]">
          <Select
            value={statusFilter}
            onValueChange={(value: DirectoryReportStatus | 'all') =>
              setStatusFilter(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && <p>Loading reports...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {report.listing?.businessName || 'N/A'}
                  </TableCell>
                  <TableCell>{report.user?.name || 'N/A'}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {report.details || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[report.status]}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {report.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openResolveDialog(report.id)}
                        disabled={submitting}
                      >
                        Resolve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="note">Resolution Note (Optional)</Label>
            <Textarea
              id="note"
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Add a note for internal records..."
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={() => handleResolve('dismissed')} disabled={submitting}>
              Dismiss
            </Button>
            <Button onClick={() => handleResolve('resolved')} disabled={submitting}>
              Mark as Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}