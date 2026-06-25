'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  fetchSanghaGroupsStart,
  addSanghaGroupStart,
  updateSanghaGroupStart,
  deleteSanghaGroupStart,
} from '@/app/store/features/sangha/sanghaSlice';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { SanghaGroup, UpdateSanghaGroupPayload } from '@/types/sanghaGroup';

// Note: Create form is simplified. A real form would need more fields
// like ownerUserId, purpose, privacy, etc.

export default function SanghaGroupsPage() {
  const dispatch = useDispatch();
  const { groups, loading, submitting, error } = useSelector(
    (state: RootState) => state.sangha
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<SanghaGroup | null>(null);
  const [formData, setFormData] = useState<UpdateSanghaGroupPayload>({ name: '', description: '' });

  useEffect(() => {
    dispatch(fetchSanghaGroupsStart());
  }, [dispatch]);

  const handleOpenDialog = (group: SanghaGroup) => {
    setCurrentGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentGroup(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentGroup) {
      dispatch(
        updateSanghaGroupStart({
          id: currentGroup.id,
          payload: formData,
        })
      );
    }
    // Create logic would be added here
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteSanghaGroupStart(id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Sangha Groups</h1>
        {/* <Button>Create Group</Button> */}
        <p className="text-sm text-muted-foreground">Create/Edit functionality is simplified for this phase.</p>
      </div>

      {loading && <p>Loading groups...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Privacy</TableHead>
                <TableHead>Members</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell><Badge variant="outline">{group.purpose}</Badge></TableCell>
                  <TableCell>{group.privacy}</TableCell>
                  <TableCell>{group._count?.members || 0}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(group)}>Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Archive</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will archive the group. It can be recovered later, but will be hidden from public view.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(group.id)}>Archive</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
            <DialogTitle>Edit Group: {currentGroup?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="description" className="text-right">Description</Label><Input id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" /></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}